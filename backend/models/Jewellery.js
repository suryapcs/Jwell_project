const mongoose = require('mongoose');

const validItemTypes = [
  "Chain","Dollar Chain","Earring","Ring","Ear Matti","Dollar",
  "Necklace","Bracelet","Stone Earring","Titanic Earring",
  "Baby Ring","Mookuthi"
];

const jewelleryItemSchema = new mongoose.Schema({
  code: { type: String, required: true },
  item: { type: String, required: true, enum: validItemTypes },
  weight: { type: Number, required: true },
  pricePerWeight: { type: Number, required: true },
  loanAmount: { type: Number, required: true },
  interest: { type: Number, required: true },
  loanHistory: [{ 
    loanAmount: Number,
    interestRate: Number,
    durationMonths: Number,
    totalRepayment: Number,
  }],
  transactionHistory: [{
    amountReturned: Number,
    amountGrant: Number,
    date: Date
  }],
  currentAvailableValue: { type: Number, default: 0 }
}, { timestamps: true });

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  personalInfo: {
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    aadhar_number: { type: String, required: true },
    address: { type: String, required: true },
    customerImage: { type: String, default: null }
  },
  items: [jewelleryItemSchema]
}, { timestamps: true });

// ✅ Check if model already exists to prevent overwrite error
const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

module.exports = { Customer, validItemTypes };
