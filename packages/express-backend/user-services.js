import mongoose from "mongoose";
import userModel from "./user.js";


const uri = "mongodb+srv://ozcarC:KRp5T0thDUAfVYGW@cluster0.ssyyubv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.set("debug", true);

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "users"
  })
  .catch((error) => console.log(error));

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  }
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
};