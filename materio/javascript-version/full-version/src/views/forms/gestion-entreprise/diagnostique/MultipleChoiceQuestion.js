import React from 'react';
import { TextField, Button } from '@mui/material';

const MultipleChoiceQuestion = ({ sectionIndex, questionIndex, question, handleChange, handleAddOption1 ,handleAddOption2 }) => {

    const handleAddSuggestion = () => {
        const newSuggestion = { content: '', questionId: question.id }; // Ajoutez l'ID de la question
        handleAddOption1(sectionIndex, questionIndex, 'suggestions', newSuggestion);
    };

    const handleAddCorrectResponse = () => {

        const newCorrectResponse = { correct: '', questionId: question.id }; // Ajoutez l'ID de la question
        handleAddOption2(sectionIndex, questionIndex, 'correctResponses' ,newCorrectResponse);
    };

    return (
        <div>
            {/* Affichage pour les suggestions */}
            {question.suggestions.map((suggestion, suggestionIndex) => (
                <TextField
                    key={suggestionIndex}
                    label="suggestion"
                    value={suggestion?.content || ''}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        const newQuestion = { ...question };
                        if (newQuestion.suggestions && typeof newQuestion.suggestions[suggestionIndex] === 'object') {
                            newQuestion.suggestions[suggestionIndex].content = newValue;
                            handleChange(sectionIndex, `questions.${questionIndex}`, newQuestion);
                        } else {
                            console.error('suggestions[suggestionIndex] is not defined or not an object');
                        }
                    }}
                    fullWidth
                    variant="outlined"
                    size="small"
                />
            ))}
            <Button
                variant="contained"
                onClick={handleAddSuggestion}
                style={{ backgroundColor: '#4caf50', color: '#fff', marginBottom: '10px' }}
            >
                Add Suggestion
            </Button>
           {/* Bouton pour ajouter une réponse correcte */}
   {question.correctResponses && question.correctResponses.map((correctResponse, correctResponseIndex) => (
    <TextField
        key={correctResponseIndex}
        label="correctResponse"
        value={correctResponse?.content || ''}
        onChange={(e) => {
            const newValue = e.target.value;
            const newQuestion = { ...question };
            if (newQuestion.correctResponses && typeof newQuestion.correctResponses[correctResponseIndex] === 'object') {
                newQuestion.correctResponses[correctResponseIndex].content = newValue;
                handleChange(sectionIndex,` questions.${questionIndex}`, newQuestion);
            } else {
                console.error('correctResponses[correctResponseIndex] is not defined or not an object');
            }
        }}
        fullWidth
        variant="outlined"
        size="small"
    />
))}

            <Button
                variant="contained"
                onClick={handleAddCorrectResponse}
                style={{ backgroundColor: '#4caf50', color: '#fff', marginBottom: '10px' }}
            >
                Add Correct Response
            </Button>
        </div>
    );
};

export default MultipleChoiceQuestion;
