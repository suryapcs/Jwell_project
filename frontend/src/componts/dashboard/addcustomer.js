
import React, { useEffect, useState } from "react";
import { Grid, TextField, Button, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../style/AddCustomer.css";
import CameraCapture from "./CameraCapture";
import { Toast } from "../../utils/Toast";
import api from "../../utils/api";


const validItems = [
  "Chain","Dollar Chain","Earring","Ring","Ear Matti","Dollar",
  "Necklace","Bracelet","Stone Earring","Titanic Earring",
  "Baby Ring","Mookuthi"
];

const AddCustomerForm = () => {
  const [step, setStep] = useState(1);
  const [customerId, setCustomerId] = useState(null);

  const [formData, setFormData] = useState({
  name: "",
  phone_number: "",
  aadhar_number: "",
  address: "",
  code: "",
  item: "",
  weight: 0,
  pricePerWeight: 0,
  loanAmount: 0,
  interest: 0,
});


  const [images, setImages] = useState({
    itemImage: null,
    customerImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: ["weight","pricePerWeight","loanAmount","interest"].includes(name)
      ? Number(value)
      : value,
  }));
};

  const navigate = useNavigate();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleNext = async () => {
    const requiredFields = [
      "name",
      "phone_number",
      "aadhar_number",
      "address",
      "code",
      "item",
      "weight",
      "pricePerWeight",
      "loanAmount",
      "interest",
    ];
    const emptyField = requiredFields.find((f) => !formData[f]);
    if (emptyField) {
      setError(`Please fill ${emptyField}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ Step 1: Save details only
      const response = await api.post(
        "/api/customer",
        formData
      );
      setCustomerId(response.data.customer._id);
      Toast.success("Step 1 complete: Customer details saved");
      setStep(2);
    } catch (err) {
      Toast.error(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      setError("Customer ID not found. Complete Step 1 first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      if (images.itemImage) {
        data.append(
          "itemImage",
          new File([images.itemImage], "itemImage.jpg", { type: "image/jpeg" })
        );
      }
      if (images.customerImage) {
        data.append(
          "customerImage",
          new File([images.customerImage], "customerImage.jpg", {
            type: "image/jpeg",
          })
        );
      }

      // ✅ Step 2: Upload images if provided
      const response = await api.post(
        `/api/customer/upload/${customerId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess(response.data.message);

      // reset after submission
      setFormData((prev) => ({
  ...prev,
  code: "",
  item: "",
  weight: 0,
  pricePerWeight: 0,
  loanAmount: 0,
  interest: 0,
}));
setImages({ itemImage: null, customerImage: null });
setStep(1); // or keep step 2 if adding multiple items

      // setFormData({
      //   name: "",
      //   phone_number: "",
      //   aadhar_number: "",
      //   address: "",
      //   code: "",
      //   item: "",
      //   weight: "",
      //   pricePerWeight: "",
      //   loanAmount: "",
      //   interest: "",
      // });
      // setImages({ itemImage: null, customerImage: null });
      // setStep(1);
      setCustomerId(null);

      navigate("/customer-list");
    } catch (err) {
      setError(err.response?.data?.error || "Server error, please try again");
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
        <h1>Add Customer</h1>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Aadhar Number"
                  name="aadhar_number"
                  value={formData.aadhar_number}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 12 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

             <Grid item xs={12} sm={6}>
<TextField
  label="Item Code"
  name="code"
  value={formData.code || ""}
  fullWidth
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
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Next"}
                </Button>
              </Grid>
            </Grid>
          )}

          {step === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <CameraCapture
                  label="Item Photo (Optional)"
                  onCapture={(blob) =>
                    setImages((prev) => ({ ...prev, itemImage: blob }))
                  }
                />
                {images.itemImage && <p>Item photo captured!</p>}
              </Grid>

              <Grid item xs={12} sm={6}>
                <CameraCapture
                  label="Customer Photo (Optional)"
                  onCapture={(blob) =>
                    setImages((prev) => ({ ...prev, customerImage: blob }))
                  }
                />
                {images.customerImage && <p>Customer photo captured!</p>}
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Grid>
            </Grid>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddCustomerForm;
