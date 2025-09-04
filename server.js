const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: './.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "Not loaded");
const eventRoutes = require("./Routers/eventRoutes.js");
const authRoutes = require("./Routers/authRoutes.js");
const ticketRoutes = require("./Routers/ticketRoutes.js");
const http = require("http");
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
connectDB();

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/Tickets",ticketRoutes);

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card']
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).send({ error: { message: e.message } });
  }
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
