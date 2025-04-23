// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;


const idGen = () => {
  return Math.random().toString(36).substring(5);
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
  
  const id = req.params["id"];
  userServices.findUserById(id)
  .then((result)=>{
    if (!result){
      res.status(404).send("Resource not found.");
    }
    else{
      res.send(result);
    }
  })
  .catch(()=>console.log(`An error occured when searching for user with ID: ${id}`));
});

app.delete("/users/:id",(req,res)=>{
  const id = req.params["id"];
  userServices.deleteUserById(id)
  .then((deletedUser)=>{
    if(!deletedUser){
      res.status(404).send(`No user with id ${id} exists`);
    }
    else{
      res.status(204).send();
    }
  })
  .catch(()=>{
    console.log("Error deleting user");
    res.status(500).send("Internal Server Error");
  });
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  userServices.getUsers(name,job)
  .then((result)=> res.send({users_list: result}))
  .catch(()=>{
    console.log("An error occured when searching for users");
    res.status(500).send("Internal Server Error");
  });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd["id"] = idGen();
  if (Object.values(req.body).some(value=> value === ""|| value === null || value === undefined)){
    res.status(400).send("Some field was empty, all fields are required");
  }
  else{
    userServices.addUser(userToAdd)
    .then((savedUser)=>res.status(201).send(savedUser))
    .catch(()=>{
      console.log("An error occured when adding user");
      res.status(500).send("Internal Server Error");
    });
  }
});


app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});