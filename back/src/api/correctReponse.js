const express = require('express');
const router = express.Router();
const CorrectReponse = require('../models/correctReponse');




router.post('/responses', async (req, res) => {
  try {
    const correctReponsesDataArray = req.body; // Récupérer les données des correctReponses envoyées

    console.log('Received correctReponse data:', correctReponsesDataArray);

    const createdCorrectReponses = []; // Initialiser un tableau pour stocker les correctReponses créées

    // Parcourir les données de chaque correctReponse
    for (const correctReponseData of correctReponsesDataArray) {

      const {content ,questionId} =correctReponseData 

      console.log(content ,questionId);
      // Créer la correctReponse
      const newCorrectReponse = await CorrectReponse.create(correctReponseData);

      // Ajouter la correctReponse créée au tableau des correctReponses créées
      createdCorrectReponses.push(newCorrectReponse);
    }

    // Envoyer une réponse avec le statut 201 et les données des correctReponses créées
    res.status(201).json({ message: 'correctReponses created successfully', correctReponses: createdCorrectReponses });
  } catch (error) {
    console.error('Error creating correctReponses:', error);

    // Envoyer une réponse d'erreur avec le statut 500 et un message d'erreur approprié
    res.status(500).json({ error: 'Cannot create correctReponses at the moment', errorMessage: error.message });
  }
});


module.exports = router;

