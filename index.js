const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
const ejs = require('ejs');
const app = express();
const port = 3030;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from a 'public' directory (create this directory and put your CSS and JS files there)
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
//database connection
mongoose.connect("mongodb+srv://abhishek24:Abhishek20@abh.sr77f7j.mongodb.net/details?retryWrites=true&w=majority").then(()=>{
  console.log("connected")}
)
// Define a route for the root path that renders the form


// database schema
const userSchema = new mongoose.Schema({
  username:String,
  email:String,
  password:String
})


///function to upload data to db when regesters

const user = mongoose.model("userdetail",userSchema)
const uploadtodb = async (req,res)=>{

await user.create({ 
username:req.body["username"],
email:req.body["email"],
password:req.body["password"] })
}
//function to chreck and authenticate login data
const loginauth =async (res,username,password)=>{
  const result = await user.exists({username:username,password:password})
  if(result){
    res.redirect("/home")
  }
  else{
    res.redirect("/login")
  }
}




app.get('/', (req, res) => {
  res.render('login.ejs');
});
app.get('/home', (req, res) => {
  res.render('index.ejs');
});


app.get("/regester",(req,res)=>{
  res.render("reg.ejs");
});
app.get("/login",(req,res)=>{
  res.render("login.ejs");
})


// Handle the POST request for data submission for login
app.post("/login/auth",(req,res)=>{
  const user = req.body["username"];
  const pass= req.body["password"];
  loginauth(res,user,pass)
 
});

// Handle the POST request for data submission for registration
app.post("/regester/reg",(req,res)=>{
  uploadtodb(req,res)
  res.redirect("/login");
});

// Handle the POST request for data submission
app.post('/dataobtain', async (req, res) => {
    const instagramUsername = req.body.instagramUsername;
    const youtubeChannelId = req.body.youtubeChannelId;
  
    try {
      // Fetch data from Instagram API
      const instagramResponse = await axios.get(`https://abhishekw1w21.pythonanywhere.com/instadata?username=${instagramUsername}`);
      const instagramData = instagramResponse.data;
  
      // Fetch data from YouTube API
      const youtubeResponse = await axios.get(`https://yotube-api-5fmc.onrender.com/channelData/${youtubeChannelId}`);
      const youtubeData = youtubeResponse.data;
  
      // Set .locals to make data available to the EJS template
      res.locals.instagramData = instagramData;
      res.locals.youtubeData = youtubeData;
  
      // Render the EJS template with the fetched data
      res.render('index.ejs');
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = app;