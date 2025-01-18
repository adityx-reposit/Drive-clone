const mongoose = require('mongoose');

function connectToDb(){
    mongoose.connect(process.env.Mongo_uri).then(()=>{
        console.log("connected to DB");
        
    })
}

module.exports=connectToDb;