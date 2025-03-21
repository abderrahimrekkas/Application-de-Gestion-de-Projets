const express = require("express");
const Projet = require("../models/projet")
const route = express.Router();
const Joi = require("joi");

// Schéma de validation avec Joi
const validate = (data) => {
  const schema = Joi.object({
    nom: Joi.string().required().messages({
      "string.empty": ("Le Nom est requis"),
    }),
    description: Joi.string().required().messages({
      "string.empty": ("La description est requise"),
    }),
    dateDebut: Joi.date().required().messages({
      "date.base": ("La date de début doit être une date valide"),
      "any.required": ("La date de début est requise"),
    }),
    dateFin: Joi.date().required().greater(Joi.ref('dateDebut')).messages({
      "date.base": ("La date de fin doit etre une date valide"),
      "any.required": ("La date de fin est requise"),
      "date.greater": ("La date de fin doit suivre la date de debut"),
    }),
    budget: Joi.number().positive().required().messages({
      "number.base": ("Le budget doit être un nombre"),
      "number.positive": ("Le budget doit être positif"),
      "any.required": ("Le budget est requis"),
    }),
  });

  return schema.validate(data, { abortEarly: false }); //  afficher toute les erreurs
};
route.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    try {
        const newProjet = new Projet({
            nom: req.body.nom,
            description: req.body.description,
            dateDebut: req.body.dateDebut,
            dateFin: req.body.dateFin,
            budget: req.body.budget
        });
        
        await newProjet.save();
 
      } catch (error) {
        console.error("Erreur dans l ajout du Projet:", error);
        res.status(500).json({ error: error.message });
    }
});





route.get("/Afficher" , async(req,res)=>{
   try {
     const projet= await Projet.find() ;
     res.status(200).json(projet)
   } catch (error) {
    console.error("Error de l affichage",error);
    res.status(500).json({error:error.message})
   }
})
route.delete("/Supprimer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const projet = await Projet.deleteOne({ _id: id });

    if (projet.deletedCount === 0) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    res.status(200).json({ message: "Projet supprimé", projet });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ error: error.message });
  }
});
  
module.exports = route;