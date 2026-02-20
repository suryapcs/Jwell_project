
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TablePagination } from '@mui/material';
import '../../style/Deleteduser.css';
import api from '../../utils/api';

const DeletedCustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch customers with available items
  const fetchDeletedCustomers = async () => {
    try {
      const response = await api.get('/api/customer/existing');
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching customers');
    }
  };

  useEffect(() => {
    fetchDeletedCustomers();
  }, []);

  // Restore single item
  const restoreItem = async (customerId, itemCode) => {
    try {
      const response = await api.put(
        `/api/customer/restore-item/${customerId}/${itemCode}`
      );
      alert(response.data.message);
      fetchDeletedCustomers(); 
      navigate("/customer-list");
    } catch (err) {
      alert(err.response?.data?.error || 'Error restoring item');
    }
  };

  // Flattened & filtered items
  const flattenedItems = customers.flatMap(customer =>
    customer.items
      ?.filter(item => item.currentAvailableValue === 1)
      .map(item => ({
        customerId: customer._id,
        name: customer.personalInfo?.name || '-',
        phone: customer.personalInfo?.phone_number || '-',
        address: customer.personalInfo?.address || '-',
        aadhar: customer.personalInfo?.aadhar_number || '-',
        itemName: item.item || '-',
        itemCode: item.code || '-',
        loanAmount: item.loanAmount || 0,
      })) || []
  ).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated data
  const paginatedItems = flattenedItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-content">
        <h1 className="page-title">Deleted Customers</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, ID, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error">{error}</div>}

        {flattenedItems.length === 0 ? (
          <p>No deleted customers found</p>
        ) : (
          <div className="table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Item Name</th>
                  <th>Item Code</th>
                  <th>Loan Amount</th>
                  <th>Address</th>
                  <th>Aadhar Number</th>
                  <th>Restore</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item, index) => (
                  <tr key={`${item.customerId}-${item.itemCode}`}>
                    <td>{page * rowsPerPage + index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.itemName}</td>
                    <td>{item.itemCode}</td>
                    <td>₹{item.loanAmount}</td>
                    <td>{item.address}</td>
                    <td>{item.aadhar}</td>
                    <td>
                      <button
                        onClick={() => restoreItem(item.customerId, item.itemCode)}
                        className="restore-btn"
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={flattenedItems.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletedCustomersList;
