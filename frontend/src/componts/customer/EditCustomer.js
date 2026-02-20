
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, MenuItem } from "@mui/material";
import "../../style/EditCustomer.css";
import { Toast } from "../../utils/Toast";
import api from "../../utils/api";

const validItems = [
  "Chain","Dollar Chain","Earring","Ring","Ear Matti","Dollar",
  "Necklace","Bracelet","Stone Earring","Titanic Earring",
  "Baby Ring","Mookuthi"
];

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState(null); // store full customer
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    aadhar_number: "",
    address: "",
    code: "",
    item: "",
    weight: "",
    pricePerWeight: "",
    loanAmount: "",
    interest: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load customer details
  useEffect(() => {
    api.get(`/api/customer/${id}`)
      .then(res => {
        setCustomerData(res.data);

        // populate personal info
        setFormData(prev => ({
          ...prev,
          name: res.data.personalInfo.name || "",
          phone_number: res.data.personalInfo.phone_number || "",
          aadhar_number: res.data.personalInfo.aadhar_number || "",
          address: res.data.personalInfo.address || "",
        }));

        // select first item by default
        if (res.data.items.length > 0) {
          setSelectedItemCode(res.data.items[0].code);
          populateItemData(res.data.items[0]);
        }
      })
      .catch(err => {
        console.error("Error fetching customer:", err);
        setMessage({ type: "error", text: "Failed to load customer data" });
      });
  }, [id]);

  // Populate form fields with selected item
  const populateItemData = (item) => {
    setFormData(prev => ({
      ...prev,
      code: item.code,
      item: item.item,
      weight: item.weight,
      pricePerWeight: item.pricePerWeight,
      loanAmount: item.loanAmount,
      interest: item.interest,
    }));
  };

  // Handle item selection change
  const handleItemChange = (e) => {
    const selectedCode = e.target.value;
    setSelectedItemCode(selectedCode);
    const selectedItem = customerData.items.find(it => it.code === selectedCode);
    if (selectedItem) populateItemData(selectedItem);
  };

  // Handle update
  const handleSubmit = (e) => {
    e.preventDefault();

    // Format payload for backend
  const payload = {
  selectedItemCode, // <-- send selected item code here
  personalInfo: {
    name: formData.name,
    phone_number: formData.phone_number,
    aadhar_number: formData.aadhar_number,
    address: formData.address,
  },
  itemData: {
    code: formData.code,
    item: formData.item,
    weight: formData.weight,
    pricePerWeight: formData.pricePerWeight,
    loanAmount: formData.loanAmount,
    interest: formData.interest,
  }
};


api.put(`/api/customer/${id}`, payload)
      .then(res => {
        // setMessage({ type: "success", text: "Customer & item updated successfully!" });
Toast.success("Customer & item updated successfully!");
        // Update local state
        const updatedItems = customerData.items.map(item =>
          item.code === selectedItemCode ? { ...item, ...payload.itemData } : item
        );
        setCustomerData(prev => ({ ...prev, items: updatedItems }));
        setTimeout(() => {
        navigate("/customer-list");
      }, 2000);
      })

      .catch(err => {
        console.error(err);
        Toast.error("Failed to update customer & item");
        // Toast.error({ type: "error", text: "Failed to update customer & item" });
      });
  };

  return (
    <div className="main-content">
      <h1>Edit Customer</h1>

      {message.text && (
        <div className={message.type === "success" ? "success-message" : "error-message"}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Info */}
        <TextField
          label="Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          label="Phone Number"
          value={formData.phone_number}
          onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
        />
        <TextField
          label="Aadhar Number"
          value={formData.aadhar_number}
          onChange={e => setFormData({ ...formData, aadhar_number: e.target.value })}
        />
        <TextField
          label="Address"
          value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
        />

        {/* Item Selection */}
        <TextField
          select
          label="Select Item"
          value={selectedItemCode}
          onChange={handleItemChange}
          fullWidth
          required
        >
          {customerData?.items.map(item => (
            <MenuItem key={item.code} value={item.code}>
              {item.code} - {item.item}
            </MenuItem>
          ))}
        </TextField>

        {/* Item Details */}
        <TextField
          label="Code"
          value={formData.code}
          onChange={e => setFormData({ ...formData, code: e.target.value })}
        />
        <TextField
          select
          label="Item"
          value={formData.item}
          onChange={e => setFormData({ ...formData, item: e.target.value })}
        >
          {validItems.map(it => (
            <MenuItem key={it} value={it}>{it}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Weight"
          type="number"
          value={formData.weight}
          onChange={e => setFormData({ ...formData, weight: e.target.value })}
        />
        <TextField
          label="Price Per Weight"
          type="number"
          value={formData.pricePerWeight}
          onChange={e => setFormData({ ...formData, pricePerWeight: e.target.value })}
        />
        <TextField
          label="Loan Amount"
          type="number"
          value={formData.loanAmount}
          onChange={e => setFormData({ ...formData, loanAmount: e.target.value })}
        />
        <TextField
          label="Interest %"
          type="number"
          value={formData.interest}
          onChange={e => setFormData({ ...formData, interest: e.target.value })}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Update Customer
        </Button>
      </form>
    </div>
  );
};

export default EditCustomer;
