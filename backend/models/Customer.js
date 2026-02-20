// const mongoose = require('mongoose');

// const customerSchema = new mongoose.Schema({
//   customerId: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   phone_number: { type: String, required: true, unique: true },
//   aadhar_number: { type: String, required: true, unique: true },
//   address: { type: String, required: true },
//   code: { type: String, required: true, unique: true },
//   item: {
//     type: String,
//     required: true,
//     enum: [
//       'Chain', 'Dollar Chain', 'Earring', 'Ring', 'Ear Matti', 'Dollar',
//       'Necklace', 'Bracelet', 'Stone Earring', 'Titanic Earring',
//       'Baby Ring', 'Mookuthi'
//     ],
//   },
//   weight: { type: Number, required: true },
//   pricePerWeight: { type: Number, required: true },
//   loanAmount: { type: Number, required: true },
//   interest: { type: Number, required: true },
  
//   // ✅ Make them optional
//   itemImage: { type: String, default: null },
//   customerImage: { type: String, default: null },

//   loanHistory: [
//     {
//       loanAmount: Number,
//       interestRate: Number,
//       durationMonths: Number,
//       totalRepayment: Number,
//     }
//   ],
//   transactionHistory: [
//     {
//       amountReturned: Number,
//       amountGrant: Number,
//       date: Date,
//     }
//   ],
//   currentAvailableValue: { type: Number, default: 0 }, 

// }, { timestamps: true });

// const validItemTypes = [
//   "Chain","Dollar Chain","Earring","Ring","Ear Matti","Dollar",
//   "Necklace","Bracelet","Stone Earring","Titanic Earring",
//   "Baby Ring","Mookuthi"
// ];

// const Customer = mongoose.model('Customer', customerSchema);

// module.exports = { Customer, validItemTypes };

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  code: { type: String, required: true },
  item: {
    type: String,
    required: true,
    enum: [
      'Chain', 'Dollar Chain', 'Earring', 'Ring', 'Ear Matti', 'Dollar',
      'Necklace', 'Bracelet', 'Stone Earring', 'Titanic Earring',
      'Baby Ring', 'Mookuthi'
    ],
  },
  weight: { type: Number, required: true },
  pricePerWeight: { type: Number, required: true },
  loanAmount: { type: Number, required: true },
    // 🔹 Use a function so default is set equal to loanAmount when creating the item
  currentLoanAmount: { 
    type: Number, 
    default: function () { 
      return this.loanAmount; 
    } 
  },
  // currentLoanAmount: { type: Number, default: 0 },
  interest: { type: Number, required: true },
  currentAvailableValue: { type: Number, default: 0 },

  loanHistory: [
    {
      loanAmount: Number,
      interestRate: Number,
      durationMonths: Number,
      totalRepayment: Number,
    }
  ],
  transactionHistory: [
    {
      amountReturned: Number,
      amountGrant: Number,
      date: { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },

  personalInfo: {
    name: { type: String, required: true },
phone_number: { type: String, required: true, unique: true },
    aadhar_number: { type: String, required: true },
    address: { type: String, required: true },
    customerImage: { type: String, default: null },
  },

  items: [itemSchema], // Multiple items per customer
  currentAvailableValue: { type: Number, default: 0 },

}, { timestamps: true });

const validItemTypes = [
  'Chain','Dollar Chain','Earring','Ring','Ear Matti','Dollar',
  'Necklace','Bracelet','Stone Earring','Titanic Earring',
  'Baby Ring','Mookuthi'
];

const Customer = mongoose.model('Customer', customerSchema);
module.exports = { Customer, validItemTypes };
