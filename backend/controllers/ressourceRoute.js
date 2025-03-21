const express = require("express");
const Controller = express.Router();
const Ressource = require("../models/ressource");

// Route GET 
Controller.get("/", async (req, res) => {
    try {
        const data = await Ressource.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des données", error });
    }
});

//  Route POST 
Controller.post("/", async (req, res) => {
    try {
        const { nom, description, dateDebut, dateFin } = req.body;
        const nouvelleRessource = new Ressource({ nom, description, dateDebut, dateFin });

        await nouvelleRessource.save();
        res.status(201).json({ message: "Ressource ajoutée avec succes", nouvelleRessource });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la ressource", error });
    }
});

// Route PUT 
Controller.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { nom, description, dateDebut, dateFin } = req.body;

        const updatedRessource = await Ressource.findByIdAndUpdate(id, { nom, description, dateDebut, dateFin }, { new: true });

        if (!updatedRessource) {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

        res.status(200).json({ message: "Ressource mise à jour avec succes", updatedRessource });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise a jour", error });
    }
});

// Route DELETE 
Controller.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedRessource = await Ressource.findByIdAndDelete(id);

        if (!deletedRessource) {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

        res.status(200).json({ message: "Ressource supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
});

module.exports = Controller;
