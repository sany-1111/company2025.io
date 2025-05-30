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

    // 顯示姓名文字
  document.getElementById("displayName").textContent = name ;

  // 放入隱藏欄位供送出用
  document.getElementById("realName").value = name ;

  // 防止上一頁返回
  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    history.go(1);
  };
};
