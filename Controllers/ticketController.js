const crypto = require("crypto");
const Event = require("../Models/Event");
const Ticket = require("../Models/Ticket");
const User = require("../Models/User")
const qrCodeGenerator = require("../functions/QRCodeGenerator");
const path = require("path");

const createTicket = async (userId, eventId, seatNumber) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");
  const ticketCode = crypto
    .createHash("sha256")
    .update(userId + eventId + seatNumber + crypto.randomBytes(6).toString("hex"))
    .digest("hex")
    .slice(0, 10)
    .toUpperCase();
  const qrdata = await qrCodeGenerator(`Ticket:${ticketCode}|Event:${eventId}|Seat:${seatNumber}`);
  const ticket = new Ticket({
    owner: userId,
    event: eventId,
    ticketCode,
    seatNumber,
    qrCode: qrdata
  });
  await ticket.save();
  event.tickets.push(ticket._id);
  await event.save();
  return ticket;
};
const viewTickets = async (req,res) =>{
  try {
  const tickets = await Ticket.find({owner : req.user.id}).populate({path:'event',select:'title'});
  res.status(200).json(tickets);
}
catch (err) {
  res.status(400).json({message : "Server error"})
}
}
module.exports = {createTicket,viewTickets};