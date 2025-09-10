// src/layout/MainLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";

export default function MainLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("auth");
        navigate("/login");
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="hello">こんにちは</div>
                <nav className="menu">
                    <button onClick={() => navigate("/rental")}>貸出状況一覧</button>
                    <button onClick={() => navigate("/assets")}>機器一覧</button>
                    <button onClick={() => navigate("/users")}>ユーザー一覧</button>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    ログアウト
                </button>
            </aside>

            <main className="main-content">
                {/* ページごとに切り替わる部分 */}
                <Outlet />
            </main>
        </div>
    );
}
