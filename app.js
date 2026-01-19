const express =require('express');
const app = express();
require("dotenv").config();
const URI=process.env.MONGO_URI;

const authRoute = require('./route/authRoute');
const customerRoute = require('./route/customerRoute');
const adminRoute = require('./route/adminRoute');
const technicianRoute = require('./route/technicianRoute');
const receptionistRoute = require('./route/receptionistRoute');
const notificationRoute = require('./route/notificationRoute');

const {connectdb} = require('./dbConfig/dbConfig');
connectdb(URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',authRoute);
app.use('/api/customer',customerRoute);
app.use('/api/technician',technicianRoute);
app.use('/api/admin',adminRoute);
app.use('/api/receptionist',receptionistRoute);
app.use('/api/notifications',notificationRoute);

app.listen(5455,()=>{
    console.log("server is running on port 5455");
}) 