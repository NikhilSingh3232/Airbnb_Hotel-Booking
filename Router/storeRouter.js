// Core Modules
const path = require('path');

// External Module
const express = require('express');
const storeRouter = express.Router();

// Local Module
const storeController=require('../controller/storeController')

storeRouter.get("/",storeController.getIndex);
storeRouter.get("/home",storeController.getHome);
storeRouter.get("/favourites",storeController.getFavouritesList);
storeRouter.get("/homes/:homeId",storeController.getHomeDetails);
storeRouter.post("/favourites",storeController.postAtFavourites);
storeRouter.post('/favourites/delete/:homeId',storeController.postRemoveFromFavourite);

module.exports = storeRouter;