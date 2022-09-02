
const express = require('express');
const moment = require('moment-timezone');
const awaitWrap = require('../helpers/awaitWrap')

const Room = require('../model/rooms')
const Booking = require('../model/bookings')

const router = express.Router();




router.get('/:roomID', async function (req, res, next) {
  const roomID = req.params.roomID

  const getRoomData = async (roomID) => {
    const [err, roomData] = await awaitWrap(Room.findById(roomID).exec())
    return err ? null : roomData
  }

  const getBookingData = async (roomID) => {
    const [err, bookingData] = await awaitWrap(Booking.find({ roomID: roomID }).exec())
    return err ? null : (
      bookingData.length > 0 ? bookingData : null
    )
  }

  const roomData = await getRoomData(roomID)
  const bookingData = await getBookingData(roomID)

  if ([roomData, bookingData].every(element => element === null)) {
    res.status(400).json({
      success: false,
      message: "Both rooms and bookings are not available for this ID",
    })
  } else {
    res.status(200).json({
      success: true,
      room: [roomData === null ? [] : roomData],
      booking: bookingData === null ? [] : bookingData
    })
  }

});



router.post('/:roomID', async function (req, res, next) {
  const roomID = req.params.roomID
  const reqJSON = req.body
  console.log(JSON.stringify(reqJSON))

  const checkIsJSONComplete = (reqJSON) => {
    const checkArr = ["name", "tel", "startDate", "endDate"].map(ele => reqJSON.hasOwnProperty(ele))
    return checkArr.every(Boolean)
  }

  const checkRoomIDAvailable = async (roomID) => {
    const [err, roomData] = await awaitWrap(Room.findById(roomID).exec())
    return err ? false : (
      roomData === null ? false : true
    )
  }

  const checkIsDateAvailable = async (queryStartDate, queryEndDate, roomID) => {

    //strict parser

    queryStartDate = moment.tz(queryStartDate, 'Asia/Taipei')
    queryEndDate = moment.tz(queryEndDate, 'Asia/Taipei')

    if (!queryStartDate.isValid() || !queryEndDate.isValid()) {
      return { success: false, message: "日期格式錯誤" }
    }

    // queryStartDate = queryStartDate.toDate()
    // queryEndDate = queryEndDate.toDate()

    const startDateBoundary = moment().tz("Asia/Taipei").startOf('day').add(1, 'days')
    const endDateBoundary = moment().tz("Asia/Taipei").startOf('day').add(90, 'days')

    if (queryStartDate >= queryEndDate) {
      return { success: false, message: "退房日期需大於入住日期" }
    }

    if (queryStartDate <= startDateBoundary || queryEndDate >= endDateBoundary) {
      return { success: false, message: "日期範圍錯誤" }
    }

    const [err, bookingData] = await awaitWrap(
      Booking
        .find(
          { "startDate": { "$lt": queryEndDate }, "endDate": { "$gt": queryStartDate }, "roomID": roomID })
        .exec()
    )

    console.log(bookingData)
    console.log(queryStartDate, queryEndDate)
    return err ? { success: false, message: "資料庫查詢異常" } : (
      bookingData.length > 0 ? { success: false, message: "此日期區間已無空房" } : { success: true, message: "成功" }
    )
  }

  const insertBooking = async (reqJSON, roomID) => {
    let { name, tel, startDate, endDate } = reqJSON

    startDate = moment.tz(startDate, 'Asia/Taipei')
    endDate = moment.tz(endDate, 'Asia/Taipei')


    function getDateBetween(startDate, endDate) {
      startDate = moment(startDate)
      endDate = moment(endDate)
      let date = [];
      for (let m = startDate; m.isBefore(endDate); m.add(1, 'days')) {
        date.push(m.toDate());
      }
      return date
    }

    const date = getDateBetween(startDate, endDate)


    const [err, bookingRes] = await awaitWrap(
      Booking
        .create({
          name,
          tel,
          roomID,
          startDate,
          endDate,
          date
        })
    )

    return [err, bookingRes]
  }



  const isRoomIDAvailable = await checkRoomIDAvailable(roomID)
  const isDateAvailable = await checkIsDateAvailable(reqJSON['startDate'], reqJSON['endDate'], roomID)

  /*
    1. 檢查roomID有沒有此房間, 若無則400
    2. 檢查body json屬性是否完整, 若無則400
    3. 檢查起迄日
  */

  if (!isRoomIDAvailable) {
    res.status(400).json({
      "success": false,
      "message": "查無此房型"
    })
  } else if (!checkIsJSONComplete(reqJSON)) {
    res.status(400).json({
      "success": false,
      "message": "JSON欄位不完整"
    })
  } else if (!isDateAvailable['success']) {
    res.status(400).json({
      "success": false,
      "message": isDateAvailable['message']
    })
  } else {
    console.log('ok')
    const [err, bookingRes] = await insertBooking(reqJSON, roomID)

    if (bookingRes) {
      res.redirect(`${req.baseUrl}/${roomID}`)
    } else {
      res.status(400).json({
        success: false,
        message: '訂房失敗'
      })
    }


  }
})



module.exports = router;
