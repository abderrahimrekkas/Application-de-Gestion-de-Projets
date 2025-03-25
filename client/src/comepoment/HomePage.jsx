import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const HomePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [project, setProject] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    budget: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/projets/Afficher')
      .then((response) => setProjects(response.data))
      .catch((error) =>
        console.error('Erreur lors du chargement des projets:', error)
      );
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    setErrorMessage("");
    setIsEditing(false);
    setProject({
      nom: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      budget: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (isEditing) {
        const response = await axios.put(`http://localhost:8080/api/projets/Modifier/${selectedProject._id}`, project);
        setProjects((prevProjects) =>
          prevProjects.map((proj) => (proj._id === selectedProject._id ? response.data : proj))
        );
        toast.success('Projet modifié avec succès !');
      } else {
        const response = await axios.post('http://localhost:8080/api/projets/Ajouter', project);
        setProjects([...projects, response.data]);
        toast.success('Projet ajouté avec succès !');
      }
      setShowForm(false);
    } catch (error) {
      setErrorMessage(error.response?.data.message || "Une erreur s'est produite lors de l'ajout/modification du projet.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/projets/Supprimer/${id}`);
        if (response.status === 200) {
          setProjects((prevProjects) => prevProjects.filter((project) => project._id !== id));
          toast.success('Projet supprimé avec succès !');
        }
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsEditing(true);
    setShowForm(true);
    setProject({
      nom: project.nom,
      description: project.description,
      dateDebut: project.dateDebut,
      dateFin: project.dateFin,
      budget: project.budget
    });
  };

  const handleViewTasks = (projectId) => {
    navigate(`/project/${projectId}/tasks`); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-100 p-6">
      <Toaster />
      <div className="max-w-8xl mx-auto bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Gestion de Projets</h1>
        <div className="grid place-items-center">
  <button
    onClick={toggleForm}
    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 shadow-lg hover:shadow-xl"
  >
    {isEditing ? "Modifier le projet" : "Ajouter un projet"}
  </button>
</div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded-lg shadow-md">
            {errorMessage && (
              <div className="text-red-500 bg-red-100 p-3 rounded-md">
                {errorMessage}
              </div>
            )}
            <input type="text" placeholder="Nom du projet" value={project.nom} onChange={(e) => setProject({ ...project, nom: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="Description du projet" value={project.description} onChange={(e) => setProject({ ...project, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"></textarea>
            <input type="date" value={project.dateDebut} onChange={(e) => setProject({ ...project, dateDebut: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
            <input type="date" value={project.dateFin} onChange={(e) => setProject({ ...project, dateFin: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
            <input type="number" placeholder="Budget" value={project.budget} onChange={(e) => setProject({ ...project, budget: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">{isEditing ? "Modifier le projet" : "Ajouter le projet"}</button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">{project.nom}</h2>
              <p className="mt-2 text-gray-700 leading-relaxed text-base overflow-hidden overflow-ellipsis">{project.description}</p>
              <p className="text-sm text-gray-600 mt-3 font-medium">
                <span className="font-semibold">Début:</span> {project.dateDebut} <br />
                <span className="font-semibold">Fin:</span> {project.dateFin}
              </p>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                <span className="font-semibold">Budget:</span> {project.budget} DH
              </p>
              <div className="mt-6 flex space-x-3">
              <div className="mt-6 flex space-x-3">
  {/* Bouton Modifier */}
  <button 
    onClick={() => handleEdit(project)} 
    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
    Modifier
  </button>

  {/* Bouton Supprimer */}
  <button 
    onClick={() => handleDelete(project._id)} 
    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
    Supprimer
  </button>

  {/* Bouton Voir les tâches */}
  <button 
    onClick={() => handleViewTasks(project._id)} 
    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    Tâches
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;