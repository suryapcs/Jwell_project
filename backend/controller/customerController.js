const { Customer, validItemTypes } = require("../models/Customer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");

const InterestDetails = require("../models/interestDetails"); 

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/customers");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

exports.addCustomer = async (req, res) => {
  try {
    const { name, phone_number, aadhar_number, address, code, item, weight, pricePerWeight, loanAmount, interest } = req.body;

    if (!validItemTypes.includes(item)) {
      return res.status(400).json({ error: 'Invalid item type' });
    }

    const itemData = {
      code, item, weight, pricePerWeight, loanAmount, interest,
      loanHistory: [],
      transactionHistory: [],
      // ✅ Remove currentAvailableValue from item
    };

    // ✅ Check if customer exists
    let customer = await Customer.findOne({
      'personalInfo.phone_number': phone_number,
      'personalInfo.aadhar_number': aadhar_number,
    });

    if (customer) {
      // Existing customer → append new item
      customer.items.push(itemData);
      await customer.save();
      return res.status(200).json({
        message: 'Existing customer found, item added successfully',
        customer,
      });
    } else {
      // New customer → create with item
      const newCustomer = new Customer({
        customerId: `CUST-${Date.now()}`,
        personalInfo: { name, phone_number, aadhar_number, address },
        items: [itemData],
        currentAvailableValue: 0, // ✅ Set default at customer level
      });

      await newCustomer.save();
      return res.status(201).json({
        message: 'New customer created successfully',
        customer: newCustomer,
      });
    }
  } catch (error) {
    console.error('Add customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// exports.addCustomer = async (req, res) => {
//   try {
//     const { name, phone_number, aadhar_number, address, code, item, weight, pricePerWeight, loanAmount, interest } = req.body;

//     if (!validItemTypes.includes(item)) {
//       return res.status(400).json({ error: 'Invalid item type' });
//     }

//     const itemData = {
//       code, item, weight, pricePerWeight, loanAmount, interest,
//       loanHistory: [],
//       transactionHistory: [],
//       currentAvailableValue: 0,
//     };

//     // ✅ Check if customer exists
//   let customer = await Customer.findOne({
//   'personalInfo.phone_number': phone_number,
//   'personalInfo.aadhar_number': aadhar_number,
// });


//     if (customer) {
//       // Existing customer → append new item
//       customer.items.push(itemData);
//       await customer.save();
//       return res.status(200).json({
//         message: 'Existing customer found, item added successfully',
//         customer,
//       });
//     } else {
//       // New customer → create with item
//       const newCustomer = new Customer({
//         customerId: `CUST-${Date.now()}`,
//         personalInfo: { name, phone_number, aadhar_number, address },
//         items: [itemData],
//       });

//       await newCustomer.save();
//       return res.status(201).json({
//         message: 'New customer created successfully',
//         customer: newCustomer,
//       });
//     }
//   } catch (error) {
//     console.error('Add customer error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


// ✅ Step 2: Upload images (Optional)
exports.uploadCustomerImages = async (req, res) => {
  try {
    const { id } = req.params; // Customer ID

    const updateData = {};
    if (req.files?.itemImage?.[0]) updateData.itemImage = req.files.itemImage[0].path;
    if (req.files?.customerImage?.[0]) updateData.customerImage = req.files.customerImage[0].path;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCustomer) return res.status(404).json({ error: "Customer not found" });

    res.json({ message: "Step 2 complete: Images uploaded (if provided)", customer: updatedCustomer });
  } catch (error) {
    console.error("Upload customer images error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    // Step 1: Find customers who have at least one matching item
    const customers = await Customer.find({
      "items.currentAvailableValue": 0
    }).sort({ createdAt: -1 });

    // Step 2: Filter items so only currentAvailableValue = 0 are returned
    const filtered = customers.map(c => {
      const filteredItems = c.items.filter(item => item.currentAvailableValue === 0);
      return {
        ...c.toObject(),
        items: filteredItems
      };
    });

    res.json(filtered);
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// exports.getAllCustomers = async (req, res) => {
//   try {
//     // ✅ Get all customers whose currentAvailableValue = 0 (active customers)
//     const customers = await Customer.find({ currentAvailableValue: 0 })
//       .sort({ createdAt: -1 });

//     res.json(customers);
//   } catch (error) {
//     console.error("Get customers error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.getExistingCustomers = async (req, res) => {
  try {
    // Get all customers that have at least one item with currentAvailableValue = 1
    const customers = await Customer.find({ "items.currentAvailableValue": 1 }).sort({ createdAt: -1 });

    // Filter each customer's items to include only those where currentAvailableValue = 1
    const filtered = customers.map((customer) => {
      const filteredItems = customer.items.filter((item) => item.currentAvailableValue === 1);
      return {
        _id: customer._id,
        customerId: customer.customerId,
        personalInfo: customer.personalInfo,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        items: filteredItems, // ✅ Only available items
      };
    });

    res.json(filtered);
  } catch (error) {
    console.error("Error fetching existing customers:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// exports.getExistingCustomers = async (req, res) => {
//   try {
//     const customers = await Customer.find({ currentAvailableValue: 1 })
//       .sort({ createdAt: -1 });

//     res.json(customers);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 🔹 Filter only items where currentAvailableValue === 0
    const filteredItems = customer.items.filter(
      (item) => item.currentAvailableValue === 0
    );

    res.json({
      _id: customer._id,
      customerId: customer.customerId,
      personalInfo: customer.personalInfo,
      items: filteredItems, // ✅ only filtered items
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// exports.getCustomerById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid customer ID" });
//     }

//     const customer = await Customer.findById(id);
//     if (!customer) return res.status(404).json({ message: "Customer not found" });

//     res.json({
//       _id: customer._id,
//       customerId: customer.customerId,
//       personalInfo: customer.personalInfo,
//       items: customer.items, // all items
//       createdAt: customer.createdAt,
//       updatedAt: customer.updatedAt,
//     });
//   } catch (error) {
//     console.error("Error fetching customer:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };



exports.updateCustomerFull = async (req, res) => {
  try {
    const { id } = req.params; // only customer id
    const { selectedItemCode, personalInfo, itemData } = req.body; // get selected item code from body

    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Update personal info
    if (personalInfo) {
      Object.keys(personalInfo).forEach(key => {
        customer.personalInfo[key] = personalInfo[key];
      });
    }

    // Update selected item
    const itemIndex = customer.items.findIndex(item => item.code === selectedItemCode);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

    if (itemData) {
      Object.keys(itemData).forEach(key => {
        customer.items[itemIndex][key] = itemData[key];
      });
    }

    await customer.save();

    res.json({
      message: "Customer and item updated successfully",
      customer,
      updatedItem: customer.items[itemIndex],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// exports.updateCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     if (updateData.item && !validItemTypes.includes(updateData.item)) {
//       return res.status(400).json({ error: "Invalid item type" });
//     }

//     if (req.files?.itemImage?.[0]) updateData.itemImage = req.files.itemImage[0].path;
//     if (req.files?.customerImage?.[0]) updateData.customerImage = req.files.customerImage[0].path;

//     const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, { new: true });

//     if (!updatedCustomer) return res.status(404).json({ error: "Customer not found" });

//     res.json({ message: "Customer updated successfully", customer: updatedCustomer });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

// ✅ Soft delete → currentAvailableValue = 1
// Soft delete → just update field, don’t remove doc
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Update only the flag
    const customer = await Customer.findByIdAndUpdate(
      id,
      { $set: { currentAvailableValue: 1 } }, // mark as deleted
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer marked as deleted (soft delete)", customer });
  } catch (error) {
    console.error("Soft delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Restore a single item by setting its currentAvailableValue to 0
exports.restoreItem = async (req, res) => {
  try {
    const { customerId, itemCode } = req.params;

    // Find customer
    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Find item
    const item = customer.items.find(i => i.code === itemCode);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update item currentAvailableValue to 0
    item.currentAvailableValue = 0;

    // Save customer
    await customer.save();

    res.json({ message: "Item restored successfully", item });
  } catch (error) {
    console.error("Restore item error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.restoreCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { $set: { currentAvailableValue: 0 } }, // restore
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer restored successfully", customer });
  } catch (error) {
    console.error("Restore error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



exports.getInvoiceByCustomerAndItem = async (req, res) => {
  try {
    const { customerId, itemCode } = req.params;
    const customer = await Customer.findOne({ customerId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const item = customer.items.find((i) => i.code === itemCode);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const doc = new PDFDocument({ size: "A4", margin: 20 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=pledge-token-${customer.customerId}-${item.code}.pdf`
    );
    doc.pipe(res);

    const tamilFontPath = path.join(__dirname, "../assets/fonts/NotoSansTamil-Regular.ttf");
    doc.registerFont("TamilFont", tamilFontPath);

    const pageWidth = doc.page.width;
    const halfHeight = doc.page.height / 2;
    const logoPath = path.join(__dirname, "../assets/images/vetrilogo.png");

    // 📄 Draw pledge token block
    function drawToken(yPos) {
  const startX = 30;

  // ✅ Add logo on PAGE 1 (top-left of each half)
  if (logoPath) {
    const logoSize = 80; // Adjust logo size
    const logoY = yPos;  // Position relative to block
    doc.image(logoPath, 25, logoY, { width: logoSize, height: logoSize });
  }

  doc.rect(20, yPos, pageWidth - 40, halfHeight - 30).stroke();

      // Header
      const headerText =
        "வெற்றி பேங்கர்ஸ்\n55/3/142(9) காமராஜர் நகர்,\nகீழச்சுரண்டை - 627 859\nPhone: +91 93614 06430";
      doc.font("TamilFont").fontSize(14).text(headerText, 20, yPos + 10, {
        width: pageWidth - 60,
        align: "center",
      });

      // Loan details (left)
      let leftY = yPos + 100;
      doc.fontSize(12).text(`Amount: ₹${item.loanAmount}`, startX, leftY, { lineGap: 2 });
      leftY += 18;
      doc.text(`Interest Rate: ${item.interest}% p.a`, startX, leftY, { lineGap: 2 });
      leftY += 20;
      doc.text("Total no. of Gold Ornaments: 1", startX, leftY, { lineGap: 2 });

      // Right column
      const rightX = pageWidth / 2 + 20;
      let rightY = yPos + 100;
      const loanDate = new Date();
      const dueDate = new Date();
      dueDate.setFullYear(loanDate.getFullYear() + 1);

      [
        `Cust ID: ${customer.customerId}`,
        `Date of Loan: ${loanDate.toLocaleDateString()}`,
        `Due Date: ${dueDate.toLocaleDateString()}`,
        `Customer Name: ${customer.personalInfo.name}`,
        `Address: ${customer.personalInfo.address}`,
        `Aadhaar No: ${customer.personalInfo.aadhar_number}`,
        `Mobile: ${customer.personalInfo.phone_number}`,
      ].forEach((line) => {
        doc.text(line, rightX, rightY, {lineGap : 2});
        rightY += 18;
      });

      // Signatures
      const signY = yPos + halfHeight - 80;
      const signWidth = pageWidth - 80;
      doc.fontSize(12).text(
        "Authorized Signatory: ___________              Customer Signature: ___________",
        40,
        signY,
        { width: signWidth, align: "center" }
      );
    }

    // ✅ PAGE 1: Two pledge tokens
    drawToken(20);
    drawToken(doc.page.height / 2 + 10);

    // ✅ PAGE 2: Terms & Conditions + Ledger
   // ✅ PAGE 2: Terms & Conditions + Ledger
doc.addPage();

// Add logo top-left
doc.image(logoPath, 25, 20, { width: 80, height: 80 });

const headerY = 80; // fixed header position below logo
const headerText =
  "வெற்றி பேங்கர்ஸ்\n55/3/142(9) காமராஜர் நகர்,\nகீழச்சுரண்டை - 627 859\nPhone: +91 93614 06430";

doc.font("TamilFont").fontSize(14).text(headerText, 20, headerY, {
  width: pageWidth - 70,
  align: "center",
});

// Ledger header
doc.fontSize(16)
  .text(`Customer ID: ${customer.customerId}`, { lineGap: 4 })
  .text(`Customer Name: ${customer.personalInfo.name}`, { lineGap: 4 })
  .text(`Item: ${item.item}`, { lineGap: 4 })
  .text(`Loan Amount: ₹${item.loanAmount}`, { lineGap: 4 })
  .text(`Interest Rate: ${item.interest}% p.a`, { lineGap: 4 })
  .text(`Address: ${customer.personalInfo.address}`, { lineGap: 4 })
  .text(`Mobile: ${customer.personalInfo.phone_number}`, { lineGap: 4 })
  .moveDown(2);


const fullTerms = `
1. மேற்கொண்ட நகைகள் என்னுடைய சொந்தப் பொருள் என்பதை உறுதி கூறி கையெழுத்து செய்திருக்கிறேன். (அ) கைக்குறி

2. அடகுச் சொத்தை மீட்டியவரின் (ஏ) ஏலத்தில் எடுத்தவரின் கையெழுத்து (அ) கைக்குறி

3. அடகு வைத்துக்கொண்டு கடன் கொடுத்தவர் (ஏ) அவருடைய ஏஜெண்டு கையெழுத்து

4. இதில் கொண்ட அசலையும், வட்டியையும் செலுத்தி மேற்கொண்ட நகைகளை சரிபார்த்து எனது பொருள் தான் என்பதை தெரிந்து திரும்பப் பெற்றுக்கொண்டேன்.
`;

doc.fontSize(12).text(fullTerms.trim(), { align: "left", lineGap: 6 }).moveDown(2);

const ledgerSignWidth = pageWidth - 100;
const signY = doc.y + 40;

// Column positions
const leftColumnX = 100;   // adjust to move the first pair horizontally
const rightColumnX = 350;  // adjust for the second pair spacing

doc.fontSize(12);

// --- First signature block (left side) ---
doc.text("Customer Signature : __________", leftColumnX, signY);
doc.text("Date:", leftColumnX, signY + 35);         // date under "Customer"

// --- Second signature block (right side) ---
doc.text("Customer Signature : __________", rightColumnX, signY);
doc.text("Date:", rightColumnX, signY + 35);



    doc.end();
  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({ error: "Server error while generating invoice" });
  }
};



// exports.getInvoiceByCustomerAndItem = async (req, res) => {
//   try {
//     const { customerId, itemCode } = req.params;

//     // Validate IDs
//   const customer = await Customer.findOne({ customerId: customerId });

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     // ✅ Get the specific item
//     const item = customer.items.find(i => i.code === itemCode);
//     if (!item) {
//       return res.status(404).json({ message: "Item not found for this customer" });
//     }

//     const doc = new PDFDocument({ size: "A4", margin: 20 });
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `inline; filename=pledge-token-${customer._id}-${item.code}.pdf`
//     );
//     doc.pipe(res);

//     const pageWidth = doc.page.width;
//     const halfHeight = doc.page.height / 2;

//     function drawToken(yPos) {
//       const startX = 30;

//       doc.rect(20, yPos, pageWidth - 40, halfHeight - 30).stroke();

//       // Logo
//       const logoPath = path.join(__dirname, "../assets/logo.png");
//       try {
//         doc.image(logoPath, startX + 10, yPos + 5, { width: 40 });
//       } catch {
//         doc.fillColor("#999").fontSize(12).text("LOGO", startX + 10, yPos + 15);
//       }

//       doc
//         .fillColor("#000")
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("வெற்றி பேங்கர்ஸ்", startX + 60, yPos + 8);
//       doc
//         .font("Helvetica")
//         .fontSize(10)
//         .text("123 Main Road, Chennai - 600001", startX + 60, yPos + 25)
//         .text("Phone: +91 98765 43210 | Email: info@company.com", startX + 60, yPos + 38);

//       let leftY = yPos + 80;
//       doc.fontSize(11).text(`Amount: ₹${item.loanAmount}`, startX, leftY);
//       leftY += 16;
//       doc.text(`Amount in Words: __________________`, startX, leftY);
//       leftY += 16;
//       doc.text(`Interest Rate: ${item.interest}% p.a`, startX, leftY);

//       leftY += 25;
//       doc.fontSize(11).text("Details of Gold Ornaments", startX, leftY);
//       leftY += 18;
//       doc.fontSize(10).text("Name of Article", startX, leftY);
//       doc.text("No. of Articles", startX + 200, leftY);

//       leftY += 15;
//       doc.text(item.item || "Chain", startX, leftY);
//       doc.text("1", startX + 200, leftY);

//       leftY += 20;
//       doc.text(`Total no. of Gold Ornaments: 1`, startX, leftY);

//       leftY += 30;
//       doc.text("Authorized Signatory: ___________", startX, leftY);

//       // Right details
//       const rightX = pageWidth / 2 + 20;
//       let rightY = yPos + 80;

//       const loanDate = new Date();
//       const dueDate = new Date();
//       dueDate.setFullYear(loanDate.getFullYear() + 1);

//       doc.text(`Cust ID: ${customer.customerId}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Date of Loan: ${loanDate.toLocaleDateString()}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Due Date: ${dueDate.toLocaleDateString()}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Customer Name: ${customer.personalInfo.name}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Address: ${customer.personalInfo.address}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Aadhaar No: ${customer.personalInfo.aadhar_number}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Mobile: ${customer.personalInfo.phone_number}`, rightX, rightY);
//       rightY += 30;
//       doc.text("Customer Signatory: ____________", rightX, rightY);

//       let footerY = yPos + halfHeight - 60;
//       doc
//         .fontSize(9)
//         .fillColor("#555")
//         .text(
//           "Terms & Conditions: The pledged gold ornaments will remain with the company until full repayment of principal and interest.",
//           startX,
//           footerY,
//           { width: pageWidth - 80, align: "center" }
//         );
//       footerY += 25;
//       doc.text("Note: Please bring this token for redemption of pledged gold.", {
//         align: "center",
//       });
//     }

//     drawToken(20);
//     drawToken(doc.page.height / 2 + 10);

//     // Ledger page
//     doc.addPage();
//     doc
//       .fontSize(18)
//       .font("Helvetica-Bold")
//       .text("Gold Loan Ledger", { align: "center" });
//     doc.moveDown();

//     doc
//       .fontSize(12)
//       .font("Helvetica")
//       .text(`Customer ID: ${customer.customerId}`)
//       .text(`Customer Name: ${customer.personalInfo.name}`)
//       .text(`Item: ${item.item}`)
//       .text(`Loan Amount: ₹${item.loanAmount}`)
//       .text(`Interest Rate: ${item.interest}% p.a`)
//       .text(`Address: ${customer.personalInfo.address}`)
//       .text(`Mobile: ${customer.personalInfo.phone_number}`)
//       .moveDown();

//     doc.end();
//   } catch (err) {
//     console.error("Invoice error:", err);
//     res.status(500).json({ error: "Server error while generating invoice" });
//   }
// };


// exports.getInvoiceById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid customer ID" });
//     }

//     const customer = await Customer.findById(id);
//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     const doc = new PDFDocument({ size: "A4", margin: 20 });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `inline; filename=pledge-token-${customer._id}.pdf`
//     );
//     doc.pipe(res);

//     const pageWidth = doc.page.width;
//     const halfHeight = doc.page.height / 2;

//     // --- Draw Token Function ---
//     function drawToken(yPos) {
//       const startX = 30;

//       // Border
//       doc.rect(20, yPos, pageWidth - 40, halfHeight - 30).stroke();

//       // Logo
//       const logoPath = path.join(__dirname, "../assets/logo.png");
//       try {
//         doc.image(logoPath, startX + 10, yPos + 5, { width: 40 });
//       } catch {
//         doc.fillColor("#999").fontSize(12).text("LOGO", startX + 10, yPos + 15);
//       }

//       // Office Info
//       doc
//         .fillColor("#000")
//         .font("Helvetica-Bold")
//         .fontSize(14)
//         .text("வெற்றி பேங்கர்ஸ்", startX + 60, yPos + 8);
//       doc
//         .font("Helvetica")
//         .fontSize(10)
//         .text("123 Main Road, Chennai - 600001", startX + 60, yPos + 25)
//         .text("Phone: +91 98765 43210 | Email: info@company.com", startX + 60, yPos + 38);

//       // Left details
//       let leftY = yPos + 80;
//       doc.fontSize(11).text(`Amount: ₹${customer.loanAmount}`, startX, leftY);
//       leftY += 16;
//       doc.text(`Amount in Words: __________________`, startX, leftY);
//       leftY += 16;
//       doc.text(`Interest Rate: ${customer.interest}% p.a`, startX, leftY);

//       leftY += 25;
//       doc.fontSize(11).text("Details of Gold Ornaments", startX, leftY);
//       leftY += 18;
//       doc.fontSize(10).text("Name of Article", startX, leftY);
//       doc.text("No. of Articles", startX + 200, leftY);

//       leftY += 15;
//       doc.text(customer.item || "Chain", startX, leftY);
//       doc.text("1", startX + 200, leftY);

//       leftY += 20;
//       doc.text("Total no. of Gold Ornaments: 1", startX, leftY);

//       leftY += 30;
//       doc.text("Authorized Signatory: ___________", startX, leftY);

//       // Right details
//       const rightX = pageWidth / 2 + 20;
//       let rightY = yPos + 80;

//       const loanDate = new Date();
//       const dueDate = new Date();
//       dueDate.setFullYear(loanDate.getFullYear() + 1);

//       doc.text(`Cust ID: ${customer.customerId}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Date of Loan: ${loanDate.toLocaleDateString()}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Due Date: ${dueDate.toLocaleDateString()}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Customer Name: ${customer.name}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Address: ${customer.address}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Aadhaar No: ${customer.aadhar_number}`, rightX, rightY);
//       rightY += 16;
//       doc.text(`Mobile: ${customer.phone_number}`, rightX, rightY);
//       rightY += 30;
//       doc.text("Customer Signatory: ____________", rightX, rightY);

//       // Footer
//       let footerY = yPos + halfHeight - 60;
//       doc
//         .fontSize(9)
//         .fillColor("#555")
//         .text(
//           "Terms & Conditions: The pledged gold ornaments will remain with the company until full repayment of principal and interest.",
//           startX,
//           footerY,
//           { width: pageWidth - 80, align: "center" }
//         );
//       footerY += 25;
//       doc.text("Note: Please bring this token for redemption of pledged gold.", {
//         align: "center",
//       });
//     }

//     // Draw two tokens
//     drawToken(20);
//     drawToken(doc.page.height / 2 + 10);

//     // Ledger Page
//     doc.addPage();

//     doc
//       .fontSize(18)
//       .font("Helvetica-Bold")
//       .text("Gold Loan Ledger", { align: "center" });
//     doc.moveDown();

//     doc
//       .fontSize(12)
//       .font("Helvetica")
//       .text(`Customer ID: ${customer.customerId}`)
//       .text(`Customer Name: ${customer.name}`)
//       .text(`Loan Amount: ₹${customer.loanAmount}`)
//       .text(`Interest Rate: ${customer.interest}% p.a`)
//       .text(`Address: ${customer.address}`)
//       .text(`Mobile: ${customer.phone_number}`)
//       .moveDown();

//     const tableTop = doc.y + 10;
//     const col1 = 50, col2 = 150, col3 = 250, col4 = 350, col5 = 450;

//     doc.font("Helvetica-Bold").fontSize(11);
//     doc.text("Date", col1, tableTop);
//     doc.text("Principal Paid", col2, tableTop);
//     doc.text("Interest Paid", col3, tableTop);
//     doc.text("Balance", col4, tableTop);
//     doc.text("Remarks", col5, tableTop);
//     doc.moveTo(40, tableTop + 15).lineTo(pageWidth - 40, tableTop + 15).stroke();

//     doc.font("Helvetica").fontSize(10);
//     let y = tableTop + 25;
//     for (let i = 0; i < 15; i++) {
//       doc
//         .text("__________", col1, y)
//         .text("__________", col2, y)
//         .text("__________", col3, y)
//         .text("__________", col4, y)
//         .text("__________________", col5, y);
//       y += 25;
//     }

//     // --- Footer Signatures ---
//     const footerY = doc.page.height - 100;
//     doc
//       .fontSize(11)
//       .text("Customer Signatory: ____________", 60, footerY, { align: "left" });
//     doc.text("Customer Signatory: ____________", pageWidth - 250, footerY, {
//       align: "left",
//     });

//     doc.end();
//   } catch (err) {
//     console.error("Token error:", err);
//     res
//       .status(500)
//       .json({ error: "Server error while generating pledge token and ledger" });
//   }
// };


exports.logout = async (req, res) => {
  try {
    // If you're using stateless JWT, there’s no server session to destroy.
    // The client should simply delete the token.
    res.status(200).json({
      message: "Logout successful. Please remove the token from client storage.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Server error during logout" });
  }
};

exports.getCustomerItemDetails = async (req, res) => {
  try {
    const { customerId, itemCode } = req.params;

    // Find customer by customerId
    const customer = await Customer.findOne({ customerId });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Find item by code
    const item = customer.items.find(i => i.code === itemCode);

    if (!item) {
      return res.status(404).json({ message: "Item not found for this customer" });
    }

    res.json({
      personalInfo: customer.personalInfo,
      itemDetails: item,
    });
  } catch (error) {
    console.error("Error fetching customer item:", error);
    res.status(500).json({ error: "Server error" });
  }
};



exports.getNextItemCode = async (req, res) => {
  try {
    const latestItem = await Customer.aggregate([
      { $unwind: "$items" }, 
      { $sort: { "items.createdAt": -1 } },
      { $limit: 1 },
      { $project: { code: "$items.code" } }
    ]);

    let nextCode = "A101"; // default if no items exist

    if (latestItem.length > 0) {
      const lastCode = latestItem[0].code; 
      const numberPart = parseInt(lastCode.slice(1)) + 1; 
      nextCode = `A${numberPart}`;
    }

    res.json({ nextCode });
  } catch (error) {
    console.error("Error generating next code:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const existingCustomers = await Customer.countDocuments({ currentAvailableValue: 1 });
    const currentCustomers = await Customer.countDocuments({ currentAvailableValue: 0 });

    const customers = await Customer.find();

    let totalLoanAmount = 0;
    let totalItems = 0;
    let totalWeight = 0;

    customers.forEach(cust => {
      cust.items.forEach(item => {
        totalLoanAmount += item.loanAmount;
        totalItems += 1;
        totalWeight += item.weight;
      });
    });

    const totalInterestResult = await InterestDetails.aggregate([
      {
        $group: {
          _id: null,
          totalPaid: { $sum: "$paidAmount" }
        }
      }
    ]);

    const totalInterestPaid = totalInterestResult.length > 0 ? totalInterestResult[0].totalPaid : 0;

    res.json({
      totalCustomers,
      existingCustomers,
      currentCustomers,
      totalLoanAmount,
      totalItems,
      totalWeight,
      totalInterestPaid
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while calculating stats" });
  }
};



// 📊 GET /api/stats/monthly-customer-count
exports.getMonthlyCustomerCount = async (req, res) => {
  try {
    const result = await Customer.aggregate([
      {
        // Group by year and month of createdAt
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format result to { name: "MMM YYYY", value: count }
  const formatted = result.map((item) => {
  const date = new Date(item._id.year, item._id.month - 1);
  // Change the locale to 'en-US' or specify a different option
  const name = date.toLocaleString("en-US", { month: "short", year: "numeric" });
  return { name, value: item.count };
});

res.json(formatted);
  } catch (err) {
    console.error("Error fetching monthly customer count:", err);
    res.status(500).json({ error: "Failed to fetch monthly customer count" });
  }
};


// Close Loan Controller
exports.closeLoan = async (req, res) => {
  try {
    const { customerId, itemCode } = req.params;

    // Find customer
    const customer = await Customer.findOne({ customerId });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Find item
    const item = customer.items.find((it) => it.code === itemCode);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Update loan status
    item.currentLoanAmount = 0;                 // Loan closed
    item.currentAvailableValue = 1;             // Mark item as available again
    customer.currentAvailableValue += 1;        // Optional: customer level available count

    await customer.save();

    res.json({
      message: "Loan closed successfully",
      customerId,
      itemCode,
      currentAvailableValue: item.currentAvailableValue,
    });
  } catch (err) {
    console.error("Close Loan Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



exports.upload = upload;

