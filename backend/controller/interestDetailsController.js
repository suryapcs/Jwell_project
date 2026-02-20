const InterestDetails = require("../models/interestDetails");
const { Customer } = require("../models/Customer");

// // ➕ Add interest record
// exports.addInterest = async (req, res) => {
//   try {
//     const { customerId, itemCode, month, year, paidAmount } = req.body;

//     // find customer
//     const customer = await Customer.findById(customerId);
//     if (!customer) return res.status(404).json({ message: "Customer not found" });

//     // Check if itemCode exists in customer's items
//     const itemExists = customer.items.find(item => item.code === itemCode);
//     if (!itemExists) return res.status(404).json({ message: "Item not found for this customer" });

//     // monthly interest calculation
//     const monthlyInterest = (itemExists.loanAmount * customer.interest) / 100;

//     const interestRecord = new InterestDetails({
//       customerId,
//       itemCode,
//       month,
//       year,
//       paidAmount,
//       monthlyInterest,
//     });

//     await interestRecord.save();
//     res.status(201).json(interestRecord);
//   } catch (error) {
//     console.error("Error adding interest:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// ➕ Add interest record
exports.addInterest = async (req, res) => {
  try {
    const { customerId, itemCode, month, year, paidAmount } = req.body;

    // Find customer by custom ID
    const customer = await Customer.findOne({ customerId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Find the specific item
    const itemExists = customer.items?.find((item) => item.code === itemCode);
    if (!itemExists) return res.status(404).json({ message: "Item not found for this customer" });

    // ✅ Use loanAmount and interest from the item itself
    const loanAmount = Number(itemExists.loanAmount);
    const interestRate = Number(itemExists.interest);

    if (isNaN(loanAmount) || isNaN(interestRate)) {
      return res.status(400).json({
        message: "Invalid loanAmount or interest value on the item",
        loanAmount,
        interestRate,
      });
    }

    const monthlyInterest = (loanAmount * interestRate) / 100;

    const interestRecord = new InterestDetails({
      customerId,
      itemCode,
      month,
      year,
      paidDate: new Date(),
      monthlyInterest,
      paidAmount: Number(paidAmount),
    });

    await interestRecord.save();
    res.status(201).json(interestRecord);
  } catch (error) {
    console.error("Error adding interest:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// 📌 Get interest by ID
// 📌 Get interest by ID with customer details
exports.getInterestById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await InterestDetails.findById(id).populate("customerId");
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllInterests = async (req, res) => {
  try {
    const interests = await InterestDetails.find().lean();

    // For each interest record, fetch customer + item info
    const enriched = await Promise.all(
      interests.map(async (i) => {
        const customer = await Customer.findOne({ customerId: i.customerId }).lean();
        if (!customer) {
          return { ...i, customerName: "Unknown", totalLoanAmount: 0 };
        }

        // Get the specific item details for the given itemCode
        const item = customer.items?.find((it) => it.code === i.itemCode);

        // Get the loan amount for the specific item
        const itemLoanAmount = item?.loanAmount || 0;

        return {
          _id: i._id,
          customerId: i.customerId,
          customerName: customer.personalInfo.name,
          itemCode: i.itemCode,
          itemName: item?.item || "",
          paidAmount: i.paidAmount,
          paidDate: i.paidDate,
          monthlyInterest: i.monthlyInterest,
          totalLoanAmount: itemLoanAmount, // This is the fixed line
          createdAt: i.createdAt,
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error("Error fetching interest details:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// exports.getAllInterests = async (req, res) => {
//   try {
//     const interests = await InterestDetails.find().lean();

//     // For each interest record, fetch customer + item info
//     const enriched = await Promise.all(
//       interests.map(async (i) => {
//         const customer = await Customer.findOne({ customerId: i.customerId }).lean();
//         if (!customer) {
//           return { ...i, customerName: "Unknown", totalLoanAmount: 0 };
//         }

//         // Get the item details for the given itemCode
//         const item = customer.items?.find((it) => it.code === i.itemCode);

//         // Calculate total loan amount for this customer
//         const totalLoanAmount = customer.items?.reduce(
//           (sum, it) => sum + (it.loanAmount || 0),
//           0
//         ) || 0;

//         return {
//           _id: i._id,
//           customerId: i.customerId,
//           customerName: customer.personalInfo.name,
//           itemCode: i.itemCode,
//           itemName: item?.item || "",
//           paidAmount: i.paidAmount,
//           paidDate: i.paidDate,
//           monthlyInterest: i.monthlyInterest,
//           totalLoanAmount,
//           createdAt: i.createdAt,
//         };
//       })
//     );

//     res.json(enriched);
//   } catch (error) {
//     console.error("Error fetching interest details:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// 📖 Get interests by customerId
exports.getInterestByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const records = await InterestDetails.find({ customerId }).sort({ year: 1, month: 1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✏️ Update interest
exports.updateInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await InterestDetails.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Record not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ❌ Delete interest
exports.deleteInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await InterestDetails.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCustomerInterestSummary = async (req, res) => {
  try {
    const { customerId, itemCode } = req.params;

    // Find customer
    const customer = await Customer.findOne({ customerId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Find the specific item
    const item = customer.items.find(it => it.code === itemCode);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const originalLoan = item.loanAmount;
    const interestRate = item.interest;
    let currentLoan = originalLoan;

    const payments = await InterestDetails.find({ customerId, itemCode }).sort({ paidDate: 1 });

    const createdAt = item.createdAt || customer.createdAt;
    const earliestPaymentDate = payments.length ? payments[0].paidDate : createdAt;
    const start = new Date(Math.min(createdAt.getTime(), new Date(earliestPaymentDate).getTime()));
    start.setDate(1);

    const now = new Date();
    const grouped = [];
    let carryPending = 0;

    while (start <= now) {
      const year = start.getFullYear();
      const month = start.getMonth() + 1;

      const baseInterest = (currentLoan * interestRate) / 100;
      const expected = baseInterest + carryPending;

      const monthPayments = payments.filter(p => {
        const d = new Date(p.paidDate);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });

      const totalPaid = monthPayments.reduce((a, b) => a + b.paidAmount, 0);

      let pending = 0, extra = 0;
      if (totalPaid < expected) {
        pending = expected - totalPaid;
        carryPending = pending; // carry forward unpaid interest
      } else if (totalPaid > expected) {
        extra = totalPaid - expected;
        carryPending = 0;
        currentLoan -= extra; // reduce principal with overpayment
        if (currentLoan < 0) currentLoan = 0;
      } else {
        carryPending = 0;
      }

      grouped.push({
        month,
        year,
        expected: expected.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        pending: pending.toFixed(2),
        extra: extra.toFixed(2),
        currentLoan: currentLoan.toFixed(2),
        payments: monthPayments.map(p => ({
          paidAmount: p.paidAmount,
          paidDate: p.paidDate,
        })),
      });

      start.setMonth(start.getMonth() + 1);
    }

    // Add any extra payments outside the loop
    payments.forEach(p => {
      const d = new Date(p.paidDate);
      const exists = grouped.some(
        g => g.year === d.getFullYear() && g.month === d.getMonth() + 1
      );
      if (!exists) {
        grouped.push({
          month: d.getMonth() + 1,
          year: d.getFullYear(),
          expected: "0.00",
          totalPaid: p.paidAmount.toFixed(2),
          pending: "0.00",
          extra: "0.00",
          currentLoan: currentLoan.toFixed(2),
          payments: [{ paidAmount: p.paidAmount, paidDate: p.paidDate }],
        });
      }
    });

    grouped.sort(
      (a, b) => new Date(a.year, a.month - 1) - new Date(b.year, b.month - 1)
    );

    // 🟢 Add any remaining pending interest to the loan amount
    const currentLoanWithInterest = currentLoan + carryPending;

    // 🔹 Update currentLoanAmount in the database
    item.currentLoanAmount = currentLoanWithInterest;
    await customer.save();

    res.json({
      customerId,
      itemCode,
      interestRate,
      totalLoanAmount: originalLoan,
      currentLoanAmount: currentLoanWithInterest, // now includes pending interest
      months: grouped,
    });
  } catch (err) {
    console.error("Error in getCustomerInterestSummary:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// exports.getCustomerInterestSummary = async (req, res) => {
//   try {
//     const { customerId, itemCode } = req.params;

//     // Find customer
//     const customer = await Customer.findOne({ customerId });
//     if (!customer) return res.status(404).json({ message: "Customer not found" });

//     // Find the specific item
//     const item = customer.items.find(it => it.code === itemCode);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     const originalLoan = item.loanAmount;
//     const interestRate = item.interest;
//     let currentLoan = originalLoan;

//     // Get payments
//     const payments = await InterestDetails.find({ customerId, itemCode }).sort({ paidDate: 1 });

//     // Start date for calculation
//     const createdAt = item.createdAt || customer.createdAt;
//     const earliestPaymentDate = payments.length ? payments[0].paidDate : createdAt;
//     const start = new Date(
//       Math.min(createdAt.getTime(), new Date(earliestPaymentDate).getTime())
//     );
//     start.setDate(1);

//     const now = new Date();
//     const grouped = [];
//     let carryPending = 0;

//     while (start <= now) {
//       const year = start.getFullYear();
//       const month = start.getMonth() + 1;

//       const baseInterest = (currentLoan * interestRate) / 100;
//       const expected = baseInterest + carryPending;

//       // Payments for this month
//       const monthPayments = payments.filter(p => {
//         const d = new Date(p.paidDate);
//         return d.getFullYear() === year && d.getMonth() + 1 === month;
//       });

//       const totalPaid = monthPayments.reduce((a, b) => a + b.paidAmount, 0);

//       let pending = 0, extra = 0;
//       if (totalPaid < expected) {
//         pending = expected - totalPaid;
//         carryPending = pending;
//       } else if (totalPaid > expected) {
//         extra = totalPaid - expected;
//         carryPending = 0;
//         currentLoan -= extra;
//         if (currentLoan < 0) currentLoan = 0;
//       } else {
//         carryPending = 0;
//       }

//       grouped.push({
//         month,
//         year,
//         expected: expected.toFixed(2),
//         totalPaid: totalPaid.toFixed(2),
//         pending: pending.toFixed(2),
//         extra: extra.toFixed(2),
//         currentLoan: currentLoan.toFixed(2),
//         payments: monthPayments.map(p => ({
//           paidAmount: p.paidAmount,
//           paidDate: p.paidDate
//         }))
//       });

//       start.setMonth(start.getMonth() + 1);
//     }

//     // Add missed/future payments
//     payments.forEach(p => {
//       const d = new Date(p.paidDate);
//       const exists = grouped.some(
//         g => g.year === d.getFullYear() && g.month === d.getMonth() + 1
//       );
//       if (!exists) {
//         grouped.push({
//           month: d.getMonth() + 1,
//           year: d.getFullYear(),
//           expected: "0.00",
//           totalPaid: p.paidAmount.toFixed(2),
//           pending: "0.00",
//           extra: "0.00",
//           currentLoan: currentLoan.toFixed(2),
//           payments: [{ paidAmount: p.paidAmount, paidDate: p.paidDate }]
//         });
//       }
//     });

//     // Sort chronologically
//     grouped.sort(
//       (a, b) => new Date(a.year, a.month - 1) - new Date(b.year, b.month - 1)
//     );

//     // 🔹 Update currentLoanAmount in this customer's item
//     item.currentLoanAmount = currentLoan;
//     await customer.save();

//     res.json({
//       customerId,
//       itemCode,
//       interestRate,
//       totalLoanAmount: originalLoan,
//       currentLoanAmount: currentLoan, // ✅ expose new value
//       months: grouped
//     });
//   } catch (err) {
//     console.error("Error in getCustomerInterestSummary:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// exports.getCustomerInterestSummary = async (req, res) => {
//   try {
//     const { customerId, itemCode } = req.params;

//     const customer = await Customer.findOne({ customerId });
//     if (!customer) return res.status(404).json({ message: "Customer not found" });

//     const item = customer.items.find(it => it.code === itemCode);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     const originalLoan = item.loanAmount;
//     const interestRate = item.interest;
//     let currentLoan = originalLoan;

//     // 🗓 Find first date to start from: earliest of createdAt or first payment
//     const createdAt = item.createdAt || customer.createdAt;
//     const payments = await InterestDetails.find({ customerId, itemCode }).sort({ paidDate: 1 });

//     const earliestPaymentDate = payments.length ? payments[0].paidDate : createdAt;
//     const start = new Date(
//       Math.min(createdAt.getTime(), new Date(earliestPaymentDate).getTime())
//     );
//     start.setDate(1); // normalize to first of month

//     const now = new Date();
//     const grouped = [];
//     let carryPending = 0;

//     while (start <= now) {
//       const year = start.getFullYear();
//       const month = start.getMonth() + 1;
//       const baseInterest = (currentLoan * interestRate) / 100;
//       const expected = baseInterest + carryPending;

//       // Filter payments for this month (based on paidDate)
//       const monthPayments = payments.filter(p => {
//         const d = new Date(p.paidDate);
//         return d.getFullYear() === year && d.getMonth() + 1 === month;
//       });

//       const totalPaid = monthPayments.reduce((a, b) => a + b.paidAmount, 0);

//       let pending = 0, extra = 0;
//       if (totalPaid < expected) {
//         pending = expected - totalPaid;
//         carryPending = pending;
//       } else if (totalPaid > expected) {
//         extra = totalPaid - expected;
//         carryPending = 0;
//         currentLoan -= extra;
//         if (currentLoan < 0) currentLoan = 0;
//       } else {
//         carryPending = 0;
//       }

//       grouped.push({
//         month,
//         year,
//         expected: expected.toFixed(2),
//         totalPaid: totalPaid.toFixed(2),
//         pending: pending.toFixed(2),
//         extra: extra.toFixed(2),
//         currentLoan: currentLoan.toFixed(2),
//         payments: monthPayments.map(p => ({
//           paidAmount: p.paidAmount,
//           paidDate: p.paidDate
//         }))
//       });

//       start.setMonth(start.getMonth() + 1);
//     }

//     // 🔎 Add any payments outside range (future-dated or missed in loop)
//     payments.forEach(p => {
//       const d = new Date(p.paidDate);
//       const exists = grouped.some(g => g.year === d.getFullYear() && g.month === d.getMonth() + 1);
//       if (!exists) {
//         grouped.push({
//           month: d.getMonth() + 1,
//           year: d.getFullYear(),
//           expected: "0.00",
//           totalPaid: p.paidAmount.toFixed(2),
//           pending: "0.00",
//           extra: "0.00",
//           currentLoan: currentLoan.toFixed(2),
//           payments: [{ paidAmount: p.paidAmount, paidDate: p.paidDate }]
//         });
//       }
//     });

//     // Sort again to keep chronological order
//     grouped.sort((a, b) => new Date(a.year, a.month - 1) - new Date(b.year, b.month - 1));

//     res.json({
//       customerId,
//       itemCode,
//       interestRate,
//       totalLoanAmount: originalLoan,
//       months: grouped
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// exports.getCustomerInterestSummary = async (req, res) => {
//   try {
//     const { customerId, itemCode } = req.params;

//     const customer = await Customer.findOne({ customerId });
//     if (!customer) return res.status(404).json({ message: "Customer not found" });

//     const item = customer.items.find(it => it.code === itemCode);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     const originalLoan = item.loanAmount;
//     const interestRate = item.interest;
//     let currentLoan = originalLoan;

//     const createdAt = item.createdAt || customer.createdAt;
//     let start = new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 1);
//     const now = new Date();

//     const payments = await InterestDetails.find({ customerId, itemCode }).sort({ paidDate: 1 });

//     let carryPending = 0;
//     const grouped = [];

//     while (start <= now) {
//       const year = start.getFullYear();
//       const month = start.getMonth() + 1;
//       const baseInterest = (currentLoan * interestRate) / 100;
//       const expected = baseInterest + carryPending;

//       // Get all payments for this month
//       const monthPayments = payments.filter(p => p.year === year && p.month === month);
//       const totalPaid = monthPayments.reduce((a, b) => a + b.paidAmount, 0);

//       let pending = 0, extra = 0;
//       if (totalPaid < expected) {
//         pending = expected - totalPaid;
//         carryPending = pending;
//       } else if (totalPaid > expected) {
//         extra = totalPaid - expected;
//         carryPending = 0;
//         currentLoan -= extra;
//         if (currentLoan < 0) currentLoan = 0;
//       } else {
//         carryPending = 0;
//       }

//       grouped.push({
//         month,
//         year,
//         expected: expected.toFixed(2),
//         totalPaid: totalPaid.toFixed(2), // 👈 This is the new line you need to add
//         pending: pending.toFixed(2),
//         extra: extra.toFixed(2),
//         currentLoan: currentLoan.toFixed(2),
//         payments: monthPayments.map(p => ({
//           paidAmount: p.paidAmount,
//           paidDate: p.paidDate
//         }))
//       });

//       start.setMonth(start.getMonth() + 1);
//     }

//     res.json({
//       customerId,
//       itemCode,
//       interestRate,
//       totalLoanAmount: originalLoan,
//       months: grouped
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.getCustomerInterestSummary = async (req, res) => {
//   try {
//     const { customerId, itemCode } = req.params;

//     const customer = await Customer.findOne({ customerId });
//     if (!customer) return res.status(404).json({ message: "Customer not found" });

//     const item = customer.items.find(it => it.code === itemCode);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     const originalLoan = item.loanAmount;
//     const interestRate = item.interest;
//     let currentLoan = originalLoan;

//     const createdAt = item.createdAt || customer.createdAt;
//     let start = new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 1);
//     const now = new Date();

//     const payments = await InterestDetails.find({ customerId, itemCode }).sort({ paidDate: 1 });

//     let carryPending = 0;
//     const grouped = [];

//     while (start <= now) {
//       const year = start.getFullYear();
//       const month = start.getMonth() + 1;
//       const baseInterest = (currentLoan * interestRate) / 100;
//       const expected = baseInterest + carryPending;

//       // Get all payments for this month
//       const monthPayments = payments.filter(p => p.year === year && p.month === month);
//       const totalPaid = monthPayments.reduce((a, b) => a + b.paidAmount, 0);

//       let pending = 0, extra = 0;
//       if (totalPaid < expected) {
//         pending = expected - totalPaid;
//         carryPending = pending;
//       } else if (totalPaid > expected) {
//         extra = totalPaid - expected;
//         carryPending = 0;
//         currentLoan -= extra;
//         if (currentLoan < 0) currentLoan = 0;
//       } else {
//         carryPending = 0;
//       }

//       grouped.push({
//         month,
//         year,
//         expected: expected.toFixed(2),
//         pending: pending.toFixed(2),
//         extra: extra.toFixed(2),
//         currentLoan: currentLoan.toFixed(2),
//         payments: monthPayments.map(p => ({
//           paidAmount: p.paidAmount,
//           paidDate: p.paidDate
//         }))
//       });

//       start.setMonth(start.getMonth() + 1);
//     }

//     res.json({
//       customerId,
//       itemCode,
//       interestRate,
//       totalLoanAmount: originalLoan,
//       months: grouped
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };




// exports.getCustomerInterestSummary = async (req, res) => {
//   try {
//     const { customerId, itemCode } = req.params;

//     const customer = await Customer.findOne({ customerId });
//     if (!customer) return res.status(404).json({ message: "Customer not found" });

//     const item = customer.items.find(it => it.code === itemCode);
//     if (!item) return res.status(404).json({ message: "Item not found for this customer" });

//     const loanAmount = item.loanAmount;
//     const interestRate = item.interest; // e.g., 2%

//     // Monthly interest
//     const monthlyInterest = (loanAmount * interestRate) / 100;

//     // Get all payments
//     const payments = await InterestDetails.find({ customerId, itemCode }).sort({
//       year: 1,
//       month: 1,
//       paidDate: 1,
//     });

//     // Determine start month/year (loan month)
//     let startDate = item.createdAt || customer.createdAt;
//     let startYear = startDate.getFullYear();
//     let startMonth = startDate.getMonth() + 1; // JS month 0-11

//     // Last month to calculate (current)
//     const now = new Date();
//     const endYear = now.getFullYear();
//     const endMonth = now.getMonth() + 1;

//     let rows = [];
//     let carryPending = 0; // pending interest from previous months

//     let year = startYear;
//     let month = startMonth;

//     while (year < endYear || (year === endYear && month <= endMonth)) {
//       // 🔹 Expected interest = monthly + carryPending
//       let expectedThisMonth = monthlyInterest + carryPending;

//       // 🔹 Payments for this month
//       const monthPayments = payments.filter(p => p.year === year && p.month === month);

//       const paidThisMonth = monthPayments.reduce((a, p) => a + p.paidAmount, 0);

//       // 🔹 Pending interest
//       let pending = expectedThisMonth - paidThisMonth;
//       if (pending < 0) pending = 0; // overpayment handled later

//       // 🔹 Carry pending to next month
//       carryPending = pending;

//       // 🔹 Reduce total loan if overpaid
//       if (paidThisMonth > expectedThisMonth) {
//         const extra = paidThisMonth - expectedThisMonth;
//         item.loanAmount -= extra; // reduce principal
//         if (item.loanAmount < 0) item.loanAmount = 0;
//       }

//       // Add rows per payment
//       if (monthPayments.length > 0) {
//         monthPayments.forEach((p, idx) => {
//           rows.push({
//             sNo: rows.length + 1,
//             month,
//             year,
//             expected: monthlyInterest,
//             paid: p.paidAmount,
//             pending,
//             paidDate: p.paidDate,
//             totalLoanAmount: item.loanAmount,
//             startDate,
//           });
//         });
//       } else {
//         // no payment
//         rows.push({
//           sNo: rows.length + 1,
//           month,
//           year,
//           expected: monthlyInterest,
//           paid: 0,
//           pending,
//           paidDate: null,
//           totalLoanAmount: item.loanAmount,
//           startDate,
          
//         });
//       }

//       // move to next month
//       month++;
//       if (month > 12) {
//         month = 1;
//         year++;
//       }
//     }

//     return res.json({
//       customerId: customer.customerId,
//       customerName: customer.personalInfo.name,
//       itemCode: item.code,
//       itemName: item.item,
//       interestRate,
//       totalLoanAmount: item.loanAmount,
//       payments: rows,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// exports.getCustomerInterestSummary = async (req, res) => {
//   try {
//     const { customerId, itemCode } = req.params; // pass both in URL

//     // 🔎 1. Find customer by custom ID
//     const customer = await Customer.findOne({ customerId });
//     if (!customer) return res.status(404).json({ message: "Customer not found" });

//     // 🔎 2. Find item by itemCode
//     const item = customer.items.find((it) => it.code === itemCode);
//     if (!item) return res.status(404).json({ message: "Item not found for this customer" });

//     // 💰 Use the item’s own loan/interest
//     const loanAmount = item.loanAmount;
//     const interestRate = item.interest;

//     // 🧾 3. Get all payment records for this customer/item
//     const payments = await InterestDetails.find({ customerId, itemCode }).sort({
//       year: 1,
//       month: 1,
//       paidDate: 1,
//     });

//     // 🔄 4. Format each payment as a row
//     const rows = payments.map((p, idx) => ({
//       sNo: idx + 1,
//       customerId: p.customerId,
//       customerName: customer.personalInfo.name,
//       itemCode: p.itemCode,
//       itemName: item.item,
//       totalLoanAmount: loanAmount,
//       paidAmount: p.paidAmount,
//       paidDate: p.paidDate,
//       month: p.month,
//       year: p.year,
//       monthlyInterest: p.monthlyInterest,
//     }));

//     return res.json({
//       customerId: customer.customerId,
//       customerName: customer.personalInfo.name,
//       itemCode: item.code,
//       itemName: item.item,
//       totalLoanAmount: loanAmount,
//       interestRate,
//       payments: rows, // one row per payment
//     });
//   } catch (err) {
//     console.error("Error in getCustomerInterestSummary:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };


