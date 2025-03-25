import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectTasksPage = () => {
  const { projectId } = useParams();
  const { taskId } = useParams();

  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ description: '', dateDebut: '', dateFin: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (projectId) {
      axios.get(`http://localhost:8080/api/tasks/${projectId}/taches`)
        .then((response) => setTasks(response.data))
        .catch((error) => console.error('Erreur chargement tâches:', error));
    }
  }, [projectId]);

  const handleAddTask = async () => {
    if (!task.description || !task.dateDebut || !task.dateFin) {
      setError('Tous les champs doivent être remplis.');
      return;
    }
    if (new Date(task.dateDebut) > new Date(task.dateFin)) {
      setError('La date de début doit être avant la date de fin.');
      return;
    }
    setError('');

    const formattedTask = {
      ...task,
      dateDebut: new Date(task.dateDebut).toISOString(),
      dateFin: new Date(task.dateFin).toISOString(),
      projet: projectId,
    };

    try {
      const response = await axios.post(`http://localhost:8080/api/tasks/${projectId}/taches`, formattedTask);
      setTasks([...tasks, response.data]);
      setTask({ description: '', dateDebut: '', dateFin: '' });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error);
      setError("Erreur lors de l'ajout de la tâche.");
    }
  };

  const handleEditTask = async () => {
    if (!task.description || !task.dateDebut || !task.dateFin) {
      setError('Tous les champs doivent être remplis.');
      return;
    }
    if (new Date(task.dateDebut) > new Date(task.dateFin)) {
      setError('La date de début doit être avant la date de fin.');
      return;
    }
    setError('');

    const formattedTask = {
      ...task,
      dateDebut: new Date(task.dateDebut).toISOString(),
      dateFin: new Date(task.dateFin).toISOString(),
      projet: projectId,
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/tasks/${projectId}/taches/${editingTaskId}`, formattedTask);
      setTasks(tasks.map((t) => (t._id === editingTaskId ? response.data : t)));
      setTask({ description: '', dateDebut: '', dateFin: '' });
      setEditingTaskId(null);
    } catch (error) {
      console.error('Erreur modification tâche:', error);
      setError('Erreur lors de la modification de la tâche.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Supprimer cette tâche ?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${projectId}/taches/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (error) {
      console.error('Erreur suppression tâche:', error);
      setError('Erreur lors de la suppression de la tâche.');
    }
  };

  const handleStartEdit = (tache) => {
    setTask({
      description: tache.description,
      dateDebut: tache.dateDebut.split('T')[0],
      dateFin: tache.dateFin.split('T')[0],
    });
    setEditingTaskId(tache._id);
  };

  const handleCancelEdit = () => {
    setTask({ description: '', dateDebut: '', dateFin: '' });
    setEditingTaskId(null);
  };
  const handleViewTasks = (projectId) => {
    navigate(`/task/${taskId}/resources`); 
  };


  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <button 
          onClick={() => navigate('/')} 
         className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg bg-emerald-500 hover:bg-emerald-600"
        >
          ← Retour aux projets
        </button>
        
        <h1 className="text-3xl font-bold text-green-900 mb-6 border-b-2 border-green-100 pb-4 text-center">Gestion des Tâches</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500 text-center">
            {error}
          </div>
        )}
        
        <div className="mb-8 p-6 bg-green-50 rounded-xl shadow-inner">
          <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">
            {editingTaskId ? '✏️ Modifier la tâche' : '➕ Ajouter une nouvelle tâche'}
          </h2>
          
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Description de la tâche" 
              value={task.description} 
              onChange={(e) => setTask({ ...task, description: e.target.value })} 
              className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Date de début</label>
                <input 
                  type="date" 
                  value={task.dateDebut} 
                  onChange={(e) => setTask({ ...task, dateDebut: e.target.value })} 
                  className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Date de fin</label>
                <input 
                  type="date" 
                  value={task.dateFin} 
                  onChange={(e) => setTask({ ...task, dateFin: e.target.value })} 
                  className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-center">
              {editingTaskId ? (
                <>
                  <button 
                    onClick={handleEditTask} 
                    className="flex-1 py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg bg-amber-500 hover:bg-amber-600"
                  > 
                    Mettre à jour
                  </button>
                  <button 
                    onClick={handleCancelEdit} 
                    className="py-3 px-4 rounded-lg text-gray-700 font-semibold transition-all duration-300 border border-gray-300 hover:bg-gray-100"
                  > 
                    Annuler
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleAddTask} 
                  className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg bg-emerald-500 hover:bg-emerald-600"
                > 
                  Créer la tâche
                </button>
              )}
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-green-900 mb-4 border-b-2 border-green-100 pb-2 text-center">Liste des Tâches</h2>
        
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune tâche disponible pour ce projet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((tache) => (
              <div 
                key={tache._id} 
                className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-green-400 flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{tache.description}</p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                      🗓️ Début: {new Date(tache.dateDebut).toLocaleDateString()}
                    </span>
                    <span className="text-sm bg-purple-100 text-purple-800 py-1 px-2 rounded-full">
                      🏁 Fin: {new Date(tache.dateFin).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
       <button 
       onClick={handleViewTasks}
       className="bg-amber-500 hover:bg-amber-600 text-white py-1 px-3 rounded-lg transition-colors duration-300 shadow-sm" > 
       Ressource
       </button>

                  <button 
                    onClick={() => handleStartEdit(tache)} 
                    className="bg-amber-500 hover:bg-amber-600 text-white py-1 px-3 rounded-lg transition-colors duration-300 shadow-sm"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(tache._id)} 
                    className="bg-pink-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg transition-colors duration-300 shadow-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTasksPage;