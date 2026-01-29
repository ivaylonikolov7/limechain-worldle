export function RulesContent() {
  return (
    <div className="rules-content">
      <p className="rules-intro">
        Guess today's LimeChain employee! You have <strong>6 guesses</strong> to figure out who it is.
      </p>
      <div className="rules-list">
        <div className="rule-item">
          <span className="rule-number">1</span>
          <div className="rule-content">
            <p>Type an employee name in the search box below</p>
          </div>
        </div>
        <div className="rule-item">
          <span className="rule-number">2</span>
          <div className="rule-content">
            <p>After each guess, you'll see feedback comparing attributes:</p>
            <ul className="attributes-list">
              <li><strong>Role</strong> - The employee's role/position</li>
              <li><strong>Employee #</strong> - Position in company (← earlier, → later, ✓ same)</li>
              <li><strong>Gender</strong> - мъж (male) or жена (female)</li>
              <li><strong>Първа буква</strong> - First letter of first name (← earlier, → later, ✓ same)</li>
              <li><strong>#chalga</strong> - Whether employee is in #chalga channel (да/не)</li>
            </ul>
          </div>
        </div>
        <div className="rule-item">
          <span className="rule-number">3</span>
          <div className="rule-content">
            <p>
              <span className="color-indicator correct"></span> <strong>Green</strong> (✓) means the attribute matches the daily employee
            </p>
            <p>
              <span className="color-indicator incorrect"></span> <strong>Red</strong> (✗) means it doesn't match
            </p>
            <p>
              <strong>Arrows</strong> (←/→) show direction: left arrow means the daily employee comes before, right arrow means after
            </p>
          </div>
        </div>
        <div className="rule-item">
          <span className="rule-number">4</span>
          <div className="rule-content">
            <p>After your 5th guess, you'll get a pixelated image hint if you haven't guessed correctly yet</p>
          </div>
        </div>
        <div className="rule-item">
          <span className="rule-number">5</span>
          <div className="rule-content">
            <p>Use the clues to narrow down your next guess!</p>
          </div>
        </div>
      </div>
      <p className="rules-note">
        💡 The same employee will be selected for the same date every time. You can only play once per day!
      </p>
    </div>
  )
}
