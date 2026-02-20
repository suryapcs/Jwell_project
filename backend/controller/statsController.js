const { Customer } = require('../models/Customer');
const InterestDetails  = require('../models/interestDetails');

// Loan amount by item type
exports.getLoanByItem = async (req, res) => {
  try {
    const customers = await Customer.find();
    const loanSummary = {};

    customers.forEach(c => {
      c.items.forEach(item => {
        loanSummary[item.item] = (loanSummary[item.item] || 0) + item.loanAmount;
      });
    });

    res.json(loanSummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New function to get loan and gold weight by item
exports.getLoanAndGoldByItem = async (req, res) => {
  try {
    const customers = await Customer.find();
    
    // Define all 12 valid items with default values
    const itemSummary = {
      "Chain": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Dollar Chain": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Earring": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Ring": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Ear Matti": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Dollar": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Necklace": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Bracelet": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Stone Earring": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Titanic Earring": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Baby Ring": { totalLoanAmount: 0, totalGoldWeight: 0 },
      "Mookuthi": { totalLoanAmount: 0, totalGoldWeight: 0 },
    };

    // Aggregate loan and gold weight for each item
    customers.forEach(c => {
      c.items.forEach(item => {
        if (itemSummary[item.item]) {
          itemSummary[item.item].totalLoanAmount += item.loanAmount;
          itemSummary[item.item].totalGoldWeight += item.goldWeight;
        }
      });
    });

    // Format the result into an array for the bar chart
    const formattedData = Object.entries(itemSummary).map(([itemName, data]) => ({
      name: itemName,
      loanAmount: data.totalLoanAmount,
      goldWeight: data.totalGoldWeight
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Monthly interest summary
exports.getMonthlyInterest = async (req, res) => {
  try {
    const interestData = await InterestDetails.aggregate([
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalInterest: { $sum: "$monthlyInterest" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    res.json(interestData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Item distribution for circle chart
exports.getItemDistribution = async (req, res) => {
  try {
    const customers = await Customer.find();
    const itemCount = {};

    customers.forEach(c => {
      c.items.forEach(item => {
        itemCount[item.item] = (itemCount[item.item] || 0) + 1;
      });
    });

    const total = Object.values(itemCount).reduce((a,b) => a+b, 0);
    const percentages = Object.fromEntries(
      Object.entries(itemCount).map(([k,v]) => [k, ((v/total)*100).toFixed(1)])
    );

    res.json(percentages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
