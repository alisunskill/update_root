import Swal from "sweetalert2";


export const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userID");
  localStorage.removeItem("email");

  Swal.fire({
    text: "User is Logout.",
    icon: "info",
  }).then(() => {
  });
};
