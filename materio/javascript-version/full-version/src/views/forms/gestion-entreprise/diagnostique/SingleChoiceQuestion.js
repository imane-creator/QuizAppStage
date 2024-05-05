import React, { useState } from 'react'
import { TextField, Button } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'

import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  inputNote: {
    marginRight: '0px',
    borderLeft: 'none', // Supprimer la bordure gauche du TextField principal
    paddingLeft: '0px' // Supprimer le padding gauche du TextField principal
  },
  noteInput: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.23)', // Ajouter une bordure à gauche pour l'InputAdornment
    paddingLeft: '8px' // Ajouter du padding gauche pour l'InputAdornment
  }
})

const SingleChoiceQuestion = ({
  sectionIndex,
  questionIndex,
  question,
  handleChange,
  handleAddOption1,
  handleAddOption2
}) => {
  const handleAddSuggestion = () => {
    const newSuggestion = { content: '', questionId: question.id }
    handleAddOption1(sectionIndex, questionIndex, 'suggestions', newSuggestion)
  }
  const classes = useStyles()

  return (
    <>
    <div className='no-space-between'>
      {question.suggestions.map((suggestion, suggestionIndex) => (

        <TextField
          key={suggestionIndex}
          label='Suggestion'
          value={suggestion?.content || ''}
          onChange={e => {
            const newValue = e.target.value
            const newQuestion = { ...question }
            if (newQuestion.suggestions && typeof newQuestion.suggestions[suggestionIndex] === 'object') {
              newQuestion.suggestions[suggestionIndex].content = newValue
              handleChange(sectionIndex, `questions.${questionIndex}`, newQuestion)
            } else {
              console.error('suggestions[suggestionIndex] is not defined or not an object')
            }
          }}
          fullWidth
          variant='outlined'
          size='small'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end' className={classes.inputNote}>
                <TextField
                  type='number'
                  label='Note'
                  className='MuiInputAdornment-root'
                  value={suggestion?.note || ''}
                  onChange={e => {
                    const newNote = e.target.value === '0' ? '0' : parseInt(e.target.value) // Convertir la valeur en entier si ce n'est pas "0"
                    if (!isNaN(newNote) && newNote >= 0 && newNote <= 10) {
                      const newQuestion = { ...question }
                      if (newQuestion.suggestions && typeof newQuestion.suggestions[suggestionIndex] === 'object') {
                        newQuestion.suggestions[suggestionIndex].note = newNote
                        handleChange(sectionIndex, `questions.${questionIndex}`, newQuestion)
                      } else {
                        console.error('suggestions[suggestionIndex] is not defined or not an object')
                      }
                    } else {
                      console.error('Invalid note value. Note should be between 0 and 10.')
                    }
                  }}
                  variant='outlined'
                  size='small'
                  InputProps={{
                    className: classes.noteInput
                  }}
                />
              </InputAdornment>
            )
          }}
        />

      ))

}
</div>

      <Button
        variant='contained'
        onClick={handleAddSuggestion}
        style={{ backgroundColor: '#4caf50', color: '#fff', marginBottom: '10px' }}
      >
        Add Suggestion
      </Button>
    </>
  )
}

export default SingleChoiceQuestion
