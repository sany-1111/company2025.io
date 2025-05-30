function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorText = document.getElementById("loginError");

  if (!user || !pass) {
    errorText.textContent = "請輸入帳號和密碼";
    return;
  }

  fetch(`https://script.google.com/macros/s/AKfycbwzx3Xw3AG5nlirhS89yVM9gb-6vMAI8KyI9BznZDaWKEvi71epGMvDD7YQDgu4I_bx/exec?username=${user}&password=${pass}`)
    .then(res => res.text())
    .then(text => {
      try {
        const result = JSON.parse(text);
        if (result.role) {
          localStorage.setItem("username", user);
          localStorage.setItem("role", result.role);
          localStorage.setItem("name", result.name || ""); // ✅ 儲存真實姓名
          if (result.role === "staff") {
            window.location.href = "leave.html";
          } else {
            window.location.href = "manager.html";
          }
        } else {
          errorText.textContent = "登入失敗：" + text;
        }
      } catch (err) {
        errorText.textContent = "登入錯誤：" + text;
      }
    })
    .catch(err => {
      errorText.textContent = "❌ 無法連線：" + err;
    });
}
