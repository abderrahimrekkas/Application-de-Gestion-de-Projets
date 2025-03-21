const mongoose = require('mongoose');
const Joi =require('joi')
const projetSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  budget: { type: Number, required: true },
  iDtache:{
    type:mongoose.Types.ObjectId,
    ref:'Tache'
  }
});

//   validation avec Joi (Schema)
const validate = (data) => {
  const schema = Joi.object({
    nom: Joi.string().required().messages(
     ("Le Nom est requis"),
    ),
    description: Joi.string().required().messages(
     ("La description est requise"),
    ),
    budget: Joi.number().positive().required().messages({
        "number.base":  ("Le budget est un nombre"),
        "number.positive": ("Le budget est positif"),
        "any.required": ( "Le budget est requis"),
      }),
    dateDebut: Joi.date().required().messages(
      ("La date de debut est valide"),
    ),
    dateFin: Joi.date().required().greater(Joi.ref('dateDebut')).messages({
      "date.base":("La date de fin est valide"),
      "any.required":("La date de fin est requise"),
      "date.greater":( "La date de fin doit suivre la date de debut"),
    }),
    
  });

  return schema.validate(data, { abortEarly: false });
};
const Projet = mongoose.model('Projet', projetSchema);
module.exports = Projet ,validate;