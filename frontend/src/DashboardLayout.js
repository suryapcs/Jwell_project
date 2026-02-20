import React, { useState } from "react";
import Sidebar from "../src/componts/sidebar/Sidebar";
import Navbar from "../src/componts/navbar/Navbar"; // the Navbar we created
import './style/DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
