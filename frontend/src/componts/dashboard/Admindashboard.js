
import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import "../../style/Admindashboard.css";

import MonthlyCustomerChart from "./WaveChart";
import ItemBarChart from "./CircleChart";
import api from "../../utils/api";


const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    existingCustomers: 0,
    currentCustomers: 0,
    totalLoanAmount: 0,
    totalItems: 0,
    totalWeight: 0,
    totalInterestPaid: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get("/api/customer/dashboard/stats", {
          withCredentials: true,
        });
        const stats = res.data;

        // Set the state with the data directly from the API
        setDashboardStats(stats);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchDashboardStats();
  }, []);

  const cards = [
    {
      title: "Total Customers",
      value: dashboardStats.totalCustomers,
      color: "card-blue",
    },
    {
      title: "Current Customers",
      value: dashboardStats.currentCustomers,
      color: "card-green",
    },
    {
      title: "Existing Customers",
      value: dashboardStats.existingCustomers,
      color: "card-purple",
    },
    {
      title: "Total Loan Amount",
      value: dashboardStats.totalLoanAmount,
      prefix: "₹",
      color: "card-orange",
    },
    {
        title: "Total Items",
        value: dashboardStats.totalItems,
        color: "card-cyan",
    },
    {
        title: "Total Gold Weight",
        value: dashboardStats.totalWeight,
        suffix: "g",
        color: "card-teal",
    },
    {
        title: "Total Interest Paid",
        value: dashboardStats.totalInterestPaid,
        prefix: "₹",
        color: "card-pink",
    },
  ];

  return (
    <div className="admin-dashboard-container">
      <h1 className="page-title">Jewelry Loan Dashboard</h1>

      <div className="cards-grid">
        {cards.map((card, i) => (
          <div key={i} className={`dashboard-card ${card.color}`}>
            <h2>{card.title}</h2>
            <p>
              <CountUp
                start={0}
                end={card.value}
                duration={2}
                separator=","
                prefix={card.prefix || ""}
                suffix={card.suffix || ""}
              />
            </p>
          </div>
        ))}
      </div>
      <div className="border">
        <ItemBarChart />
      </div>
      <div className="borderline">
        <MonthlyCustomerChart />
      </div>
    </div>
  );
};

export default AdminDashboard;