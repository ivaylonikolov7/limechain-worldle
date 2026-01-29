/**
 * Cookie utility functions
 */

/**
 * Set a cookie with expiration
 */
export function setCookie(name: string, value: string, days: number = 1): void {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

/**
 * Check if user has played today using cookie
 */
export function hasPlayedTodayFromCookie(): boolean {
  const today = new Date().toISOString().split('T')[0]
  const cookieValue = getCookie(`lime-wordle-played-${today}`)
  return cookieValue === 'true'
}

/**
 * Set cookie to mark that user has played today
 */
export function setPlayedTodayCookie(): void {
  const today = new Date().toISOString().split('T')[0]
  // Cookie expires at end of day (in about 24 hours)
  setCookie(`lime-wordle-played-${today}`, 'true', 1)
}
