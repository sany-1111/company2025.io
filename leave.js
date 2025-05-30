let submitted = false;

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("realname");
  window.location.href = "index.html";
}

window.onload = function () {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("realname");

  // 檢查登入身分
  if (!role || role !== "staff") {
    alert("請先登入");
    window.location.href = "index.html";
    return;
  }

  // 自動填入「真實姓名」欄位
  const nameInput = document.getElementById("realName");
  if (nameInput && name) {
    nameInput.value = name;
    nameInput.readOnly = true;
  }

  // 防止上一頁返回
  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    history.go(1);
  };
};
