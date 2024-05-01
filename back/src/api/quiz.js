// routes/quiz.js
const express = require('express');
const Entreprise = require('../models/entreprise'); 
const Quiz = require('../models/quiz');// Importer le modèle Entreprise si nécessaire

const router =express.Router();
require("dotenv").config();

// Créer un quiz
router.post('/quiz', async (req, res) => {
  try {
    const { entrepriseId } = req.body;

    // Vérifier si l'entreprise existe
    const existingEntreprise = await Entreprise.findByPk(entrepriseId);
    if (!existingEntreprise) {
      return res.status(404).json({ message: 'Entreprise not found' });
    }

    // Créer un nouveau quiz avec l'ID de l'entreprise
    const newQuiz = await Quiz.create({ entrepriseId });
    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Cannot create quiz at the moment' });
  }
});

module.exports = router;