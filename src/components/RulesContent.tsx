export function RulesContent() {
  return (
    <div className="rules-content">
      <p className="rules-intro">
        Guess the daily LimeChain employee! You have <strong>6 guesses</strong> to figure out who it is.
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
              <li>Role</li>
              <li>Before me in company</li>
              <li>Gender</li>
              <li>First letter of name</li>
            </ul>
          </div>
        </div>
        <div className="rule-item">
          <span className="rule-number">3</span>
          <div className="rule-content">
            <p>
              <span className="color-indicator correct"></span> <strong>Green</strong> means the attribute matches the daily employee
            </p>
            <p>
              <span className="color-indicator incorrect"></span> <strong>Red</strong> means it doesn't match
            </p>
          </div>
        </div>
        <div className="rule-item">
          <span className="rule-number">4</span>
          <div className="rule-content">
            <p>Use the clues to narrow down your next guess!</p>
          </div>
        </div>
      </div>
      <p className="rules-note">
        💡 The same employee will be selected for the same date every time
      </p>
    </div>
  )
}
