
const moment = require('moment')
const awaitWrap = require('../helpers/awaitWrap')
const Booking = require('../model/bookings')

const findBooking = async (roomID) => {
  const [err, bookingData] = await awaitWrap(
    Booking.find({ roomID: roomID }, { "startDate": 1, "endDate": 1 }).exec()
  )
  const x = bookingData.map(ele => ele.toObject())
  let date = moment(x[0]['startDate']).
    console.log(x[0]['startDate'])
}

findBooking('6301fa03d675234c8daec2c6')