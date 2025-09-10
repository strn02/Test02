// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/Login";
import TopPage from "./pages/TopPage";
import RentalPage from "./pages/RentalPage";
import UsersPage from "./pages/UsersPage";
import AssetsPage from "./pages/AssetsPage";
import MainLayout from "./layout/MainLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ログインページ */}
                <Route path="/login" element={<Login />} />

                {/* サイドバー付きのページたち */}
                <Route element={<MainLayout />}>
                    <Route path="/top" element={<TopPage />} />
                    <Route path="/rental" element={<RentalPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/assets" element={<AssetsPage />} />
                </Route>

                {/* デフォルトは /login に飛ばす */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
