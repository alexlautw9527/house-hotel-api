const Room = require('../model/rooms')
const Booking = require('../model/bookings')

const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
  const roomData = await Room.find({}, {
    "id": 1,
    //選第一張照片
    "imageUrl": { $slice: 1 },
    "normalDayPrice": 1,
    "holidayPrice": 1,
    "name": 1,
  })

  console.log(roomData)
  let roomDataJSON = roomData.map(ele => {
    let obj = ele.toObject()
    return { ...obj, imageUrl: obj['imageUrl'][0] }
  })
  res.status(200).json({
    success: true,
    items: roomDataJSON
  })
});


router.delete('/', async function (req, res, next) {
  const roomData = await Booking.deleteMany({})
  res.status(200).json({
    success: true,
  })
})


module.exports = router;
