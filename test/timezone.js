moment = require('moment-timezone');
import 'moment-timezone';
const time = moment('2022-09-06T16:00:00.000+00:00')
x = time.tz("Asia/Jakarta").format("YYYY/MM/DD HH:mm")
y = new Date(x)
y

z = new Date(2022, 08, 01, 11, 58)
z