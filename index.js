// Import required modules
require('dotenv').config()
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose=require('mongoose')
const cors=require('cors')
const authrouter=require('./controllers/AuthCtrl')
const {router,Socket}=require('./Routes')

// Initialize Express.js app and create server
const app = express();
const server = http.createServer(app);

//Connecting Database
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true})
.then(res=>console.log("Database connected")).catch(err=>console.log(err))

// Initialize Socket.IO server
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND 
  }
});

// Apply Middlewares
app.use(cors())
app.use(express.json())
app.use('/api/uploads',express.static('./uploads'))

// Define a route for the REST API
app.use("/api",router);
app.use("/api",authrouter);

// Define a WebSocket connection handler
io.on('connection', (socket) => {
  console.log('WebSocket client connected');
  Socket(socket)
});




// Start the server and listen for incoming requests
const PORT = process.env.PORT || 2000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


