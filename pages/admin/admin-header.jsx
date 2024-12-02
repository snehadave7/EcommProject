import { AlignJustify } from "lucide-react";
import { LogOut } from "lucide-react";
import { Button } from "react-bootstrap"; // Use Bootstrap's Button component
import { logout } from "../../store/userSlice"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
    navigate("/login");
  };
  return (
    <header className="d-flex align-items-center justify-content-between px-3 py-2 bg-light border-bottom">
      <Button onClick={() => setOpen(true)} className="d-lg-none d-block">
        <AlignJustify />
        <span className="visually-hidden">Toggle Menu</span>
      </Button>
      <div className="d-flex flex-grow-1 justify-content-end">
        <Button onClick={handleLogout}>
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
