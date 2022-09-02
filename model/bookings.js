const mongoose = require('mongoose')
const moment = require('moment-timezone');
const dotenv = require("dotenv")
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })



const DEFAULT_TIME_ZONE = 'Asia/Taipei';
const DEFAULT_FORMAT_DATE_TIME = 'YYYY-MM-DD';


//schema _id變id 設定getter
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

//日期format getter
const formatDateTime = (date) => {
  return moment.tz(date, DEFAULT_TIME_ZONE).format(DEFAULT_FORMAT_DATE_TIME)
}


const bookingSchema = new mongoose.Schema({

  "name": {
    type: String,
    required: true
  },
  "roomID": {
    type: String,
    required: true
  },
  "tel": {
    type: String,
    required: true,
  },

  "startDate": {
    type: Date,
    required: true,
    get: formatDateTime,
  },
  "endDate": {
    type: Date,
    required: true,
    get: formatDateTime,

  },

  "date": [{
    type: Date,
    required: true,
    get: formatDateTime,
  }],

  "createdAt": {
    type: Date,
    default: Date.now,
    select: false,
    get: formatDateTime, //find的時候不顯示
  }

}, { strictQuery: false, ...schemaOptions })


const dbPath = process.env['DB_PATH']
  .replace('<password>', process.env['PASSWORD'])
  .replace('<db>', 'hotel')

mongoose.connect(
  dbPath,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log(" Mongoose is connected")
)

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking