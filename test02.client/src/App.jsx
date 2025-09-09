import React, { useState } from 'react';
import Login from './login/Login.jsx';
import TopPage from './TopPage.jsx';
import './App.css';

const App = () => {
    const [currentPage, setCurrentPage] = useState('login');

    const handleLoginSuccess = (employeeNo) => {
        localStorage.setItem('auth', JSON.stringify({ employeeNo, loginAt: Date.now() }));
        setCurrentPage('topPage');
    };

    const handleLogout = () => {
        localStorage.removeItem('auth');
        setCurrentPage('login');
    };

    return (
        <div className={`app ${currentPage === 'login' ? 'center' : ''}`}>
            {currentPage === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
            {currentPage === 'topPage' && <TopPage onLoginSuccess={handleLoginSuccess} />}
        </div>
    );
};

export default App;