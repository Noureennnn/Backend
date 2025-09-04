const generateSeats = (rows,seatsPerRow) =>{
            let seats = [];
            const alphabet = "ABCDEFGHIJKLMNOPQRS";
            for(let r=0;r<rows;r++){
                for(let s=1;s<=seatsPerRow;s++){
                    seats.push({
                        seatNumber:`${alphabet[r]}${s}`,
                        isBooked: false,
                        bookedBy:null});
                }
            }
            return seats;
        }
module.exports = generateSeats;
