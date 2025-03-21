const express = require("express");
const Tache = require("../models/tache"); // Correction du modèle
const router = express.Router(); // Nom plus clair pour le routeur

// 📌 Route GET → Récupérer toutes les tâches
router.get("/", async (req, res) => {
    try {
        const taches = await Tache.find();
        res.status(200).json(taches);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l'affichage des tâches", erreur: err.message });
    }
});

// Route POST 
router.post("/ajouter", async (req, res) => {
    try {
        const { description, dateDebut, dateFin } = req.body;
        const nouvelleTache = new Tache({ description:description, dateDebut:dateDebut, dateFin:dateFin });

        await nouvelleTache.save();
        res.status(201).json({ message: "Tâche ajoutée avec succès", tache: nouvelleTache });
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout de la tâche", erreur: err.message });
    }
});

// Route PUT 
router.put("/:id", async (req, res) => {
    try {
        const { description,dateDebut,dateFin} = req.body;
        const tache = await Tache.findByIdAndUpdate(req.params.id, { description, dateDebut, dateFin }, { new: true });

        if (!tache) return res.status(404).json({ message: "Tâche non trouvée" });
        res.status(200).json({ message: "Tâche modifiée avec succès", tache });
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de la modification de la tâche", erreur: err.message });
    }
});

// Route DELETE 
router.delete("/:id", async (req, res) => {
    try {
        const tache = await Tache.findByIdAndDelete(req.params.id);
        if (!tache) return res.status(404).json({ message: "Tâche non trouvée" });

        res.status(200).json({ message: "Tâche supprimée avec succès" });
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de la suppression de la tâche", erreur: err.message });
    }
});

module.exports = router;
