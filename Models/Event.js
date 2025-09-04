const mongoose = require("mongoose");
const User= require("../Models/User");
const seatSchema = mongoose.Schema({
    seatNumber: {
        type:String,
        required: true,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    bookedBy : {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        default:null
    }
})
const eventSchema = mongoose.Schema({
    title:{
        type:String,
        required : true,
    },
    date:{
        type: String ,
        required : true,
    },
    venue:{
        type:String,
        required : true,
    },
    time:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required : true,
    },
    seats:[seatSchema],
    ticketsSold:{
        type:Number,
        default:0
    },
    status: {
    type: String,
    enum: ['Pending', 'Up-Coming', 'Closed'],
  },
    description:{type:String,required:true},
    tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  }],
  popularity: {
    type:String,
enum: ['Unpopular', 'Neutral', 'Popular','Highly Popular']
  }


}, {timestamps:true , versionKey: false})
module.exports = mongoose.model("Event",eventSchema);