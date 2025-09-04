const router = require("express").Router();
const {createTicket} = require("../Controllers/ticketController.js");
const {protect} = require("../Middleware/authMiddleware.js");
const {viewTickets} = require("../Controllers/ticketController.js")

router.get("/MyTickets",protect,viewTickets);
module.exports = router;
