const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routerRessource=require("./controllers/ressourceRoute")
const Project=require("./controllers/projetRoute")
const Tache=require("./controllers/tacheRoute");

const app = express();

//Midlwears
app.use(cors({ origin: "http://localhost:5173/", credentials: true }));
app.use(express.json());
app.use("/ressource",routerRessource)
app.use("/project",Project)
app.use("/tache",Tache)
// Routes
mongoose.connect('mongodb://127.0.0.1:27017/GestionProjet')
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" Failed to connect to MongoDB:", err.message));

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});

