const mongoose = require('mongoose')
const dotenv = require("dotenv")
const path = require('path')
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const schemaOptions = {
  toObject: {
    getters: true,
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  },
  toJSON: {
    getters: true,
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  },
  runSettersOnQuery: true,
};



const amenitySchema = new mongoose.Schema({
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
})

const checkInAndOutSchema = new mongoose.Schema({
  "checkInEarly": String,
  "checkInLate": String,
  "checkOut": String
})

const descriptionShortSchema = new mongoose.Schema({
  "GuestMin": Number,
  "GuestMax": Number,
  "Bed": [String],
  "Private-Bath": Number,
  "Footage": Number
})

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
  "descriptionShort": descriptionShortSchema,
  "description": String,
  "checkInAndOut": checkInAndOutSchema,
  "amenities": amenitySchema,
}, { strictQuery: false, ...schemaOptions })

const dbPath = process.env['DB_PATH']
  .replace('<password>', process.env['PASSWORD'])
  .replace('<db>', 'hotel')

mongoose.connect(
  dbPath,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log(" Mongoose is connected")
)

const Room = mongoose.model('Room', roomSchema);

module.exports = Room