function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "index.html";
}

function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-section").forEach(div => div.style.display = "none");
  const tabBtn = document.querySelector(`.tab-btn[onclick="switchTab('${tab}')"]`);
  const tabContent = document.getElementById(tab + "Tab");
  if (tabBtn) tabBtn.classList.add("active");
  if (tabContent) tabContent.style.display = "block";
  if (tab === "account") loadAllAccounts();
  if (tab === "leave") loadLeaveData();
  if (tab === "schedule") loadScheduleData();
}

function loadLeaveData() {
  fetch("https://script.google.com/macros/s/AKfycbzmP06TY1DdBp8vfaHgvF72Za8f9GlGIbhWeqFmgKFYvmE1FitgTevRyFGPIgcySkui/exec")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#leaveTable tbody");
      if (!tbody) return;
      tbody.innerHTML = "";
      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.name || ""}</td>
          <td>${row.date || ""}</td>
          <td>${row.type || ""}</td>
          <td>${row.time || ""}</td>
          <td>${row.reason || ""}</td>
          <td>${new Date(row["Timestamp"] || row["送出時間"]).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      alert("❌ 請假資料讀取失敗");
      console.error(err);
    });
}

function loadAllAccounts() {
  fetch("https://script.google.com/macros/s/AKfycbwzx3Xw3AG5nlirhS89yVM9gb-6vMAI8KyI9BznZDaWKEvi71epGMvDD7YQDgu4I_bx/exec?action=read")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#accountTable tbody");
      if (!tbody) return;
      tbody.innerHTML = "";
      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.username || ""}</td>
          <td>${row.password || ""}</td>
          <td>${row.role || ""}</td>
          <td>${row.name || ""}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      alert("❌ 帳號資料讀取失敗");
      console.error(err);
    });
}

function loadScheduleData() {
  fetch("https://script.google.com/macros/s/AKfycbwT_S7ffcsEwv4EeKk0ZLYKgUoHmOuM77Q7l9I8C4XK11wiehRgdQAmRM3jdCP8dX5D/exec?action=readSchedule")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("scheduleTab");
      if (!container) return;

      container.innerHTML = '<h3>📆 排班表</h3>';

      const select = document.createElement("select");
      for (let day = 1; day <= 31; day++) {
        const option = document.createElement("option");
        option.value = day;
        option.textContent = `${day} 日`;
        select.appendChild(option);
      }
      container.appendChild(select);

      const table = document.createElement("table");
      table.innerHTML = `
        <thead><tr><th>時段</th><th>上班人員</th></tr></thead>
        <tbody></tbody>
      `;
      const tbody = table.querySelector("tbody");
      const hours = [
        "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00",
        "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00",
        "20:00-21:00", "21:00-22:00", "22:00-23:00"
      ];
      hours.forEach(h => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${h}</td><td></td>`;
        tbody.appendChild(tr);
      });
      container.appendChild(table);

      select.addEventListener("change", () => {
        const selectedDay = select.value;
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach((tr, idx) => {
          const hour = hours[idx];
          const key = `${selectedDay}_${hour}`;
          const value = data[key] || "";
          tr.cells[1].textContent = value;
        });
      });

      select.dispatchEvent(new Event("change"));
    })
    .catch(err => {
      console.error("❌ 載入班表失敗", err);
    });
}

function registerUser() {
  const name = document.getElementById("newRealName").value.trim();
  const user = document.getElementById("newUser").value.trim();
  const pass = document.getElementById("newPass").value.trim();
  const email = document.getElementById("newEmail").value.trim();
  const role = document.getElementById("newRole").value;
  const msg = document.getElementById("registerMsg");

  if (!name || !user || !pass || !email) {
    msg.style.color = "red";
    msg.textContent = "❗請輸入完整資料";
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbwzx3Xw3AG5nlirhS89yVM9gb-6vMAI8KyI9BznZDaWKEvi71epGMvDD7YQDgu4I_bx/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=register&name=${encodeURIComponent(name)}&username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&email=${encodeURIComponent(email)}&role=${role}`
  })
    .then(res => res.text())
    .then(result => {
      if (result === "OK") {
        msg.style.color = "green";
        msg.textContent = "✅ 帳號建立成功";
        document.getElementById("newRealName").value = "";
        document.getElementById("newUser").value = "";
        document.getElementById("newPass").value = "";
        document.getElementById("newEmail").value = "";
        document.getElementById("newRole").value = "staff";
        loadAllAccounts();
      } else if (result === "EXISTS") {
        msg.style.color = "red";
        msg.textContent = "⚠️ 帳號已存在";
      } else {
        msg.style.color = "red";
        msg.textContent = "❌ 建立失敗：" + result;
      }
    })
    .catch(err => {
      msg.style.color = "red";
      msg.textContent = "❌ 網路錯誤：" + err;
    });
}

window.onload = function () {
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("username");

  if (role === "manager" || role === "admin") {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.style.display = "block";

    const tabContainer = document.querySelector(".tabs");
    if (tabContainer) tabContainer.style.display = "flex";

    switchTab("leave");
  } else {
    alert("請先登入");
    window.location.href = "index.html";
  }

  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    history.go(1);
  };
};
