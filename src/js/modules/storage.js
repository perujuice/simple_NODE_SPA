/**
 *
 * @returns {string}
 */
export function getUsername () {
  return localStorage.getItem('username')
}

/**
 *
 * @param {*} username
 */
export function setUsername (username) {
  localStorage.setItem('username', username)
}
