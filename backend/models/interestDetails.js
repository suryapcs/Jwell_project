// const mongoose = require("mongoose");

// const interestDetailsSchema = new mongoose.Schema({
//   customerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Customer",
//     required: true,
//   },
//   month: { type: Number, required: true },  // 1 - 12
//   year: { type: Number, required: true },   // ex: 2025
//   paidDate: { type: Date, default: Date.now },

//   // monthly calculated interest
//   monthlyInterest: { type: Number, required: true },

//   // how much customer paid for this month
//   paidAmount: { type: Number, required: true },

// //   remarks: { type: String, default: "" },
// }, { timestamps: true });

// const InterestDetails = mongoose.model("InterestDetails", interestDetailsSchema);
// module.exports = InterestDetails;

const mongoose = require("mongoose");

const interestDetailsSchema = new mongoose.Schema({
  customerId: {           // ✅ store your custom ID as a string
    type: String,
    required: true,
  },
  itemCode: {        // <-- Add this field
    type: String,
    required: true,
  },
  month: { type: Number, required: true },  // 1 - 12
  year: { type: Number, required: true },   // ex: 2025
  paidDate: { type: Date, default: Date.now },

  // monthly calculated interest
  monthlyInterest: { type: Number, required: true },

  // how much customer paid for this month
  paidAmount: { type: Number, required: true },

  // remarks: optional
  // remarks: { type: String, default: "" },
}, { timestamps: true });

const InterestDetails = mongoose.model("InterestDetails", interestDetailsSchema);
module.exports = InterestDetails;
