const mongoose = require("mongoose");
const Event = require("../Models/Event");
const router = require("express").Router();
const Ticket = require("../Models/Ticket");
const {createTicket} = require("../Controllers/ticketController");
const generateSeats = require("../functions/generateSeats");
const User = require("../Models/User");

const createEvent = async (req, res) => {
  try {
    const { title, date, venue, price, rows, seatsPerRow,time,description,status,popularity} = req.body;
    if (!title || !date || !venue || !price || !rows || !seatsPerRow || !time || !description || !status) {
      return res.status(400).json({ message: "All fields are mandatory" });
    } else {
      const generatedSeats = generateSeats(rows, seatsPerRow);
      const newEvent = new Event({
        title,
        date,
        venue,
        time,
        price,
        description,
        status,
        seats: generatedSeats,
        ticketsSold: 0,
        popularity
      });
      await newEvent.save();
    console.log('Emitting newEventCreated:', newEvent.title);
      res.status(201).json({ message: "Event created successfully!",newEvent });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const eventList = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const bookEvent = async (req, res) => {
  try {
    console.log("Booking request:", req.params, req.body);

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID." });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    const userId = req.user.id.toString();

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const { seatNumbers } = req.body;
    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: "No seats selected." });
    }
    for (const seatNumber of seatNumbers) {
      const seat = event.seats.find((s) => s.seatNumber === seatNumber);
      if (!seat) {
        return res.status(400).json({ message: `Seat ${seatNumber} does not exist.` });
      }
      if (seat.isBooked) {
        return res.status(400).json({ message: `Seat ${seatNumber} is already booked.` });
      }
    }

    const bookedTickets = [];
    for (const seatNumber of seatNumbers) {
      const seat = event.seats.find((s) => s.seatNumber === seatNumber);
      seat.isBooked = true;
      seat.bookedBy = userId;

      try {
        const ticket = await createTicket(userId, id, seatNumber);
        event.tickets.push(ticket._id);
        bookedTickets.push(ticket);
      } catch (ticketErr) {
        console.error("🎟️ Ticket creation error:", ticketErr.message);
        return res.status(500).json({ message: "Failed to create ticket" });
      }
    }

    event.ticketsSold = (event.ticketsSold || 0) + seatNumbers.length;
    await event.save();

    return res.status(200).json({
      message: "Seats booked successfully!",
      tickets: bookedTickets,
    });
  } catch (err) {
    console.error("Booking error:", err.message, err.stack);
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
};
const deleteEvent = async (req, res) => {
   const event = await Event.findById(req.params.id);
   if (!event) { res.status(400).json({ message: "Event not found..." });
   } else
     { await Ticket.deleteMany({ event: event._id });
      await Event.findByIdAndDelete(req.params.id);
       res.status(200).json({ message: "Event deleted alongside tickets" }); } };

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404).json({ message: "Event is not found" });
  } else {
    event.title = req.body.title || event.title;
    event.date = req.body.date || event.date;
    event.seats = req.body.seats || event.seats;
    event.time = req.body.time || event.time;
    event.price = req.body.price || event.price;
    event.status = req.body.status || event.status;
    event.description = req.body.description || event.description;
    event.seatsPerRow = req.body.seatsPerRow || event.seatsPerRow;
    event.rows = req.body.rows || event.rows;
    event.popularity = req.body.popularity || event.popularity;
    await event.save();
    res.status(200).json({ message: "Event updated to your liking" });
  }
};
const eventDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const adminDashboard = async(req,res) => {
  try{
  const totalEvents = await Event.countDocuments();
  const totalTickets = await Ticket.countDocuments();
  const dividedTickets = await Ticket.find().populate("event","price");
  const revenue = dividedTickets.reduce((sum,ticket) => sum + ticket.event.price,0);
  res.status(200).json({totalEvents,totalTickets,revenue});
} catch(err) {res.status(400).json({message:"Server error"});}
};

const genderChart = async(req,res) =>{
  try{
  const users = await User.find({},{gender:1,_id:0});
  const females = users.filter((user) => user.gender ==="Female").length;
  const males = users.filter((user) => user.gender ==="Male").length;
  const chartData ={
  labels : ["Female","Male"],
  data : [females,males]
  };
  res.json(chartData)}
  catch(err){res.status(500).json({error: err.message});}
}

const EventgenderChart = async(req,res) =>{
  try{
    const id = req.params.id;
  const tickets = await Ticket.find({event: id}).populate("owner","gender");
  const females = tickets.filter((user) => user.owner?.gender ==="Female").length;
  const males = tickets.filter((user) => user.owner?.gender ==="Male").length;
  const chartData ={
  labels : ["Female","Male"],
  data : [females,males]
  };
  res.json(chartData)}
  catch(err){res.status(500).json({error: err.message});}
}
const ageRanges = async (req, res) => {
    try {
        const eventId = req.params.id;
        const tickets = await Ticket.find({ event: eventId }).populate({
            path: 'owner',
            select: 'age'
        });
        const ageCounts = {};
        tickets.forEach(ticket => {
            const userAge = ticket.owner?.age;
            if (userAge) {
                ageCounts[userAge] = (ageCounts[userAge] || 0) + 1;}
        });
const fdata = Object.keys(ageCounts).map(age => ({
            x:ageCounts[age] ,
            y: Number(age)}));
        
        res.status(200).json(fdata);
    } catch (err) {
        console.error(err);
        res.json({ message: "Error fetching attendees" });
    }
};
const agePieChart = async(req,res) => {
  try {
    const tickets = await Ticket.find().populate({path:'owner',select:'age'});
    const ages = {
      '18-24 Years' : 0,
      '25-34 Years' : 0,
      '35-44 Years' : 0,
      '44+ Years' : 0,
    };
    tickets.forEach(ticket => {
      const userAge = ticket.owner?.age;
      if(userAge){
        if(userAge>=18 && userAge<=24){ages['18-24 Years']++;}
        if(userAge>=25 && userAge<=34){ages['25-34 Years']++;}
        if(userAge>=35 && userAge<=44){ages['35-44 Years']++;}
        if(userAge>=44){ages['44+ Years']++;}
      }
    }); res.status(200).json(ages);
  } catch(err){console.error("didn't fetch age ranges",err);
    res.status(500).json({message : "Error fetching attendees"})
  }
}
const locationsBarChart = async(req,res) => {
  try {
    const result = await Ticket.aggregate([
      {$lookup: {
        from: "users",
        localField:"owner",
        foreignField:"_id",
        as: "UserDetails"},},
        {$unwind:"$UserDetails",},
        { $match: { "UserDetails.location": { $nin: [null, ""] } } },
      {$group : {
        _id:"$UserDetails.location",
        total: {$sum:1}}},
    ]);
    res.status(200).json(result);
  }catch(err){res.status(500).json({message:"Couldn't fetch attendees locations",err})}
}
const eventlocationBarChart = async(req,res) => {
  try {
    const  id = req.params.id;
    const result = await Ticket.aggregate([
      { $match: { event: new mongoose.Types.ObjectId(id), } },
      {$lookup: {
        from: "users",
        localField:"owner",
        foreignField:"_id",
        as: "UserDetails"},},
        {$unwind:"$UserDetails",},
        { $match: { "UserDetails.location": { $nin: [null, ""] } } },
      {$group : {
        _id:"$UserDetails.location",
        total: {$sum:1}}},
    ]);
    res.status(200).json(result);
  }catch(err){res.status(500).json({message:"Couldn't fetch attendees locations",err})}
}




const AttendeesInterests = async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      { $unwind: "$eventDetails" },
      { $match: { "eventDetails.status": "Pending" } },
      {
        $group: {
          _id: "$eventDetails.title",
          total: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          events: { $push: { eventName: "$_id", total: "$total" } },
          totalTickets: { $sum: "$total" },
        },
      },
      { $unwind: "$events" },
      {
        $project: {
          _id: 0,
          eventName: "$events.eventName",
          percentage: {
            $round: [
              { $multiply: [{ $divide: ["$events.total", "$totalTickets"] }, 100] },
              2,
            ],
          },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Couldn't fetch pending events percentage",
      error: err,
    });
  }
};
const Notifications = async (req, res) => {
const latestEvent = await Event.findOne().sort({ createdAt: -1 });
  res.json(latestEvent);
}

module.exports = { createEvent, eventList, bookEvent, deleteEvent, updateEvent,eventDetails,adminDashboard,genderChart,ageRanges,agePieChart,locationsBarChart,eventlocationBarChart,AttendeesInterests, EventgenderChart,Notifications};
