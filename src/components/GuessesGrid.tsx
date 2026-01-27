import React from 'react'
import { type User, getAllUsers } from '../utils/dailyUser'

interface Guess {
  user: User
  isCorrect: boolean
}

interface AttributeFeedback {
  value: string
  isCorrect: boolean
  direction?: 'up' | 'down' | null // For first letter and before-me-in-company comparison
  imageUrl?: string // For Yes/No image replacements
}

interface GuessesGridProps {
  guesses: Guess[]
  dailyUser: User
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
      value: guess['listens-to-chalga'] ? 'слуша' : 'не слуша',
      isCorrect: guess['listens-to-chalga'] === target['listens-to-chalga']
    },
    gender: {
      value: guess.gender,
      isCorrect: guess.gender === target.gender
    },
    firstLetter: {
      value: getFirstNameInitial(guess.name),
      isCorrect: getFirstNameInitial(guess.name) === getFirstNameInitial(target.name),
      direction: (() => {
        const guessInitial = getFirstNameInitial(guess.name)
        const targetInitial = getFirstNameInitial(target.name)
        if (guessInitial === targetInitial) return null
        // If target (daily employee) comes before guess alphabetically, show up arrow
        // If target comes after guess, show down arrow
        return targetInitial < guessInitial ? 'up' : 'down'
      })()
    }
  }
}

export function GuessesGrid({ guesses, dailyUser }: GuessesGridProps) {
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
        <div className="grid-cell header-cell">Преди/след</div>
        <div className="grid-cell header-cell">#chalga ?</div>
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
                  animationDelay: `${index * 0.1 + 0.15}s`,
                  backgroundColor: feedback.firstLetter.isCorrect 
                    ? undefined // Use green from 'correct' class when exact match
                    : (() => {
                        const guessInitial = getFirstNameInitial(guess.user.name)
                        const targetInitial = getFirstNameInitial(dailyUser.name)
                        const guessCode = guessInitial.charCodeAt(0)
                        const targetCode = targetInitial.charCodeAt(0)
                        const distance = Math.abs(guessCode - targetCode)
                        // Max distance is 25 (A to Z)
                        const maxDistance = 25
                        const normalizedDistance = Math.min(distance / maxDistance, 1)
                        // Create gradient from light blue to deep blue
                        // Closer = lighter, further = darker
                        const r = Math.floor(59 + (30 - 59) * normalizedDistance)
                        const g = Math.floor(130 + (58 - 130) * normalizedDistance)
                        const b = Math.floor(246 + (138 - 246) * normalizedDistance)
                        return `rgb(${r}, ${g}, ${b})`
                      })()
                }}
              >
                {!feedback.firstLetter.isCorrect && feedback.firstLetter.direction !== null ? (
                  <span className="direction-arrow">
                    {feedback.firstLetter.direction === 'up' ? '↑' : '↓'}
                  </span>
                ) : feedback.firstLetter.isCorrect ? (
                  '✓'
                ) : null}
              </div>
              <div 
                className={`grid-cell pop-in ${(() => {
                  const guessIndex = getEmployeeIndex(guess.user)
                  const targetIndex = getEmployeeIndex(dailyUser)
                  return guessIndex === targetIndex ? 'correct' : ''
                })()}`}
                style={{ 
                  animationDelay: `${index * 0.1 + 0.2}s`,
                  backgroundColor: (() => {
                    const guessIndex = getEmployeeIndex(guess.user)
                    const targetIndex = getEmployeeIndex(dailyUser)
                    
                    // If exact match, return undefined to use green from 'correct' class
                    if (guessIndex === targetIndex) {
                      return undefined
                    }
                    
                    const distance = Math.abs(guessIndex - targetIndex)
                    const allUsers = getAllUsers()
                    const maxDistance = allUsers.length - 1
                    // Normalize distance to 0-1 range
                    const normalizedDistance = Math.min(distance / maxDistance, 1)
                    // Create gradient from light blue to deep blue
                    // Closer = lighter, further = darker
                    const r = Math.floor(59 + (30 - 59) * normalizedDistance)
                    const g = Math.floor(130 + (58 - 130) * normalizedDistance)
                    const b = Math.floor(246 + (138 - 246) * normalizedDistance)
                    return `rgb(${r}, ${g}, ${b})`
                  })(),
                  color: '#000000'
                }}
              >
                {(() => {
                  const guessIndex = getEmployeeIndex(guess.user)
                  const targetIndex = getEmployeeIndex(dailyUser)
                  
                  // If exact match, show checkmark
                  if (guessIndex === targetIndex) {
                    return '✓'
                  }
                  
                  const arrow = feedback.beforeMeInCompany.direction === 'up' ? '↑' : '↓'
                  return `${guessIndex + 1} ${arrow}`
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
    </div>
  )
}
