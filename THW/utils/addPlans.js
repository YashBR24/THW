const mongoose = require("mongoose");
const Plan = require("../models/Plan"); // Ensure the path is correct
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("MongoDB Connection Error:", err));

const plans = [
    {
        name: "Adult Plan",
        description: "For people aged 13 and above",
        basePrice: 1100,
        conditions: [{ field: "age", operator: ">=", value: 13 }],
        pricingRules: []
    },
    {
        name: "Kids Plan",
        description: "For children between 5 and 13 years",
        basePrice: 900,
        conditions: [{ field: "age", operator: ">", value: 5 }, { field: "age", operator: "<", value: 13 }],
        pricingRules: []
    },
    {
        name: "Buy 2 Get 1 Free",
        description: "For groups of 3, one person gets free entry",
        basePrice: 0,
        conditions: [{ field: "groupSize", operator: ">=", value: 3 }],
        pricingRules: [{ type: "BuyXGetY", buyX: 2, getY: 1 }]
    },
    {
        name: "Mid-Week Discount",
        description: "₹200 off on Wednesday and Thursday",
        basePrice: 0,
        conditions: [{ field: "day", operator: "==", value: "Wednesday" }, { field: "day", operator: "==", value: "Thursday" }],
        pricingRules: [{ type: "Flat", value: 200 }]
    },
    {
        name: "Weekend Charge",
        description: "₹200 extra on Saturday and Sunday",
        basePrice: 0,
        conditions: [{ field: "day", operator: "==", value: "Saturday" }, { field: "day", operator: "==", value: "Sunday" }],
        pricingRules: [{ type: "ExtraCharge", value: 200 }]
    }
];

const seedDatabase = async () => {
    try {
        await Plan.deleteMany({});
        await Plan.insertMany(plans);
        console.log("✅ Plans inserted successfully!");
        mongoose.disconnect();
    } catch (error) {
        console.log("❌ Error seeding database:", error);
        mongoose.disconnect();
    }
};

seedDatabase();
