const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
var cors = require("cors");
const mongodb = require("mongodb");
const req = require("express/lib/request");
const mongoClient = mongodb.MongoClient;
const dburl =
  "mongodb+srv://admin:pranaya123@cluster0.swxw9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
app.use(express.json());
app.use(cors());
app.set("view engine","ejs");
app.use(express.static("./public"));

var corsOptions = {
  origin: "http://127.0.0.1:8081",
  optionsSuccessStatus: 200,
};
app.use(express.static("./public"));
app.listen(8081);

app.get("/Signup",(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/Signup.html'));
});

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/login.html'));
});

app.get("/home",(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/home.html'));
});

// Saving user details in db

app.post("/Signup",async(req,res, next)=>{
  const client = await mongoClient.connect(dburl);
  try {
    const db = await client.db("MyDatabase");
    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(req.body.password,salt);
    req.body.password = hashed_password;
    const user = await db.collection("users").insertOne(req.body);
    res.json({ message: "user added", user });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
  console.log(req.body);
});

// 
app.post("/login",   async(req,res,next)=>{
  const client = await mongoClient.connect(dburl);
  try {
    const db = await client.db("MyDatabase");
    const user = await db.collection("users").findOne({username:req.body.username});
    if(user==null){
      res.status(404).send("User not found");
    }
    else{
       const matched = await bcrypt.compare(req.body.password, user.password); 
       if(matched){
         res.status(200).send('user found')
         const count = user.login_count;
         await db.collection("users").updateOne({username:req.body.username}, {$set:{login_count:count+1}})
       }
       else{
        res.status(403).send("Incorrect password");
       }
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }

  
});
//  Retrieving the data from db
app.get("/show-feedbacks", async (req, res, next) => {
    const client = await mongoClient.connect(dburl);
    try {
      const db = await client.db("MyDatabase");
      const users = await db.collection("MP3").find().toArray();
      res.render("displayfeedback",{users:users});
    } catch (error) {
      console.log(error);
    } finally {
      client.close();
    }

  });
  // Storing the feedback into Db
  app.post("/user/feedback", cors(corsOptions), async (req, res) => {
    const client = await mongoClient.connect(dburl);
    try {
      const db = await client.db("MyDatabase");
      const user = await db.collection("MP3").insertOne(req.body);
      res.json({ message: "feedback added", user });
    } catch (error) {
      console.log(error);
    } finally {
      client.close();
    }
    console.log(req.body);
  });
  // app.all("*", (req, res) => {
  //   res.sendStatus(404).send("Not Found");
  // });
  

