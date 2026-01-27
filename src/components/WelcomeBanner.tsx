interface WelcomeBannerProps {
  onDismiss: () => void
}

export function WelcomeBanner({ onDismiss }: WelcomeBannerProps) {
  return (
    <div style={{
      backgroundColor: '#1D252F',
      border: '2px solid #4CF3AF',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '1.5rem auto',
      maxWidth: '800px',
      color: '#ffffff',
      position: 'relative'
    }}>
      <button
        onClick={onDismiss}
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '0.25rem 0.5rem',
          lineHeight: '1'
        }}
        aria-label="Close"
      >
        ×
      </button>
      <h2 style={{
        color: '#4CF3AF',
        fontSize: '1.5rem',
        marginBottom: '1rem',
        marginTop: '0',
        textAlign: 'center'
      }}>
        👋 Добре дошли! Как се играе?
      </h2>
      <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
        <p style={{ marginBottom: '1rem' }}>
          Познайте днешното Лаймче! Имате <strong>6 опита</strong> да разберете кой е.
        </p>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ marginBottom: '0.5rem' }}><strong>1.</strong> Въведете име на служител в полето за търсене</p>
          <p style={{ marginBottom: '0.5rem' }}><strong>2.</strong> След всеки опит ще видите обратна връзка за:</p>
          <ul style={{ 
            listStyle: 'disc',
            listStylePosition: 'inside',            
            textAlign: 'center'
          }}>
            <li>Роля</li>
            <li>Преди него/нея ли е в компанията</li>
            <li>Пол</li>
            <li>Първта буква от името му дали е преди или след тази на днешното Лаймче</li>
          </ul>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>3.</strong> <span style={{ color: '#4CF3AF' }}>Зелено</span> означава, че атрибутът съвпада
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>4.</strong> <span style={{ color: '#ef4444' }}>Червено</span> означава, че не съвпада
          </p>
          <p style={{ marginBottom: '0', marginTop: '0.5rem' }}>
            Използвайте подсказките, за да стесните следващия си опит!
          </p>
        </div>
      </div>
    </div>
  )
}
