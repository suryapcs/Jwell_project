
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Toast } from "../../utils/Toast";
import api from "../../utils/api";

const AddInterestForm = () => {
  const { customerId, itemCode } = useParams();
  const [customerName, setCustomerName] = useState("");
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({
    customerId: customerId || "",
    itemCode: itemCode || "",
    date: dayjs().format("YYYY-MM-DD"),
    interestRate: 0,
    monthlyInterest: 0,
    paidAmount: "",
  });
  const navigate = useNavigate();

  // Fetch from /:customerId/item/:itemCode
useEffect(() => {
  if (!customerId || !itemCode) return;

  const fetchItemDetails = async () => {
    try {
      const res = await api.get(`/api/customer/${customerId}/item/${itemCode}`);
      const { personalInfo, itemDetails } = res.data;

      // Set customer and item details
      setCustomerName(personalInfo?.name || "");
      setItem(itemDetails);

      const interestRate = itemDetails.interest || 0;
      const monthlyInterest = (itemDetails.loanAmount * interestRate) / 100;

      setFormData((prev) => ({
        ...prev,
        interestRate,
        monthlyInterest,
      }));
    } catch (err) {
      console.error("Error fetching item details:", err);
    }
  };

  fetchItemDetails();
}, [customerId, itemCode]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date(formData.date);
    const payload = {
      customerId,
      itemCode,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      paidDate: date,
      // interestRate: formData.interestRate,
      // monthlyInterest: formData.monthlyInterest,
  paidAmount: Number(formData.paidAmount), // ✅ ensure it's numeric
    };

    try {
      await api.post("/api/interests", payload);
      Toast.success("Interest added successfully!");
      navigate(`/loandetails/${customerId}/${itemCode}`)
      
    } catch (error) {
      console.error("Error saving interest:", error);
      Toast.error("Failed to save interest.");
    }
  };

  if (!item) return <Typography sx={{ mt: 5 }}>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Add Interest Record
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Customer Name" value={customerName} disabled />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Item Code" value={item.code} disabled />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Item Name" value={item.item} disabled />
          </Grid>

          <Grid item xs={12}>
            <TextField type="date" fullWidth name="date" value={formData.date} onChange={handleChange} required />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Interest %" value={formData.interestRate} disabled />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Interest Amount" value={formData.monthlyInterest} disabled />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Paid Amount"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Interest
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddInterestForm;
