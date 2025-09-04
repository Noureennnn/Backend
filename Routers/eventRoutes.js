const {createEvent,eventList,deleteEvent,updateEvent,bookEvent,eventDetails,adminDashboard,genderChart,ageRanges,agePieChart,locationsBarChart,eventlocationBarChart,AttendeesInterests,EventgenderChart,Notifications} = require("../Controllers/eventController");
const { adminOnly,protect } = require("../Middleware/authMiddleware");
const {createTicket} = require("../Controllers/ticketController");
const router = require("express").Router();

router.post("/create",protect,adminOnly,createEvent)
router.get("/all-events",protect,eventList);
router.post("/:id/book",protect,bookEvent);
router.delete("/:id/delete",protect,adminOnly,deleteEvent);
router.put("/:id/update",protect,adminOnly,updateEvent);
router.get("/dashboard",protect,adminOnly,adminDashboard);
router.get("/:id/EventDetails",protect,eventDetails);
router.get("/admingenderChart",protect,adminOnly,genderChart);
router.get("/:id/ageRangeChart",protect,adminOnly,ageRanges);
router.get("/agePieChart",protect,adminOnly,agePieChart);
router.get("/locationsBarChart",protect,adminOnly,locationsBarChart);
router.get("/:id/eventLocationsBarChart",protect,adminOnly,eventlocationBarChart);
router.get("/AttendeesInterests",protect,adminOnly,AttendeesInterests);
router.get("/:id/EventGenderChart",protect,adminOnly,EventgenderChart);
router.get("/latest", Notifications);




module.exports = router;
