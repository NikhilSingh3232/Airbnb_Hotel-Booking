
// Core Module
const path = require('path');

// External Module
const express = require('express');
const hostRouter = express.Router();

// Local Module
const hostController=require('../controller/hostController')

//Routes
hostRouter.get("/add-home",hostController.getAddHome);
hostRouter.post("/add-home",hostController.postAddHome);
hostRouter.get("/host-home-lists", hostController.getHostHomes);
hostRouter.get('/edit-home/:homeId', hostController.getEditHome);
hostRouter.post('/edit-home',hostController.postEditHome);
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);


module.exports = hostRouter;
