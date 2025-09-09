import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ employeeNo: id, password })
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                // ログイン成功
                alert(data.message);
                onLoginSuccess(data.employeeNo ?? id);
            } else {
                setError({ general: data.message || 'ログインに失敗' });
                // ログイン失敗
            }
        } catch {
            setError({ general: 'サーバーに接続できません' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Login</h2>
                <div className="form-group">
                    <label className="form-label">ID</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                {error.general && <div className="error-message">{error.general}</div>}
                <button type="submit" className="login-btn">Login</button>
            </form>
        </div>
    );
};

export default Login;
