
import React, { useState, useEffect } from "react";
import "../../style/navbar.css";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    setCurrentDate(today.toLocaleDateString("en-US", options));
  }, []);

  return (
    <nav className="navbar-head">
      <div className="navbar-left">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="navbarsearch"
          />
        </div>
      </div>

      <div className="navbar-right">
        <FaCalendarAlt className="date-icon" />
        <span className="current-date">{currentDate}</span>
      </div>
    </nav>
  );
};

export default Navbar;
