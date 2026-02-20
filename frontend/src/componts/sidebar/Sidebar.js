
// Sidebar.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaDesktop, FaUsers, FaUserPlus, FaTrash, FaDollarSign, FaSignOutAlt, FaBars 
} from 'react-icons/fa';
import '../../style/Sidebar.css';
import logo from '../../asset/images/vetrilogo.png'; 
import api from '../../utils/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { label: 'Customer Summary', icon: <FaDesktop />, path: '/AdminDashboard' },
    { label: 'All Customers', icon: <FaUsers />, path: '/customer-list' },
    { label: 'Add Customer', icon: <FaUserPlus />, path: '/add-customer' },
    { label: 'Interest Details', icon: <FaDollarSign />, path: '/interestdetails' },
    { label: 'Existing Customer', icon: <FaTrash />, path: '/deleted-user' },
    { label: 'Jewel Details', icon: <FaDollarSign />, path: '/repay-loan' },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/api/customer/logout');
      localStorage.removeItem("isLoggedIn");
      // localStorage.removeItem("adminData");
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <>
      {/* Hamburger toggle for mobile */}
      <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>

      <div className={`side-menu ${isOpen ? 'open' : 'closed'}`}>
        {/* Vetri Finance Header */}
     <div className="sidebar-header">
  <h2 className="sidebar-title">
    <span className="c1">V</span>
    <span className="c2">e</span>
    <span className="c3">t</span>
    <span className="c4">r</span>
    <span className="c5">i</span>

    {/* Centered logo */}
    <span className="logo-span">
      <img src={logo} alt="Vetri Finance Logo" className="sidebar-logo" />
    </span>

    <span className="c7">F</span>
    <span className="c8">i</span>
    <span className="c9">n</span>
    <span className="c10">a</span>
    <span className="c11">n</span>
    <span className="c12">c</span>
    <span className="c13">e</span>
  </h2>
</div>


        <div className="menu-buttons">
          {menuItems.map((item, index) => (
            <button 
              key={index} 
              className={`menu-btn ${location.pathname === item.path ? 'active-menu-btn' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          ))}

          {/* Logout Button */}
          <button className="menu-btn logout-btn" onClick={handleLogout}>
            <span className="icon"><FaSignOutAlt /></span>
            <span className="label">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;