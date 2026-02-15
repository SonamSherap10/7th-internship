const express =require('express');
const app = express();
require("dotenv").config();
const URI=process.env.MONGO_URI;
const cors = require('cors');
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const authRoute = require('./route/authRoute');
const customerRoute = require('./route/customerRoute');
const adminRoute = require('./route/adminRoute');
const technicianRoute = require('./route/technicianRoute');
const receptionistRoute = require('./route/receptionistRoute');
const notificationRoute = require('./route/notificationRoute');
const notesRoute = require('./route/notesRoute');

const {connectdb} = require('./dbConfig/dbConfig');
connectdb(URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',authRoute);
app.use('/api/customer',customerRoute);
app.use('/api/technician',technicianRoute);
app.use('/api/admin',adminRoute);
app.use('/api/receptionist',receptionistRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/notes', notesRoute);

app.listen(5455,()=>{
    console.log("server is running on port 5455");
}) 