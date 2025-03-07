import "../css/Navbar.css";
import { useAuth } from "../context/AuthContext";
function Navbar() {
    const auth = useAuth();
    return (
        <nav>
            <h2>Admin Portal</h2>
            <div id="Links">
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/students">Students</a></li>
                    <li><a href="/courses">Courses</a></li>
                    <li><a href="/login">Logout</a></li>
                </ul>
            </div>
        </nav>
    )
}
export default Navbar;