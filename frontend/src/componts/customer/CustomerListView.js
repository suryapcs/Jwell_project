
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FaEdit, FaEye,  } from "react-icons/fa";
import {
  TablePagination
} from "@mui/material";
import "../../style/Custsummarydashboard.css";
import api from "../../utils/api";

const CustomerListView = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // rows per page

  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/customer");
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.personalInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.personalInfo?.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.personalInfo?.aadhar_number && c.personalInfo.aadhar_number.includes(searchQuery))
  );

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated data
  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Action handlers
  const handleEdit = (id) => navigate(`/customers/edit/${id}`);
  const handleView = (id) => navigate(`/customers/view/${id}`);
  // const handleInvoice = (id) => window.open.api(`/customer/invoice/${id}`, "_blank");


  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-content">
        <h1>All Customers</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, phone, or aadhar..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading && <p>Loading customers...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Loan Amount</th>
                <th>Items</th>
                <th>Aadhar Number</th>
                {/* <th>Invoice</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer, index) => (
                  <tr key={customer._id || index}>
                    <td>{page * rowsPerPage + index + 1}</td>
                    <td>{customer.personalInfo?.name}</td>
                    <td>{customer.personalInfo?.phone_number}</td>
                    <td>{customer.items?.reduce((sum, itm) => sum + (itm.loanAmount || 0), 0)}</td>
                    <td>{customer.items?.map((itm) => itm.item).join(", ")}</td>
                    <td>{customer.personalInfo?.aadhar_number}</td>
                    {/* <td>
                      <button className="action-btn invoice-btn" onClick={() => handleInvoice(customer._id)}>
                        <FaFileInvoice /> Get Invoice
                      </button>
                    </td> */}
                    <td className="actions-cell">
                      <FaEdit className="customerlist-icons" onClick={() => handleEdit(customer._id)} />
                      <FaEye className="customerlist-icons" onClick={() => handleView(customer._id)} />
                    </td>
                  </tr>
                ))
              ) : !loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    <button className="action-btn add-btn" onClick={() => navigate("/add-customer")}>
                      ➕ Add Customer
                    </button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredCustomers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10]}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerListView;
