import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const SingleChoiceQuestion = ({ sectionIndex, questionIndex, question, handleChange, handleAddOption1, handleAddOption2 }) => {
  const [correctResponseValue, setCorrectResponseValue] = useState(question.correctResponse);

  const handleCorrectResponseChange = (e) => {
    const newValue = e.target.value;
    setCorrectResponseValue(newValue);
  };

  const handleCorrectResponseBlur = () => {
    handleAddOption2(sectionIndex, questionIndex, 'correctResponses', { content: correctResponseValue, questionId: question.id });
  };

  const handleAddSuggestion = () => {
    const newSuggestion = { content: '', questionId: question.id };
    handleAddOption1(sectionIndex, questionIndex, 'suggestions', newSuggestion);
  };

  return (
    <div>
      {question.suggestions.map((suggestion, suggestionIndex) => (
        <TextField
          key={suggestionIndex}
          label="Suggestion"
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

      <TextField
        label="Correct Response"
        fullWidth
        variant="outlined"
        size="small"
        value={correctResponseValue}
        onChange={handleCorrectResponseChange}
        onBlur={handleCorrectResponseBlur}
      />
    </div>
  );
};

export default SingleChoiceQuestion;
