import { useEffect, useMemo, useState } from "react";
import './TopPage.css';

export default function TopPage({ onLogout }) {
    const auth = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('auth'));
        }
        catch {
            return null;
        }
    }, []);

    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fmtDate = (date) => (date ? new Date(date).toLocaleString() : '');

    useEffect(() => {
        const emp = auth?.employeeNo;
        if (!emp)
            return;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/auth/me?employeeNo=${encodeUROComponent(emp)}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data?.message || '取得に失敗しました');
                }
                setMe(data);
            } catch (err) {
                setError(err.message || 'サーバーに接続できません');
            } finally {
                setLoading(false);
            }
        })();
    }, [auth?.employeeNo]);

    const handleReturn = async () => {
        if (!me?.employeeNo) return;
        if (!window.confirm('本当に返却しますか？')) return;

        try {
            const res = await fetch('/auth/return', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ employeeNo: me.employeeNo })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || '返却に失敗しました');
            }

            const refresh = await fetch(`/auth/me?employeeNo=${encodeURIComponent(me.employeeNo)}`);
            const next = await refresh.json();
            if (refresh.ok) {
                setMe(next);
            }
            alert('返却が完了しました');
        } catch (err) {
            alert(err.message || '返却に失敗しました');
        }
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="hello">こんにちは</div>
                <div className="username">{me?.name || 'USER名'}</div>

                <nav className="menu">
                    <button className="menu-btn">貸出状況一覧</button>
                    <button className="menu-btn">機器一覧</button>
                    <button className="menu-btn">ユーザー一覧</button>
                </nav>

                <button className="logout-btn" onClick={onLogout}>ログアウト</button>
            </aside>

            <main className="main-content">
                {loading && <div className="loading">読み込み中...</div>}
                {err && <div className="error">{err}</div>}

                {!loading && !err && (
                    <>
                        <h1 className="emp-name">{me?.name || '社員指名'}</h1>

                        <div>
                            <span className="label">貸出状態:</span>
                            <span className={`badge ${me?.rental?.status === '貸出中' ? 'bad' : 'good'}`}>
                                {me?.rental?.status === '貸出中' ? '貸出中' : 'なし'}
                            </span>
                        </div>

                        {me?.rental?.status === '貸出中' && (
                            <>
                                <div className="detail-row">貸出機器：<strong>{me.rental.assetNo || null}</strong></div>
                                <div className="detail-row">貸 出 日：{fmtDate(me.rental.rentalDate)}</div>
                                <div className="detail-row">締 切 日：{fmtDate(me.rental.dueDate)}</div>

                                <button className="return-btn" onClick={handleReturn}>返却</button>
                            </>
                        )}
                    </>

                )}
            </main>
        </div>
    );
}