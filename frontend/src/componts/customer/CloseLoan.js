import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import dayjs from "dayjs";
import { Toast } from "../../utils/Toast";
import api from "../../utils/api";


const CloseLoan = () => {
  const { customerId, itemCode } = useParams();
  const [item, setItem] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
const navigate = useNavigate();
  // Fetch customer & item details
  useEffect(() => {
    if (!customerId || !itemCode) return;
    
      api.get(`/api/customer/${customerId}/item/${itemCode}`)
      .then((res) => {
        const { personalInfo, itemDetails } = res.data;
        setCustomerName(personalInfo?.name || "");
        setItem(itemDetails);
        setPaidAmount(itemDetails.currentLoanAmount); 
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [customerId, itemCode]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post(
      `/api/customer/customer/${customerId}/item/${itemCode}/close-loan`
    );
    Toast.success(
      `Loan closed Successfully!`
    );
    navigate("/customer-list");
  } catch (err) {
    console.error("Close loan error:", err);
   Toast.error("Failed to close loan. Please try again.");
  }
};


  if (!item) return <Typography sx={{ mt: 4 }}>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Close Loan
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Customer Details */}
            <Grid item xs={12}>
              <TextField fullWidth label="Customer Name" value={customerName} disabled />
            </Grid>

            {/* Item Info */}
            <Grid item xs={6}>
              <TextField fullWidth label="Item Code" value={item.code} disabled />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Item Name" value={item.item} disabled />
            </Grid>

            {/* Loan Info */}
            <Grid item xs={6}>
              <TextField fullWidth label="Loan Amount" value={item.loanAmount} disabled />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Current Loan Amount" value={item.currentLoanAmount} disabled />
            </Grid>

            {/* Loan Added Date */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Loan Added Date"
                value={dayjs(item.createdAt).format("YYYY-MM-DD")}
                disabled
              />
            </Grid>

            {/* Closing Date */}
            <Grid item xs={12}>
              <TextField
                type="date"
                fullWidth
                label="Closing Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Grid>

            {/* Paid Amount */}
            <Grid item xs={12}>
           <TextField
  fullWidth
  label="Paid Amount"
  type="number"
  value={paidAmount}
  onChange={(e) => setPaidAmount(e.target.value)}
  required
  InputProps={{
    readOnly: true, // ✅ Makes the field read-only
  }}
/>

            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Close Loan
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CloseLoan;
