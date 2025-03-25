import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const TaskResourcesPage = () => {
  const { taskId } = useParams(); // Récupérer l'ID de la tâche depuis l'URL
  const [resources, setResources] = useState([]); // Liste des ressources
  const [newResource, setNewResource] = useState({
    nom: '',
    type: '',
    quantite: '',
  }); // État pour le formulaire
  const navigate = useNavigate();

  // Charger les ressources
  useEffect(() => {
    fetchResources();
  }, [taskId]);

  // Fonction pour charger les ressources
  const fetchResources = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/tache/${taskId}/ressources`);
      setResources(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des ressources:', error);
    }
  };

  // Gérer la soumission du formulaire
  const handleAddResource = async (e) => {
    e.preventDefault(); 

    if (!newResource.nom || !newResource.type || !newResource.quantite) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/tasks/tache/${taskId}/ressources`, newResource);
      setResources([...resources, response.data]); 
      setNewResource({ nom: '', type: '', quantite: '' }); 
      toast.success('Ressource ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la ressource :', error);
      toast.error('Une erreur est survenue lors de l\'ajout de la ressource.');
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource({
      ...newResource,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <button
          onClick={() => navigate(-1)} // Retour à la page précédente
          className="mb-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Retour aux tâches
        </button>
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Ressources de la Tâche</h1>

        {/* Formulaire d'ajout de ressource */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Ajouter une nouvelle ressource</h2>
          <Toaster />
          <form className="space-y-4" onSubmit={handleAddResource}>
            <input
              type="text"
              name="nom"
              placeholder="Nom de la ressource"
              value={newResource.nom}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              name="type"
              placeholder="Type de ressource"
              value={newResource.type}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              
            />
            <input
              type="number"
              name="quantite"
              placeholder="Quantité"
              value={newResource.quantite}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
            type='submit'
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Ajouter la ressource
            </button>
          </form>
        </div>

        {/* Liste des ressources */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Liste des Ressources</h2>
          {resources.length === 0 ? (
            <p className="text-gray-600">Aucune ressource disponible pour cette tâche.</p>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div key={resource._id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <p className="text-gray-800 font-semibold">{resource.nom}</p>
                  <p className="text-sm text-gray-600">Type: {resource.type}</p>
                  <p className="text-sm text-gray-600">Quantité: {resource.quantite}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskResourcesPage;