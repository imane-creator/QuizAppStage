import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Grid, TextField, Select, MenuItem } from '@mui/material';
import SingleChoiceQuestion from './SingleChoiceQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TextQuestion from './TextQuestion';

const AddDiagnosticForm = ({ onSubmit }) => {
  const [sections, setSections] = useState([{ title: '', description: '', questions: [] }]);
  const [suggestions, setSuggestions] = useState([]);

  const handleAddSection = () => {
    const newSections = [...sections, { title: '', description: '', questions: [] }];
    setSections(newSections);
  };

  const handleChange = (sectionIndex, questionIndex, key, value) => {
    const newSections = [...sections];
    if (key === 'title' || key === 'description') {
      newSections[sectionIndex][key] = value;
    } else {
      const newQuestion = { ...newSections[sectionIndex].questions[questionIndex] };
      newQuestion[key] = value;
      newSections[sectionIndex].questions[questionIndex] = newQuestion;
    }
    setSections(newSections);
  };

  const handleAddQuestion = (sectionIndex) => {
    const newSections = [...sections];
    const defaultQuestion = { content: '', type: 'text', suggestions: [], correctAnswers: [] };
    newSections[sectionIndex].questions.push(defaultQuestion);
    setSections(newSections);
  };

  const handleAddOption1 = (sectionIndex, questionIndex, key, suggestion = null) => {
    const newSections = [...sections];
    if (suggestion) {
      newSections[sectionIndex].questions[questionIndex][key].push(suggestion);
    } else {
      newSections[sectionIndex].questions[questionIndex][key].push('');
    }
    setSections(newSections);
  };

  const handleAddOption2 = (sectionIndex, questionIndex, key, correctResponse = null) => {
    const newSections = [...sections];
    // Vérifier si la question existe et est initialisée comme un objet
    if (!newSections[sectionIndex].questions[questionIndex]) {
      newSections[sectionIndex].questions[questionIndex] = {};
    }
    if (correctResponse) {
      // Assurez-vous que la propriété correctResponses est initialisée comme un tableau
      if (!newSections[sectionIndex].questions[questionIndex][key]) {
        newSections[sectionIndex].questions[questionIndex][key] = [];
      }
      newSections[sectionIndex].questions[questionIndex][key].push(correctResponse);
    } else {
      newSections[sectionIndex].questions[questionIndex][key].push('');
    }
    setSections(newSections);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const entrepriseId = localStorage.getItem('entrepriseId');
    if (!entrepriseId) {
      console.error('No entreprise ID found in localStorage');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/v1/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entrepriseId }),
      });
      if (!response.ok) {
        throw new Error('Error while submitting the diagnostic form');
      }

      const responseData = await response.json();
      const quizId = responseData.quiz.id;

     // Avant de mapper sur question.correctResponses, vérifiez s'il est défini
const sectionsWithQuizInfo = sections.map((section) => ({
  ...section,
  quizId: quizId,
  title: section.title,
  texte: section.description,
  questions: section.questions.map((question) => ({
      ...question,

      suggestions: question.suggestions.map((suggestion) => ({
          id: suggestion.id,
          content: suggestion.content,
          questionId: question.id,
      })),

      correctResponses: question.correctResponses ? question.correctResponses.map((correctResponse) => ({
          id: correctResponse.id,
          content: correctResponse.content,
          questionId: question.id,
      })) : [], // Si correctResponses est undefined, utilisez un tableau vide
  })),
}));


      const sectionResponse = await fetch('http://localhost:5000/api/v1/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionsWithQuizInfo),
      });

      if (!sectionResponse.ok) {
        throw new Error('Error while submitting sections');
      }

      const sectionData = await sectionResponse.json();
      const sectionIds = sectionData.sections.map((section) => section.id);

      const questionsWithSectionInfo = sectionsWithQuizInfo.reduce((acc, section, sectionIndex) => {
        const questions = section.questions.map((question) => ({
          sectionId: sectionIds[sectionIndex],
          texte: question.content,
          type: question.type,
        }));
        return [...acc, ...questions];
      }, []);

      const questionResponse = await fetch('http://localhost:5000/api/v1/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionsWithSectionInfo),
      });

      if (!questionResponse.ok) {
        throw new Error('Error while submitting questions');
      }

      const questionData = await questionResponse.json();
const questionIds = questionData.questions.map((question) => question.id);

const allSuggestionsWithQuestionId = sectionsWithQuizInfo.reduce((acc, section, sectionIndex) => {
  const sectionSuggestions = section.questions.flatMap((question, questionIndex) => {
    const questionId = questionIds[sectionIndex * section.questions.length + questionIndex];

    return question.suggestions.map((suggestion) => ({
      ...suggestion,
      questionId: questionId,
    }));
  });

  return [...acc, ...sectionSuggestions];
}, []);


const allSuggestionsWithQuestionId1 = sectionsWithQuizInfo.reduce((acc, section, sectionIndex) => {
  const sectionCorrectResponses = section.questions.flatMap((question, questionIndex) => {
    const questionId = questionIds[sectionIndex * section.questions.length + questionIndex];

    return question.correctResponses.map((correctResponse) => ({
      ...correctResponse,
      questionId: questionId,
    }));
  });

  return [...acc, ...sectionCorrectResponses];
}, []);

      const suggestionResponse = await fetch('http://localhost:5000/api/v1/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allSuggestionsWithQuestionId),
      });

      if (!suggestionResponse.ok) {
        throw new Error('Error while submitting suggestions');
      }

      console.log('sugg alllezzz');

      const correctResponseResponse = await fetch('http://localhost:5000/api/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allSuggestionsWithQuestionId1),
      });

      if (!correctResponseResponse.ok) {
        throw new Error('Error while submitting corrr');
      }

      console.log('Data submitted successfully');



    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <Card>
      <CardHeader title="Add Diagnostic Form" />
      <CardContent>
        <form onSubmit={handleSubmit}>
          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} sx={{ marginBottom: '20px' }}>
              <CardContent>
                <Grid container spacing={2} key={sectionIndex}>
                  <Grid item xs={12}>
                    <TextField
                      placeholder="Section Title"
                      value={section.content}
                      onChange={(e) => handleChange(sectionIndex, -1, 'title', e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      placeholder="Section Description"
                      value={section.content}
                      onChange={(e) => handleChange(sectionIndex, -1, 'description', e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  {section.questions.map((question, questionIndex) => (
                    <Grid item xs={12} key={questionIndex}>
                      <TextField
                        label="Question Content"
                        value={question.content}
                        onChange={(e) => handleChange(sectionIndex, questionIndex, 'content', e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                      <Select
                        value={question.type || 'text'}
                        onChange={(e) => handleChange(sectionIndex, questionIndex, 'type', e.target.value)}
                        style={{ marginTop: '10px' }}
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="single_choice">Single Choice</MenuItem>
                        <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                        <MenuItem value="scro">SCRO</MenuItem>
                      </Select>
                      {question.type === 'multiple_choice' && (
                      <MultipleChoiceQuestion
                      sectionIndex={sectionIndex}
                      questionIndex={questionIndex}
                      question={question}
                      handleChange={handleChange}
                      handleAddOption1={handleAddOption1}
                      handleAddOption2={handleAddOption2}
                  />
                )}
                      {question.type === 'single_choice' && (
                        <SingleChoiceQuestion
                          sectionIndex={sectionIndex}
                          questionIndex={questionIndex}
                          question={question}
                          handleChange={handleChange}
                          handleAddOption1={handleAddOption1}
                          handleAddOption2={handleAddOption2}
                        />
                      )}
                      {question.type === 'text' && (
                        <TextQuestion
                          sectionIndex={sectionIndex}
                          questionIndex={questionIndex}
                          question={question}
                          handleChange={handleChange}
                          handleAddOption2={handleAddOption2}

                        />
                      )}
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={() => handleAddQuestion(sectionIndex)}>
                      Add Question
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button variant="contained" onClick={handleAddSection}>
                Add Section
              </Button>
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDiagnosticForm;
