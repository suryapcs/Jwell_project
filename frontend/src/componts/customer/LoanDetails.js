
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Divider,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  TablePagination,
} from "@mui/material";
import { ArrowBack, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import api from "../../utils/api";

const LoanDetails = () => {
  const { customerId, itemCode } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleBack = () => navigate(-1);
  const handleViewItem = () => navigate(`/addinterest/${customerId}/${itemCode}`);
  const handleCloseItem = () => navigate(`/closeloan/${customerId}/${itemCode}`);
  const handleToggleDropdown = (index) => setOpenDropdown(openDropdown === index ? null : index);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerRes = await api.get(
          `/api/customer/${customerId}/item/${itemCode}`
        );
        setCustomer({
          ...customerRes.data.personalInfo,
          item: customerRes.data.itemDetails,
        });

        const summaryRes = await api.get(
          `/api/interests/summary/${customerId}/${itemCode}`
        );
        setSummary(summaryRes.data);
      } catch (err) {
        console.error("Error fetching loan details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [customerId, itemCode]);

  if (loading) return <p>Loading loan details...</p>;
  if (!customer) return <p>Customer or Item not found!</p>;
  if (!summary) return <p>No interest summary available!</p>;

  // Totals
  const totalExpected = summary.months.reduce((a, b) => a + parseFloat(b.expected), 0);
  const totalPaid = summary.months.reduce((a, b) => a + parseFloat(b.totalPaid), 0);
  const totalPending = summary.months.reduce((a, b) => a + parseFloat(b.pending), 0);
  const totalExtra = summary.months.reduce((a, b) => a + parseFloat(b.extra), 0);

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

    const handleCreateInvoice = (id) => {
    // Use your API base URL + endpoint
    const url = `${api.defaults.baseURL}/api/customer/invoice/${customerId}/${itemCode}`;
    window.open(url, "_blank"); // Open in new tab
  };

  // Paginated months
  const paginatedMonths = summary.months.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 30, padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 1100 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBack}>
            Back
          </Button>

          {/* ✅ Create Invoice Button */}
          <Button variant="contained" color="success" onClick={handleCreateInvoice}>
            Create Invoice
          </Button>
        </Box>


        {/* Customer Card */}
        <Card sx={{ borderRadius: 3, p: 3, mb: 3, position: "relative", background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)" }}>
          <Typography sx={{ position: "absolute", top: 16, left: 16, fontSize: "0.8rem", color: "#555", fontWeight: 500 }}>
            Added on: {new Date(customer.item.createdAt).toLocaleDateString()}
          </Typography>
          <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 1 }}>
            <Chip label={`Code: ${customer.item.code}`} color="secondary" size="small" />
            <Button variant="contained" size="small" sx={{ minWidth: "auto", px: 1, fontSize: "0.7rem", backgroundColor: "#FF69B4", "&:hover": { backgroundColor: "#FF1493" } }} onClick={handleViewItem}>
              + Interest
            </Button>
            <Button variant="contained" size="small" sx={{ minWidth: "auto", px: 1, fontSize: "0.7rem", backgroundColor: "#1619d2ff", "&:hover": { backgroundColor: "#FF1493" } }} onClick={handleCloseItem}>
              Close Loan
            </Button>
          </Box>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar
  src={
    customer.customerImage
      ? `${api.defaults.baseURL}/uploads/${customer.customerImage}`
      : "/default-avatar.png"
  }
  alt={customer.name}
  sx={{ width: 120, height: 120, border: "3px solid #8500B5" }}
/>
                {/* <Avatar src={customer.customerImage ? `http://localhost:5000/uploads/${customer.customerImage}` : "/default-avatar.png"} alt={customer.name} sx={{ width: 120, height: 120, border: "3px solid #8500B5" }} /> */}
              </Grid>
              <Grid item>
                <Typography variant="h5" fontWeight="bold">{customer.name}</Typography>
                <Typography>📞 {customer.phone_number}</Typography>
                <Typography>🆔 Aadhar: {customer.aadhar_number}</Typography>
                <Typography>🏠 {customer.address}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ color: "#8500B5", mb: 1 }}>Item Details</Typography>
            <Typography>💎 Item: <b>{customer.item.item}</b></Typography>
            <Typography>⚖️ Weight: {customer.item.weight}g</Typography>
            <Typography>💰 Price per Weight: ₹{customer.item.pricePerWeight}</Typography>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ color: "#8500B5", mb: 1 }}>Loan Details</Typography>
            <Typography>🏦 Total Loan Amount: ₹{summary.totalLoanAmount}</Typography>
            <Typography sx={{ color: "blue" }}>📉 Current Loan Amount: ₹{summary.months.length ? summary.months[summary.months.length - 1].currentLoan : summary.totalLoanAmount}</Typography>
            <Typography>📈 Interest Rate: {summary.interestRate}%</Typography>
            <Typography sx={{ color: "green", fontWeight: "bold", mt: 1 }}>💵 Monthly Interest: ₹{(summary.totalLoanAmount * (summary.interestRate / 100)).toFixed(2)}</Typography>
          </CardContent>
        </Card>

        {/* Interest Details Table */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ color: "#8500B5", mb: 2 }}>Interest Details</Typography>
          <Card sx={{ mb: 2, p: 2 }}>
            <Typography>📊 <b>Total Expected Interest:</b> ₹{totalExpected.toFixed(2)}</Typography>
            <Typography>✅ <b>Total Paid Interest:</b> ₹{totalPaid.toFixed(2)}</Typography>
            <Typography color="error">⚠️ <b>Total Pending Interest:</b> ₹{totalPending.toFixed(2)}</Typography>
            <Typography color="primary">💎 <b>Total Extra Paid:</b> ₹{totalExtra.toFixed(2)}</Typography>
          </Card>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ background: "#8500B5" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>S.No</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Month/Year</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Expected</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Paid Amount</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Pending</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Extra</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Current Loan</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Paid Dates</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMonths.map((monthData, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{new Date(monthData.year, monthData.month - 1).toLocaleString('en-us', { month: 'long', year: 'numeric' })}</TableCell>
                      <TableCell>₹{monthData.expected}</TableCell>
                      <TableCell sx={{ color: monthData.totalPaid > 0 ? "green" : "inherit" }}>₹{monthData.totalPaid}</TableCell>
                      <TableCell sx={{ color: monthData.pending > 0 ? "red" : "inherit" }}>₹{monthData.pending}</TableCell>
                      <TableCell sx={{ color: monthData.extra > 0 ? "blue" : "inherit" }}>₹{monthData.extra}</TableCell>
                      <TableCell>₹{monthData.currentLoan}</TableCell>
                      <TableCell>
                        {monthData.payments.length === 0 ? "-" : monthData.payments.length === 1 ? new Date(monthData.payments[0].paidDate).toLocaleDateString() :
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {monthData.payments.map(p => new Date(p.paidDate).toLocaleDateString()).join(', ')}
                            <IconButton onClick={() => handleToggleDropdown(index)} size="small">
                              {openDropdown === index ? <ArrowDropUp /> : <ArrowDropDown />}
                            </IconButton>
                          </div>}
                      </TableCell>
                    </TableRow>
                    {monthData.payments.length > 1 && (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ py: 0, px: 0, border: 'none' }}>
                          <Collapse in={openDropdown === index} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, background: '#e0f7fa', border: '1px solid #00acc1', borderRadius: '8px', mt: 1 }}>
                              {monthData.payments.map((p, pIndex) => (
                                <Box key={pIndex} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: pIndex < monthData.payments.length - 1 ? '1px dashed #ccc' : 'none' }}>
                                  <Typography variant="body2" sx={{ color: '#555' }}>Payment {pIndex + 1}:</Typography>
                                  <Typography variant="body2" fontWeight="bold" sx={{ color: '#00695c' }}>₹{p.paidAmount.toFixed(2)}</Typography>
                                  <Typography variant="body2" sx={{ color: '#757575' }}>{new Date(p.paidDate).toLocaleDateString()}</Typography>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={summary.months.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10]}
          />
        </Box>
      </div>
    </div>
  );
};

export default LoanDetails;
