const mongoose = require("mongoose")

const TacheSchema = new mongoose.Schema({
    description :{ 
        type :String , 
        required:true
    },

    dateDebut: 
    { 
        type:Date ,
        required:true
    },
    dateFin: { 
        type:Date , 
        required:true
    },
    Idresource:{
    type:mongoose.Types.ObjectId,
    ref:'Ressource'
    }
} )
const Data=mongoose.model("Tache",TacheSchema);

module.exports=Data
 