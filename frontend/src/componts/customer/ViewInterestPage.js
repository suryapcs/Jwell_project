
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../utils/api";

const ViewInterestPage = () => {
  const { id } = useParams(); // interest record id
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    paidAmount: "",
    // remarks: "",
    paidDate: dayjs().format("YYYY-MM-DD"),
  });
  const [customer, setCustomer] = useState(null);

  // fetch single interest record with customer details
  useEffect(() => {
    const fetchInterest = async () => {
      try {
        const res = await api.get(
          `/api/interests/single/${id}`
        );

        setFormData({
          paidAmount: res.data.paidAmount || "",
        //   remarks: res.data.remarks || "",
          paidDate: res.data.paidDate
            ? dayjs(res.data.paidDate).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD"),
        });

        if (res.data.customerId) {
          setCustomer(res.data.customerId);
        }
      } catch (err) {
        console.error("Error fetching interest record:", err);
      }
    };
    fetchInterest();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/interests/${id}`, formData);
      alert("Interest record updated successfully!");
      navigate(-1); // go back
    } catch (err) {
      console.error("Error updating interest:", err);
      alert("Failed to update interest.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Edit Interest Record
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Customer Name */}
            <Grid item xs={12}>
              <TextField
                label="Customer Name"
                value={customer ? customer.name : ""}
                fullWidth
                disabled
              />
            </Grid>

            {/* Item */}
            <Grid item xs={12}>
              <TextField
                label="Item"
                value={customer ? customer.item : ""}
                fullWidth
                disabled
              />
            </Grid>

            {/* Paid Date (optional edit) */}
            <Grid item xs={12}>
              <TextField
                label="Paid Date"
                type="date"
                name="paidDate"
                value={formData.paidDate}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Paid Amount */}
            <Grid item xs={12}>
              <TextField
                label="Paid Amount"
                name="paidAmount"
                type="number"
                fullWidth
                value={formData.paidAmount}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Remarks */}
            {/* <Grid item xs={12}>
              <TextField
                label="Remarks"
                name="remarks"
                fullWidth
                multiline
                rows={2}
                value={formData.remarks}
                onChange={handleChange}
              />
            </Grid> */}
          </Grid>

          {/* Buttons */}
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewInterestPage;
