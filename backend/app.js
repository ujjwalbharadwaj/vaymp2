const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { isAuthenticated, isSeller, isAdmin } = require("./middleware/auth");

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000'], // Allowed origin
  credentials: true, // Allow credentials (cookies)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

// Ensure preflight requests are handled
app.options('*', cors(corsOptions));

// app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.get("/api/v2/user/protected", isAuthenticated, (req, res) => {
  res.send(`Hello, ${req.user.name}`);
});

app.get("/api/v2/shop/protected", isSeller, (req, res) => {
  res.send(`Hello, ${req.seller.name}`);
});

app.get("/api/v2/admin/protected", isAuthenticated, isAdmin('Admin'), (req, res) => {
  res.send(`Hello, Admin ${req.user.name}`);
});

// Test route
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");
const admin = require("./controller/admin");
const notification = require("./controller/notification");
const shopIsActive = require("./controller/shopIsActive");
const refund = require("./controller/refund");
const kuchvi = require("./controller/kuchvi");

app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);
app.use("/api/v2/admin", admin);
app.use("/api/v2/shopIsActive", shopIsActive);
app.use("/api/v2/notification", notification);
app.use("/api/v2/refund", refund);
app.use("/api/v2/kuchvi", kuchvi);

// Error handling
app.use(ErrorHandler);

module.exports = app;
