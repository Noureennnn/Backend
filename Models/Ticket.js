const User = require("../Models/User");
const Event = require("../Models/Event");
const mongoose = require("mongoose");
const Ticket = mongoose.Schema({
owner :{
    type : mongoose.Schema.Types.ObjectId,
    ref: "User",
    required : true,},

event:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required : true},
ticketCode:{
        type: String,
        required: true,
        unique:true},
seatNumber: {
        type: String,
        required: true,
    },

qrCode : {
    type: String,
    unique : true
}
    },{timestamps:true}
);
module.exports = mongoose.model("Ticket",Ticket)


