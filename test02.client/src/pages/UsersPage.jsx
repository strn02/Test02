import React, { useEffect, useState } from "react";
import "./UsersPage.css"; // CSSをインポート

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [expanded, setExpanded] = useState({}); // 詳細表示の状態

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

    const toggleExpand = (empNo) => {
        setExpanded((prev) => ({ ...prev, [empNo]: !prev[empNo] }));
    };

    return (
        <div className="user-list-container">
            <h2>ユーザー一覧</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>社員番号</th>
                        <th>氏名</th>
                        <th>氏名カナ</th>
                        <th>電話番号</th>
                        <th>メールアドレス</th>
                        <th>役職</th>
                        <th>PCアカウント権限</th>
                        <th>更新日</th>
                        <th>詳細</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <React.Fragment key={u.employeeNo}>
                            <tr>
                                <td>{u.employeeNo}</td>
                                <td>{u.name}</td>
                                <td>{u.nameKana}</td>
                                <td>{u.telNo}</td>
                                <td>{u.mailAddress}</td>
                                <td>{u.position}</td>
                                <td>{u.accountLevel}</td>
                                <td>{new Date(u.updateDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="detail-button"
                                        onClick={() => toggleExpand(u.employeeNo)}
                                    >
                                        {expanded[u.employeeNo] ? "閉じる" : "詳細"}
                                    </button>
                                </td>
                            </tr>

                            {expanded[u.employeeNo] && (
                                <tr>
                                    <td colSpan="9">
                                        <div className="detail-wrapper">
                                            <table className="detail-table">
                                                <tbody>
                                                    <tr>
                                                        <td>所属部署</td>
                                                        <td>{u.department}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>年齢</td>
                                                        <td>{u.age}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>性別</td>
                                                        <td>
                                                            {u.gender === null
                                                                ? "-"
                                                                : u.gender === 0
                                                                    ? "男性"
                                                                    : u.gender === 1
                                                                        ? "女性"
                                                                        : u.gender === 2
                                                                            ? "その他"
                                                                            : u.gender}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>退職日</td>
                                                        <td>
                                                            {u.retireDate
                                                                ? new Date(u.retireDate).toLocaleDateString()
                                                                : "-"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>登録日</td>
                                                        <td>
                                                            {u.registerDate
                                                                ? new Date(u.registerDate).toLocaleDateString()
                                                                : "-"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>論理削除フラグ</td>
                                                        <td>{u.deleteFlag ? "削除" : "有効"}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
