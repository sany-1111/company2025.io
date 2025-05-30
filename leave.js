let submitted = false;

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("realname"); // 可選，清除真實姓名
  window.location.href = "index.html";
}

window.onload = function () {
  const user = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("realname");

  if (!user || role !== "staff") {
    alert("請先登入");
    window.location.href = "index.html";
    return;
  }

  // ✅ 自動填入真實姓名
  const nameInput = document.querySelector("input[name='name']");
  if (nameInput && name) {
    nameInput.value = name;
    nameInput.readOnly = true;
  }

  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    history.go(1);
  };
};
