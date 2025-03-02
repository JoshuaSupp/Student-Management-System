import "../css/Navbar.css";
function Navbar() {
    return (
        <nav>
            <h2>Admin Portal</h2>
            <div id="Links">
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/home">Students</a></li>
                    <li><a href="/courses">Courses</a></li>
                    <li><a href="/">Log Out</a></li>
                </ul>
            </div>
        </nav>
    )
}
export default Navbar;