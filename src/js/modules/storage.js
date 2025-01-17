/**
 *
 * @returns {string} - The username stored in local storage.
 */
export function getUsername () {
  return localStorage.getItem('username')
}

/**
 *
 * @param {*} username - The username to store.
 */
export function setUsername (username) {
  localStorage.setItem('username', username)
}

/**
 * Store a message in local storage.
 * @returns {Array} - The messages stored in local storage.
 */
export function getMessages () {
  console.log('getMessages from local storage')
  return JSON.parse(localStorage.getItem('chatMessages')) || []
}

/**
 * Store a message in local storage.
 * @param {*} messages - The messages to store.
 */
export function setMessages (messages) {
  console.log('setMessages to local storage')
  localStorage.setItem('chatMessages', JSON.stringify(messages))
}
