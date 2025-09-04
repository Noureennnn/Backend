const router = require("express").Router();
const {createTicket} = require("../Controllers/ticketController.js");
const {protect} = require("../Middleware/authMiddleware.js");
const {viewTickets} = require("../Controllers/ticketController.js")

/* router.post("/:eventId",protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.eventId;
        const {seatNumber} = req.body;
        const ticket = await createTicket(userId, eventId,seatNumber);
        res.status(201).json({message:"Seat booked successfully",ticket});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}); */
router.get("/MyTickets",protect,viewTickets);
module.exports = router;
