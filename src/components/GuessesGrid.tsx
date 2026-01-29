import React from 'react'
import { type User, getAllUsers } from '../utils/dailyUser'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { FaInfoCircle } from 'react-icons/fa'

interface Guess {
  user: User
  isCorrect: boolean
}

interface AttributeFeedback {
  value: string
  isCorrect: boolean
  direction?: 'up' | 'down' | 'left' | 'right' | null // For first letter and before-me-in-company comparison
  imageUrl?: string // For Yes/No image replacements
}

interface GuessesGridProps {
  guesses: Guess[]
  dailyUser: User
  guessesCount: number
}

function getFirstNameInitial(name: string): string {
  return name.charAt(0).toUpperCase()
}

function getEmployeeIndex(user: User): number {
  const allUsers = getAllUsers()
  return allUsers.findIndex(
    u => u.name === user.name && u.displayName === user.displayName
  )
}

function compareAttributes(guess: User, target: User): Record<string, AttributeFeedback> {
  const isSamePerson = guess.name === target.name && guess.displayName === target.displayName
  
  // Compare based on position in employees.json (earlier index = started earlier)
  const guessIndex = getEmployeeIndex(guess)
  const targetIndex = getEmployeeIndex(target)
  const guessStartedBeforeTarget = guessIndex < targetIndex
  
  return {
    employee: {
      value: guess.name,
      isCorrect: isSamePerson
    },
    role: {
      value: guess.role,
      isCorrect: guess.role === target.role
    },
    beforeMeInCompany: {
      value: guessStartedBeforeTarget ? 'Yes' : 'No',
      isCorrect: guessStartedBeforeTarget, // Green if started before, red if started after
      direction: guessStartedBeforeTarget ? 'down' : 'up' // Down arrow if started before (earlier row), up if started after (later row)
    },
    listensToChalga: {
      value: guess['listens-to-chalga'] ? 'да' : 'не',
      isCorrect: guess['listens-to-chalga'] === target['listens-to-chalga']
    },
    gender: {
      value: guess.gender === 'лаймче' ? 'мъж' : guess.gender === 'лаймка' ? 'жена' : guess.gender,
      isCorrect: guess.gender === target.gender
    },
    firstLetter: {
      value: getFirstNameInitial(guess.name),
      isCorrect: getFirstNameInitial(guess.name) === getFirstNameInitial(target.name),
      direction: (() => {
        const guessInitial = getFirstNameInitial(guess.name)
        const targetInitial = getFirstNameInitial(target.name)
        if (guessInitial === targetInitial) return null
        // If target (daily employee) comes before guess alphabetically, show left arrow
        // If target comes after guess, show right arrow
        return targetInitial < guessInitial ? 'left' : 'right'
      })()
    }
  }
}

export function GuessesGrid({ guesses, dailyUser, guessesCount }: GuessesGridProps) {
  if (guesses.length === 0) {
    return null
  }

  return (
    <div className="feedback-grid-container">
      <div className="feedback-grid">
        <div className="grid-cell header-cell">Аватар</div>
        <div className="grid-cell header-cell">Роля</div>
        <div className="grid-cell header-cell">Пол</div>
        <div className="grid-cell header-cell">Първа буква</div>
        <div className="grid-cell header-cell" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
          Employee #
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#4CF3AF',
                  fontSize: '14px'
                }}
                aria-label="Information about Employee #"
              >
                <FaInfoCircle size={14} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              style={{
                backgroundColor: '#1D252F',
                borderColor: '#4CF3AF',
                color: '#ffffff',
                maxWidth: '300px',
                padding: '12px'
              }}
            >
              <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#4CF3AF' }}>
                  Employee #
                </p>
                <p style={{ margin: 0 }}>
                  The arrow indicates whether the daily employee started before (←) or after (→) the guessed employee.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid-cell header-cell" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
          #chalga ?
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#4CF3AF',
                  fontSize: '14px'
                }}
                aria-label="Information about #chalga"
              >
                <FaInfoCircle size={14} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              style={{
                backgroundColor: '#1D252F',
                borderColor: '#4CF3AF',
                color: '#ffffff',
                maxWidth: '300px',
                padding: '12px'
              }}
            >
              <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#4CF3AF' }}>
                  #chalga ?
                </p>
                <p style={{ margin: 0 }}>
                  This employee is part of the #chalga channel.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {guesses.map((guess, index) => {
          const feedback = compareAttributes(guess.user, dailyUser)
          return (
            <React.Fragment key={index}>
              <div 
                className={`grid-cell pop-in ${feedback.employee.isCorrect ? 'correct' : 'incorrect'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={guess.user.image72 || guess.user.image192} 
                  alt={guess.user.name}
                  className="employee-avatar-small"
                />
              </div>
              <div 
                className={`grid-cell pop-in ${feedback.role.isCorrect ? 'correct' : 'incorrect'}`}
                style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
              >
                {feedback.role.value}
              </div>
              <div 
                className={`grid-cell pop-in ${feedback.gender.isCorrect ? 'correct' : 'incorrect'}`}
                style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
              >
                {feedback.gender.value}
              </div>
              <div 
                className={`grid-cell pop-in ${feedback.firstLetter.isCorrect ? 'correct' : 'incorrect'}`}
                style={{ 
                  animationDelay: `${index * 0.1 + 0.15}s`
                }}
              >
                {!feedback.firstLetter.isCorrect && feedback.firstLetter.direction !== null ? (
                  <span className="direction-arrow">
                    {feedback.firstLetter.direction === 'left' ? '←' : '→'}
                  </span>
                ) : feedback.firstLetter.isCorrect ? (
                  '✓'
                ) : null}
              </div>
              <div 
                className={`grid-cell pop-in ${(() => {
                  const guessIndex = getEmployeeIndex(guess.user)
                  const targetIndex = getEmployeeIndex(dailyUser)
                  return guessIndex === targetIndex ? 'correct' : 'incorrect'
                })()}`}
                style={{ 
                  animationDelay: `${index * 0.1 + 0.2}s`
                }}
              >
                {(() => {
                  const guessIndex = getEmployeeIndex(guess.user)
                  const targetIndex = getEmployeeIndex(dailyUser)
                  
                  // If exact match, show checkmark
                  if (guessIndex === targetIndex) {
                    return '✓'
                  }
                  
                  // Left arrow if target comes before guess (lower index), right arrow if target comes after guess (higher index)
                  const arrow = guessIndex < targetIndex ? '→' : '←'
                  return (
                    <span className="direction-arrow">{arrow}</span>
                  )
                })()}
              </div>
              <div 
                className={`grid-cell pop-in ${feedback.listensToChalga.isCorrect ? 'correct' : 'incorrect'}`}
                style={{ animationDelay: `${index * 0.1 + 0.25}s` }}
              >
                {feedback.listensToChalga.value}
              </div>
            </React.Fragment>
          )
        })}
      </div>
      {guessesCount > 0 && (
        <p className="guesses-remaining" style={{ 
          marginTop: '1rem', 
          marginBottom: 0,
          textAlign: 'center'
        }}>
          <span>Guesses: {guessesCount}/6</span>
        </p>
      )}
    </div>
  )
}
