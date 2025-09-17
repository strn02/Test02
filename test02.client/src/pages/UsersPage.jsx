import React, { useEffect, useState } from "react";
import "./UsersPage.css"; // CSSをインポート

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [showDetails, setShowDetails] = useState(false); // 詳細表示の状態

    const [showRegisterPopup, setShowRegisterPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/user/list");
                if (!res.ok) throw new Error("ユーザー一覧の取得に失敗しました");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("ユーザー一覧取得失敗:", err);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>ユーザー一覧</h1>

            { /*登録・削除ボタン*/}
            <div className="table-action-buttons">
                <button className="main-button" onClick={() => setShowRegisterPopup(true)}>＋</button>
                <button className="main-button" onClick={() => setShowDeletePopup(true)}>ー</button>
            </div>

            { /*ユーザー一覧テーブル*/}
            <div className="user-list-container">
                    <table className="user-table">
                        <thead>
                        <tr>
                            <th></th>{/* 編集用の空ヘッダー */} 
                                <th>社員番号</th>
                                <th>氏名</th>
                                <th>氏名カナ</th>
                                <th>電話番号</th>
                                <th>メールアドレス</th>
                                <th>役職</th>
                                <th>PCアカウント権限</th>
                                <th>更新日</th>
                                {showDetails && (
                                    <>
                                        <th>所属部署</th>
                                        <th>年齢</th>
                                        <th>性別</th>
                                        <th>退職日</th>
                                        <th>登録日</th>
                                        <th>論理削除フラグ</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.employeeNo}>
                                    {/* 編集ボタン */}
                                    <td>
                                        <button className="main-button" onClick={() => setShowEditPopup(u.employeeNo)}>🖊</button>
                                    </td>
                                    <td>{u.employeeNo}</td>
                                    <td>{u.name}</td>
                                    <td>{u.nameKana}</td>
                                    <td>{u.telNo}</td>
                                    <td>{u.mailAddress}</td>
                                    <td>{u.position}</td>
                                    <td>{u.accountLevel}</td>
                                    <td>{u.updateDate}</td>
                                    {showDetails && (
                                        <>
                                            <td>{u.department}</td>
                                            <td>{u.age}</td>
                                            <td>{u.gender === 0 ? "男性" : u.gender === 1 ? "女性" : u.gender === 2 ? "その他" : u.gender}</td>
                                            <td>{u.retireDate}</td>
                                            <td>{u.registerDate}</td>
                                            <td>{u.deleteFlag ? "削除" : "有効"}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>

            { /*詳細ボタン*/}
            <div className="detail-button-container">
                <button className="main-button" onClick={() => setShowDetails((prev) => !prev)}>
                    {showDetails ? "閉じる" : "…"}
                </button>
            </div>

            { /*登録ポップアップ*/}
            {showRegisterPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>ユーザー登録</h2>
                        {/* 登録フォームの内容 */}
                        <button className="close-button" onClick={() => setShowRegisterPopup(false)}>閉じる</button>
                    </div>
                </div>
            )}

            { /*削除ポップアップ*/}
            {showDeletePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>ユーザー削除</h2>
                        {/* 削除フォームの内容 */}
                        <button className="close-button" onClick={() => setShowDeletePopup(false)}>閉じる</button>
                    </div>
                </div>
            )}

            { /*編集ポップアップ*/}
            {showEditPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>ユーザー編集 - 社員番号: {showEditPopup}</h2>
                        {/* 編集フォームの内容 */}
                        <button className="close-button" onClick={() => setShowEditPopup(null)}>閉じる</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserList;
