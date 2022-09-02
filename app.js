const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const roomRouter = require('./routes/room');
const roomsRouter = require('./routes/rooms');


const app = express();
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/room', roomRouter);
app.use('/rooms', roomsRouter);

module.exports = app;
