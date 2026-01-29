import { useMemo, useState } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { type User as UserType, getAllUsers } from '../utils/dailyUser'

interface GuessInputProps {
  onGuess: (user: UserType) => void
  guesses: Array<{ user: UserType; isCorrect: boolean }>
  disabled?: boolean
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function GuessInput({ onGuess, guesses, disabled }: GuessInputProps) {
  const [selectedUser, setSelectedUser] = useState<UserType | undefined>(undefined)
  
  const remainingGuesses = 6 - guesses.length

  // Filter out already guessed users and shuffle
  const availableUsers = useMemo(() => {
    const guessedNames = new Set(guesses.map(g => `${g.user.name}|${g.user.displayName}`))
    const allUsers = getAllUsers()
    const filtered = allUsers.filter(user => !guessedNames.has(`${user.name}|${user.displayName}`))
    return shuffleArray(filtered)
  }, [guesses])

  const handleValueChange = (user: UserType | undefined) => {
    if (user) {
      onGuess(user)
      setSelectedUser(undefined)
    } else {
      setSelectedUser(user)
    }
  }

  return (
    <div className="guess-input-section">
      <div className="combobox-container">
        <Combobox
          items={availableUsers}
          value={selectedUser}
          onValueChange={handleValueChange}
          placeholder="Type employee name..."
          searchPlaceholder="Search employees..."
          emptyText="No employees found."
          getItemLabel={(user) => user.name}
          getItemValue={(user) => `${user.name}|${user.displayName}`}
          disabled={disabled || remainingGuesses === 0 || guesses.length >= 6}
        />
      </div>
    </div>
  )
}
