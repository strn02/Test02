// src/layout/MainLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MainLayout.css";

export default function MainLayout() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // ログイン情報を localStorage から取得
        const authData = JSON.parse(localStorage.getItem("auth"));
        if (authData) {
            setUserName(authData.name ?? authData.employeeNo ?? "");
        } 
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth");
        navigate("/login");
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="hello">
                    こんにちは
                    <div className="user-name">{userName}</div>
                </div>
                <nav className="menu">
                    <button className="menu-btn" onClick={() => navigate("/rental")}>貸出状況</button>
                    <button className="menu-btn" onClick={() => navigate("/assets")}>機器一覧</button>
                    <button className="menu-btn" onClick={() => navigate("/users")}>ユーザー一覧</button>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    LOGOUT
                </button>
            </aside>

            <main className="main-content">
                {/* ページごとに切り替わる部分 */}
                <Outlet />
            </main>
        </div>
    );
}
