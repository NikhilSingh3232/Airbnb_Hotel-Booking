const mongoose=require('mongoose');

const homeSchema=mongoose.Schema({
  houseName:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  location:{
    type:String,
    required:true
  },
  rating:{
    type:String,
    required:true
  },
  photo: String,
  description: String,
})


// homeSchema.pre('findOneAndDelete', async function (next) {
//   console.log("came to pre hook while come to delete home");
//   const homeId = this.getQuery()._id;
//   await favourite.deleteMany({ houseId: homeId }); 
//   next();
// });



module.exports=mongoose.model('Home',homeSchema);

