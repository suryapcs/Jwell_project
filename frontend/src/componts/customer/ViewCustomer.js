import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Chip,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import api from "../../utils/api";

const ViewCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch customer details
 useEffect(() => {
  api.get(`/api/customer/${id}`)
    .then((res) => {
      console.log("Customer fetched:", res.data); // <-- add this
      setCustomer(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching customer:", err);
      setLoading(false);
    });
}, [id]);


  if (loading) return <p>Loading customer details...</p>;
  if (!customer) return <p>Customer not found!</p>;

  const handleAddJewellery = () => {
    navigate(`/add-jewellery/${customer.customerId}`, { state: { customer } });
  };

const handleViewItem = (itemCode) => {
  // navigate to LoanDetails page with customerId and itemCode in URL
  navigate(`/loandetails/${customer.customerId}/${itemCode}`);
};


  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 30, padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 1000 }}>
        
        {/* Back Button */}
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/customer-list")}
          sx={{ mb: 2 }}
        >
          Back to Customers
        </Button>

     


        {/* Personal Info Section */}
  <Card sx={{ borderRadius: 3, p: 3, mb: 3, position: "relative", background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)" }}>
  {/* Add More Jewellery Button at top-right */}
  <Button
    variant="contained"
    sx={{
      position: "absolute",
      top: 16,
      right: 16,
      backgroundColor: "#8500B5",
      "&:hover": { backgroundColor: "#6d0090" },
    }}
    onClick={handleAddJewellery}
  >
    ➕ Add More Jewellery
  </Button>

  <CardContent>
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Avatar
          src={customer.personalInfo.customerImage ? `${api.defaults.baseURL}/uploads/${customer.personalInfo.customerImage}` : "/default-avatar.png"}
          alt={customer.personalInfo.name}
          sx={{ width: 120, height: 120, border: "3px solid #8500B5" }}
        />
      </Grid>
      <Grid item>
        <Typography variant="h5" fontWeight="bold">{customer.personalInfo.name}</Typography>
        <Typography>📞 {customer.personalInfo.phone_number}</Typography>
        <Typography>🆔 Aadhar: {customer.personalInfo.aadhar_number}</Typography>
        <Typography>🏠 {customer.personalInfo.address}</Typography>
      </Grid>
    </Grid>
  </CardContent>
</Card>



        {/* Items Section */}
        <Typography variant="h6" sx={{ color: "#8500B5", mb: 2 }}>Gold Loans</Typography>
        <Grid container spacing={2}>
         {customer.items.length === 0 && <Typography>No items found</Typography>}
{customer.items.map((item) => (
  <Grid item xs={12} sm={6} md={4} key={item.code}>
    <Card
      sx={{ cursor: "pointer", borderRadius: 2, p: 2, "&:hover": { boxShadow: 6 } }}
      onClick={() => handleViewItem(item.code)}
    >
      <CardContent>
        <Chip label={`Code: ${item.code}`} size="small" color="secondary" sx={{ mb: 1 }} />
        <Typography fontWeight="bold">{item.item}</Typography>
        <Typography>Loan Amount: ₹{item.loanAmount}</Typography>
      </CardContent>
    </Card>
  </Grid>
))}

        </Grid>
      </div>
    </div>
  );
};

export default ViewCustomer;
