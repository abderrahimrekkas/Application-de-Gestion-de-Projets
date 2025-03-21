const mongoose = require("mongoose");

const RessourceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true }
});

// Correction du nom du modèle
const Ressource = mongoose.model('Ressource', RessourceSchema);

module.exports = Ressource;
