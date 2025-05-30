function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const error = document.getElementById("loginError");

  fetch(`https://script.google.com/macros/s/AKfycbwzx3Xw3AG5nlirhS89yVM9gb-6vMAI8KyI9BznZDaWKEvi71epGMvDD7YQDgu4I_bx/exec?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`)
    .then(res => res.text())
    .then(role => {
      if (role === "staff") {
        localStorage.setItem("username", user);
        localStorage.setItem("role", role);
        window.location.href = "leave.html";
      } else if (role === "manager" || role === "admin") {
        localStorage.setItem("username", user);
        localStorage.setItem("role", role);
        window.location.href = "manager.html";
      } else {
        error.textContent = "❌ 帳號或密碼錯誤";
      }
    })
    .catch(err => {
      error.textContent = "❌ 登入失敗：" + err;
    });
} // 👈 這行是你漏掉的結尾大括號！
