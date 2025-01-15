// Select icons from the desktop
const memoryGameIcon = document.getElementById('memory-game-icon')
const chatIcon = document.getElementById('chat-icon')
const customAppIcon = document.getElementById('custom-app-icon')

// Event listeners for icons to open windows
memoryGameIcon.addEventListener('click', () => createWindow('Memory Game'))
chatIcon.addEventListener('click', () => createWindow('Chat'))
// I'll probably just use the A2 quiz game here!
customAppIcon.addEventListener('click', () => createWindow('Quiz Game'))

/**
 * Create a window with the given app name.
 * @param {*} appName dk.
 */
function createWindow (appName) {
  const window = new Window(appName)
  document.body.appendChild(window.element)
}
