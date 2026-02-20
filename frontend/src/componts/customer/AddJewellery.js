

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { Grid, TextField, Button, MenuItem } from "@mui/material";
import "../../style/AddCustomer.css";
import { Toast } from "../../utils/Toast";
import api from "../../utils/api";

const validItems = [
  "Chain","Dollar Chain","Earring","Ring","Ear Matti","Dollar",
  "Necklace","Bracelet","Stone Earring","Titanic Earring",
  "Baby Ring","Mookuthi"
];

const AddJewellery = () => {
  const { customerId } = useParams(); 
  console.log(customerId);
  const location = useLocation();
  const customerInfo = location.state?.customer; // Get passed customer info
const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    item: "",
    weight: "",
    pricePerWeight: "",
    loanAmount: "",
    interest: "",
  });

  const [loading, setLoading] = useState(false);
  const [error] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(
        `/api/jewellery/${customerId}/add`,
        formData
      );
      setSuccess("Jewellery added successfully!");
      Toast.success("Jewellery added successfully!");
      navigate("/customer-list");
    } catch (err) {
      Toast.error(err.response?.data?.error || "Error adding jewellery"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchNextCode = async () => {
      try {
        const res = await api.get("/api/customer/next-item-code");
        setFormData(prev => ({ ...prev, code: res.data.nextCode }));
      } catch (err) {
        console.error("Error fetching next item code:", err);
      }
    };
  
    fetchNextCode();
  }, []);

  return (
    <div className="customer-page-container">
      <div className="main-content">
        <h1>Add Jewellery for {customerInfo?.personalInfo?.name}</h1>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                fullWidth
                required
                 InputProps={{
                  readOnly: true, // user cannot edit
                }}
              />
              
              
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Item"
                name="item"
                value={formData.item}
                onChange={handleChange}
                fullWidth
                required
              >
                {validItems.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Price per Weight"
                name="pricePerWeight"
                type="number"
                value={formData.pricePerWeight}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Loan Amount"
                name="loanAmount"
                type="number"
                value={formData.loanAmount}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Interest"
                name="interest"
                type="number"
                value={formData.interest}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default AddJewellery;
