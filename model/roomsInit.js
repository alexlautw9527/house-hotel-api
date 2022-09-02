const mongoose = require('mongoose')
const dotenv = require("dotenv")
const path = require('path')
const fs = require('fs');


dotenv.config({ path: path.resolve(__dirname, '..', '.env') })


const initRoomJSON = fs.readFileSync(path.resolve(__dirname, "roomsData.json"));
const initRoomArr = JSON.parse(initRoomJSON)["data"];

const roomSchema = new mongoose.Schema({
  "name": {
    type: String,
    required: true
  },
  "imageUrl": [String],
  "normalDayPrice": {
    type: Number,
    required: true
  },
  "holidayPrice": {
    type: Number,
    required: true
  },
  "descriptionShort": {
    "GuestMin": Number,
    "GuestMax": Number,
    "Bed": [String],
    "Private-Bath": Number,
    "Footage": Number
  },
  "description": String,
  "checkInAndOut": {
    "checkInEarly": String,
    "checkInLate": String,
    "checkOut": String
  },
  "amenities": {
    "Wi-Fi": { type: Boolean, required: true, default: false },
    "Breakfast": { type: Boolean, required: true, default: false },
    "Mini-Bar": { type: Boolean, required: true, default: false },
    "Room-Service": { type: Boolean, required: true, default: false },
    "Television": { type: Boolean, required: true, default: false },
    "Air-Conditioner": { type: Boolean, required: true, default: false },
    "Refrigerator": { type: Boolean, required: true, default: false },
    "Sofa": { type: Boolean, required: true, default: false },
    "Great-View": { type: Boolean, required: true, default: false },
    "Smoke-Free": { type: Boolean, required: true, default: false },
    "Child-Friendly": { type: Boolean, required: true, default: false },
    "Pet-Friendly": { type: Boolean, required: true, default: false },
  },
})


const dbPath = process.env['DB_PATH']
  .replace('<password>', process.env['PASSWORD'])
  .replace('<db>', 'hotel')

mongoose.connect(
  dbPath,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log(" Mongoose is connected")
)

const Room = mongoose.model('Room', roomSchema);

Room.deleteMany({})
  .then(e => { console.log(e) })
  .catch(err => { console.log(err) })

Room.insertMany(initRoomArr)
  .then(() => {
    console.log("新增資料成功")
  })
  .catch(error => {
    console.log(error)
  })