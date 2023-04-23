const router = require("express").Router()
const {createBusiness,getBusinesses,getBusinessById,updateBusinessById,deleteBusinessById} = require('./controllers/BusinessCtrl');
const { searchQuestions, createQuestion, updateQuestion } = require("./controllers/CommunityCtrl");
const { createNewsletter, getAllNewsletters, getNewsletterById } = require("./controllers/NewsletterCtrl");
const AuthenticateUser = require("./middlewares/AuthenticateUser");
const Upload =require("./middlewares/Upload")
router.get('/', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

//Businesses/Posts Routes
router.post("/createpost", AuthenticateUser,Upload.array("images"),createBusiness)
router.get("/getposts",getBusinesses)
router.get("/getpost/:id",getBusinessById)

//Newsletter Routes
router.post("/createnews", AuthenticateUser,Upload.array("images"),createNewsletter)
router.get("/getnews",getAllNewsletters)
router.get("/getnews/:id",getNewsletterById)

//Community Routes
router.post("/question",AuthenticateUser,Upload.array("images"),createQuestion)
router.put("/question/:id",AuthenticateUser,updateQuestion)
router.get("/question",searchQuestions)



const Socket = (socket) => {

    // Handle incoming messages from the WebSocket client
    socket.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Echo the message back to the client
        socket.emit('message', `You sent: ${message}`);
    });
    // Handle WebSocket client disconnections
    socket.on('disconnect', () => {
        console.log('WebSocket client disconnected');
    });
}


module.exports = { Socket, router }