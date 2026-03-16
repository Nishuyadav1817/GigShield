const mongoose=require("mongoose");
const {Schema}=mongoose;

const Worker=new Schema({
      FirstName:{
        type:String,
         required:true,
        minLength:3,
        maxLength:30
       } ,
       LastName:{
        type:String,
       // required:true,
        minLength:3,
        maxLength:30
       },

       EmailId:{
         type:String,
          required:true,
          unique:true,
         trim:true,
        lowercase:true,
        immutable:true
       },
       Age:{
        type:Number,
        max:60,
        min:12,
       
       },
       password:{
        type:String,
        required:true
      
       },

    platform:{
    type:String,
    //required:true,
    minLength:3,
    maxLength:30
    },

    Typeofwork:{
    type:String,
    // required:true,
    minLength:3,
    maxLength:30
    }

      
       
})

const Work=mongoose.model("Employee",Worker);
module.exports =Work;
