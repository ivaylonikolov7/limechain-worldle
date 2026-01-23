import React from 'react'
import { type User, getAllUsers } from '../utils/dailyUser'

interface Guess {
  user: User
  isCorrect: boolean
}

interface AttributeFeedback {
  value: string
  isCorrect: boolean
  direction?: 'up' | 'down' | null // For first letter comparison
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
    listensToChalga: {
      value: guess['listens-to-chalga'] ? 'Yes' : 'No',
      isCorrect: guess['listens-to-chalga'] === target['listens-to-chalga'],
      imageUrl: guess['listens-to-chalga'] 
        ? 'https://cdn.frankerfacez.com/emoticon/720817/animated/2'
        : 'https://cdn.frankerfacez.com/emoticon/725721/animated/2'
    },
    beforeMeInCompany: {
      value: guessStartedBeforeTarget ? 'Yes' : 'No',
      isCorrect: guessStartedBeforeTarget, // Green if started before, red if started after
      imageUrl: guessStartedBeforeTarget
        ? 'https://cdn.frankerfacez.com/emoticon/720817/animated/2'
        : 'https://cdn.frankerfacez.com/emoticon/725721/animated/2'
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
        <div className="grid-cell header-cell">Чалгарче</div>
        <div className="grid-cell header-cell">Преди мен ли е?</div>
        <div className="grid-cell header-cell">Пол</div>
        <div className="grid-cell header-cell">Първа буква</div>
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
                className={`grid-cell pop-in ${feedback.listensToChalga.isCorrect ? 'correct' : 'incorrect'}`}
                style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
              >
                {feedback.listensToChalga.imageUrl ? (
                  <img 
                    src={feedback.listensToChalga.imageUrl} 
                    alt={feedback.listensToChalga.value}
                    style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                  />
                ) : (
                  feedback.listensToChalga.value
                )}
              </div>
              <div 
                className={`grid-cell pop-in ${(() => {
                  const guessIndex = getEmployeeIndex(guess.user)
                  const targetIndex = getEmployeeIndex(dailyUser)
                  return guessIndex < targetIndex ? 'correct' : 'incorrect'
                })()}`}
                style={{ animationDelay: `${index * 0.1 + 0.15}s` }}
              >
                {feedback.beforeMeInCompany.imageUrl ? (
                  <img 
                    src={feedback.beforeMeInCompany.imageUrl} 
                    alt={feedback.beforeMeInCompany.value}
                    style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                  />
                ) : (
                  feedback.beforeMeInCompany.value
                )}
              </div>
              <div 
                className={`grid-cell pop-in ${feedback.gender.isCorrect ? 'correct' : 'incorrect'}`}
                style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
              >
                {feedback.gender.value}
              </div>
              <div 
                className={`grid-cell pop-in ${feedback.firstLetter.isCorrect ? 'correct' : 'incorrect'}`}
                style={{ animationDelay: `${index * 0.1 + 0.25}s` }}
              >
                {feedback.firstLetter.value}
                {!feedback.firstLetter.isCorrect && feedback.firstLetter.direction && (
                  <span className="direction-arrow">
                    {feedback.firstLetter.direction === 'up' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
