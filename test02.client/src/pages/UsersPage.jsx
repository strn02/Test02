import React, { useEffect, useState } from "react";
import "./UsersPage.css"; // CSSをインポート

const initialFormData = {
    employeeNo: "",
    name: "",
    nameKana: "",
    telNo: "",
    mailAddress: "",
    age: "",
    gender: "0",
    position: "",
    accountLevel: "",
    department: "",
    retireDate: null,
};

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [showDetails, setShowDetails] = useState(false); // 詳細表示の状態

    const [deleteMode, setDeleteMode] = useState(false); //削除モード化どうか

    const [showRegisterPopup, setShowRegisterPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(null);

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchUsers();
    }, []);

    {/*一覧表示*/ }
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

    {/*ユーザー登録*/ }
    const handleRegisterSubmit = async (e) => {
        const payload = {
            ...formData,
            age: formData.age ? parseInt(formData.age, 10) : null,
            gender: formData.gender ? parseInt(formData.gender, 10) : null,
            retireDate: null,
            deleteFlag: false
        };


        try {
            const res = await fetch("/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("登録に失敗しました");

            alert("登録が完了しました");
            setShowRegisterPopup(false);

            setFormData(initialFormData);

            fetchUsers();

        } catch (err) {
            console.error(err);
            alert("登録失敗しました");
        }
    };

    const handleRegisterCancel = () => {
        setFormData(initialFormData); // キャンセル時リセット
        setShowRegisterPopup(false);
    };

    {/*ユーザー削除*/ }
    const handleDelete = async (empNo) => {
        try {
            const res = await fetch("/user/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeNo: empNo })
            });

            if (!res.ok) throw new Error("削除に失敗しました");

            alert("削除しました");
            setShowDeletePopup(false);
            fetchUsers(); // 再取得して一覧を更新
        } catch (err) {
            console.error(err);
            alert("削除失敗しました");
        }
    };

    {/*ユーザー編集*/ }
    const handleEdit = (user) => {
        setFormData({
            employeeNo: user.employeeNo,
            name: user.name,
            nameKana: user.nameKana,
            telNo: user.telNo,
            mailAddress: user.mailAddress,
            position: user.position,
            accountLevel: user.accountLevel,
            department: user.department,
            age: user.age?.toString() || "",
            gender: user.gender?.toString() ?? "0",
            retireDate: user.retireDate || null,
        });
        setShowEditPopup(true);
    };

    const handleEditSubmit = async () => {
        const payload = {
            ...formData,
            age: formData.age ? parseInt(formData.age, 10) : null,
            gender: formData.gender ? parseInt(formData.gender, 10) : null,
        };

        try {
            const res = await fetch("/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("更新に失敗しました");

            alert("更新が完了しました");
            setShowEditPopup(null);
            setFormData(initialFormData);
            fetchUsers(); // 再取得して更新反映
        } catch (err) {
            console.error(err);
            alert("更新失敗しました");
        }
    };

    const handleEditCancel = () => {
        setFormData(initialFormData);
        setShowEditPopup(null);
    };



    return (
        <div>
            <h1>ユーザー一覧</h1>

            { /*登録・削除ボタン*/}
            <div className="table-action-buttons">
                <button className="main-button" onClick={() => setFormData(initialFormData)  || setShowRegisterPopup(true)}>＋</button>
                <button className={`main-button ${deleteMode ? "delete-button" : ""}`}
                                  onClick={() => setDeleteMode(prev => !prev)}>ー</button>
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
                                    {/* 編集ボタン⇔削除実行ボタン */}
                                    <td>
                                        {deleteMode ? (
                                            <button className="main-button delete-button" onClick={() => setShowDeletePopup({ empNo: u.employeeNo, name: u.name })}>ー</button>
                                        ) : (
                                                <button className="main-button" onClick={() => {
                                                    setFormData({
                                                        employeeNo: u.employeeNo,
                                                        name: u.name,
                                                        nameKana: u.nameKana,
                                                        telNo: u.telNo,
                                                        mailAddress: u.mailAddress,
                                                        position: u.position,
                                                        accountLevel: u.accountLevel,
                                                        department: u.department,
                                                        age: u.age?.toString() || "",
                                                        gender: u.gender?.toString() ?? "0",
                                                    });
                                                    setShowEditPopup(true);
                                                }}>🖊</button>
                                        )}
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
                    {showDetails ? "↩" : "…"}
                </button>
            </div>

            { /*登録ポップアップ*/}
            {showRegisterPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>新規登録</h2>
                        <form className="form-grid">
                            <div>
                                <label>社員番号</label>
                                <input type="text" name="employeeNo"
                                    value={formData.employeeNo}
                                    onChange={(e) => setFormData({ ...formData, employeeNo: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>氏名</label>
                                <input type="text" name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>氏名カナ</label>
                                <input type="text" name="nameKana"
                                    value={formData.nameKana}
                                    onChange={(e) => setFormData({ ...formData, nameKana: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>電話番号</label>
                                <input type="text" name="telNo"
                                    value={formData.telNo}
                                    onChange={(e) => setFormData({ ...formData, telNo: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>メールアドレス</label>
                                <input type="email" name="mailAddress"
                                    value={formData.mailAddress}
                                    onChange={(e) => setFormData({ ...formData, mailAddress: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>役職</label>
                                <input type="text" name="position"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>アカウント権限</label>
                                <input type="text" name="accountLevel"
                                    value={formData.accountLevel}
                                    onChange={(e) => setFormData({ ...formData, accountLevel: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>部署</label>
                                <input type="text" name="department"
                                    value={formData.department || ""}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>年齢</label>
                                <input type="number" name="age"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>性別</label>
                                <div className="radio-group">
                                    <label>
                                        <input type="radio" name="gender" value="0"
                                            checked={formData.gender === "0"}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        /> 男性
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" value="1"
                                            checked={formData.gender === "1"}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        /> 女性
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" value="2"
                                            checked={formData.gender === "2"}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        /> その他
                                    </label>
                                </div>
                            </div>
                        </form>

                        {/* ボタン*/}
                        <div className="popup-buttons">
                            <button type="button" className="btn-yes" onClick={handleRegisterSubmit}>登録</button>
                            <button type="button" className="btn-no" onClick={handleRegisterCancel}>キャンセル</button>
                        </div>
                    </div>
                </div>
            )}



            { /*削除ポップアップ*/}
            {showDeletePopup && (
                <div className="popup-overlay">
                    <div className="popup popup-delete">
                        <h2>本当に削除しますか？</h2>
                        <h3>社員番号:{showDeletePopup.empNo} / 名前:{showDeletePopup.name}</h3>
                        <div className="popup-buttons">
                            <button className="btn-yes" onClick={() => handleDelete(showDeletePopup.empNo)}>はい</button>
                            <button className="btn-no" onClick={() => setShowDeletePopup(false)}>いいえ</button>
                        </div>
                    </div>
                </div>
            )}

            { /*編集ポップアップ*/}
            {showEditPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>ユーザー情報編集</h2>
                        <form className="form-grid">
                            <div>
                                <label>社員番号</label>
                                <input type="text" name="employeeNo"
                                    value={formData.employeeNo}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label>氏名</label>
                                <input type="text" name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>氏名カナ</label>
                                <input type="text" name="nameKana"
                                    value={formData.nameKana}
                                    onChange={(e) => setFormData({ ...formData, nameKana: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>電話番号</label>
                                <input type="text" name="telNo"
                                    value={formData.telNo}
                                    onChange={(e) => setFormData({ ...formData, telNo: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>メールアドレス</label>
                                <input type="email" name="mailAddress"
                                    value={formData.mailAddress}
                                    onChange={(e) => setFormData({ ...formData, mailAddress: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>役職</label>
                                <input type="text" name="position"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>アカウント権限</label>
                                <input type="text" name="accountLevel"
                                    value={formData.accountLevel}
                                    onChange={(e) => setFormData({ ...formData, accountLevel: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>部署</label>
                                <input type="text" name="department"
                                    value={formData.department || ""}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>年齢</label>
                                <input type="number" name="age"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>性別</label>
                                <div className="radio-group">
                                    <label>
                                        <input type="radio" name="gender" value="0"
                                            checked={formData.gender === "0"}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        /> 男性
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" value="1"
                                            checked={formData.gender === "1"}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        /> 女性
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" value="2"
                                            checked={formData.gender === "2"}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        /> その他
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label>退職日</label>
                                <input
                                    type="date" name="retire_date" value={formData.retireDate ? formData.retireDate.split("T")[0] : ""}
                                    onChange={(e) => setFormData({ ...formData, retireDate: e.target.value === "" ? null : e.target.value })}
                                />
                            </div>
                        </form>

                        {/*ボタン*/ }
                        <div className="popup-buttons">
                            <button className="btn-yes" onClick={handleEditSubmit}>変更</button>
                            <button className="btn-no" onClick={handleEditCancel}>キャンセル</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserList;
