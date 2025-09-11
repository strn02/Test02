import { useEffect, useMemo, useState } from "react";
import "./TopPage.css";

export default function TopPage() {
    const auth = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("auth"));
        } catch {
            return null;
        }
    }, []);

    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fmtDate = (date) => (date ? new Date(date).toLocaleString() : "");

    // --- API: ユーザー情報取得 ---
    const fetchMe = async () => {
        const emp = auth?.employeeNo;
        if (!emp) return;

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/auth/me?employeeNo=${encodeURIComponent(emp)}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "取得に失敗しました");
            setMe(data);
        } catch (err) {
            setError(err.message || "サーバーに接続できません");
        } finally {
            setLoading(false);
        }
    };

    // --- 初回ロード ---
    useEffect(() => {
        fetchMe();
    }, [auth?.employeeNo]);

    // --- 返却処理 ---
    const handleReturn = async () => {
        if (!auth?.employeeNo) return;

        try {
            const res = await fetch("/auth/return", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeNo: auth.employeeNo }),
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data?.message || "返却に失敗しました");
                return;
            }

            alert("返却が完了しました");
            // 最新状態を再取得して画面を更新
            await fetchMe();

        } catch (err) {
            alert("サーバーエラー: " + err.message);
        }
    };

    return (
        <div className="top-card">
            {loading && <div className="loading">読み込み中...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && (
                <>
                    <h1 className="emp-name">{me?.name || "社員名"}</h1>

                    <div className="status-row">
                        <span className="label">貸出状態:</span>
                        <span className={`badge ${me?.rental?.status === "貸出中" ? "bad" : "good"}`}>
                            {me?.rental?.status === "貸出中" ? "貸出中" : "なし"}
                        </span>
                    </div>

                    {me?.rental?.status === "貸出中" && (
                        <>
                            <div className="detail-row">貸出機器：{me.rental.assetNo || "-"} </div>
                            <div className="detail-row">貸 出 日：{fmtDate(me.rental.rentalDate)}</div>
                            <div className="detail-row">締 切 日：{fmtDate(me.rental.dueDate)}</div>
                            <div className="btn-row"><button className="return-btn" onClick={handleReturn}>返却</button></div>
                            
                        </>
                    )}
                </>
            )}
        </div>
    );
}
