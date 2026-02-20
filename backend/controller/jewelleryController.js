const { Customer, validItemTypes } = require("../models/Jewellery");
const InterestDetails = require('../models/interestDetails'); // 🔹 add this

exports.addJewellery = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { code, item, weight, pricePerWeight, loanAmount, interest } = req.body;

    if (!validItemTypes.includes(item)) {
      return res.status(400).json({ error: "Invalid item type" });
    }

    // Find customer by customerId
    const customer = await Customer.findOne({ customerId: { $regex: `^${customerId}$`, $options: "i" } });

    // const customer = await Customer.findOne({ customerId });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Add new jewellery item
    const newItem = {
      code,
      item,
      weight,
      pricePerWeight,
      loanAmount,
      interest,
      loanHistory: [],
      transactionHistory: [],
      // currentAvailableValue: loanAmount
    };

    customer.items.push(newItem);
    await customer.save();

    res.status(201).json({ message: "Jewellery added successfully", customer });
  } catch (error) {
    console.error("Add jewellery error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getJewellerySummary = async (req, res) => {
  try {
    const result = [];

    for (const itemType of validItemTypes) {
      const customers = await Customer.find({ "items.item": itemType });

      let totalCount = 0;
      let totalWeight = 0;
      let totalGoldValue = 0;
      let totalLoanAmount = 0;
      let totalInterestPaid = 0;
      const jewelleryNames = new Set();

      for (const customer of customers) {
        // ✅ Only include items with currentAvailableValue === 0
        const items = customer.items.filter(
          (i) => i.item === itemType && i.currentAvailableValue === 0
        );

        for (const item of items) {
          totalCount += 1;
          totalWeight += item.weight;
          totalGoldValue += item.weight * item.pricePerWeight;
          totalLoanAmount += item.loanAmount;
          jewelleryNames.add(item.item);

          // Sum of interest paid for this item
          const interests = await InterestDetails.find({
            customerId: customer.customerId,
            itemCode: item.code
          });
          const paidSum = interests.reduce((sum, i) => sum + i.paidAmount, 0);
          totalInterestPaid += paidSum;
        }
      }

      // ✅ Only push if there are items with currentAvailableValue === 0
      if (totalCount > 0) {
        result.push({
          itemType,
          jewelleryNames: Array.from(jewelleryNames),
          totalCount,
          totalWeight,
          totalGoldValue,
          totalLoanAmount,
          totalInterestPaid
        });
      }
    }

    res.json({ data: result });
  } catch (err) {
    console.error("Error fetching jewellery summary:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// exports.getJewellerySummary = async (req, res) => {
//   try {
//     const result = [];

//     for (const itemType of validItemTypes) {
//       const customers = await Customer.find({ "items.item": itemType });

//       let totalCount = 0;
//       let totalWeight = 0;
//       let totalGoldValue = 0;
//       let totalLoanAmount = 0;
//       let totalInterestPaid = 0;
//       const jewelleryNames = new Set(); // Collect all item codes/names

//       for (const customer of customers) {
//         const items = customer.items.filter(i => i.item === itemType);

//         for (const item of items) {
//           totalCount += 1;
//           totalWeight += item.weight;
//           totalGoldValue += item.weight * item.pricePerWeight;
//           totalLoanAmount += item.loanAmount;

//           jewelleryNames.add(item.item); // ✅ Collect jewellery names

//           // Sum of interest paid for this item
//           const interests = await InterestDetails.find({
//             customerId: customer.customerId,
//             itemCode: item.code
//           });
//           const paidSum = interests.reduce((sum, i) => sum + i.paidAmount, 0);
//           totalInterestPaid += paidSum;
//         }
//       }

//       result.push({
//         itemType,
//         jewelleryNames: Array.from(jewelleryNames), // include names
//         totalCount,
//         totalWeight,
//         totalGoldValue,
//         totalLoanAmount,
//         totalInterestPaid
//       });
//     }

//     res.json({ data: result });
//   } catch (err) {
//     console.error("Error fetching jewellery summary:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

