let submitted = false;

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "index.html";
}

window.onload = function () {
  const user = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (!user || role !== "staff") {
    alert("請先登入");
    window.location.href = "index.html";
  }

  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    history.go(1);
  };
};
