// Description: Main entry point for the application.
window.addEventListener('load', main)

let windowCounter = 0 // Counter to assign unique IDs to each window

/**
 * Main entry point for the application.
 */
function main () {
  const memoryGameIcon = document.getElementById('memory-game-icon')
  const chatIcon = document.getElementById('chat-icon')
  const customAppIcon = document.getElementById('custom-app-icon')

  memoryGameIcon.addEventListener('click', () => openWindow('Memory Game'))
  chatIcon.addEventListener('click', () => openWindow('Chat'))
  customAppIcon.addEventListener('click', () => openWindow('Quiz Game'))
}

/**
 * Open a new window with the given app name.
 * @param {String} appName - The name of the app to open.
 */
function openWindow (appName) {
  const newWindow = document.createElement('div')
  newWindow.draggable = true
  newWindow.className = 'custom-window'
  newWindow.id = `window-${++windowCounter}`// Assign a unique ID to make sure the windows are unique.

  newWindow.innerHTML = `
    <header class="window-header">
        <span class="window-title">${appName}</span>
        <button class="close-button">X</button>
    </header>
    <div class="window-content">
        <div class="status-panel">
            <p>Time: very long time!</p>
        </div>
    </div>
  `

  document.body.appendChild(newWindow)

  // Randomize initial position
  const x = Math.random() * (window.innerWidth - 250)
  const y = Math.random() * (window.innerHeight - 300)
  newWindow.style.left = `${x}px`
  newWindow.style.top = `${y}px`

  // Add drag functionality
  addDragAndDropHandlers(newWindow)

  newWindow.querySelector('.close-button').addEventListener('click', () => {
    newWindow.remove()
  })
}

/**
 * Add drag and drop handlers to the given window.
 * @param {HTMLElement} newWindow - The window to add drag and drop handlers to.
 */
function addDragAndDropHandlers (newWindow) {
  let offsetX = 0
  let offsetY = 0

  newWindow.addEventListener('dragstart', (event) => {
    const style = window.getComputedStyle(newWindow, null)
    offsetX = parseInt(style.left, 10) - event.clientX
    offsetY = parseInt(style.top, 10) - event.clientY
    event.dataTransfer.setData('text/plain', `${offsetX},${offsetY}`)
    event.dataTransfer.effectAllowed = 'move'

    console.log('DRAG START')
    console.log(event)
  })

  // Using dragend instead of drop since drop is not fired when dragging outside the window.
  newWindow.addEventListener('dragend', (event) => {
    const offset = event.dataTransfer.getData('text/plain').split(',')
    newWindow.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px'
    newWindow.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px'

    console.log('DRAG END')
    console.log(event)
    event.preventDefault()
  })

  // Prevent default behaviors for drop areas
  document.body.addEventListener('dragover', (event) => event.preventDefault())
  document.body.addEventListener('drop', (event) => event.preventDefault())
}
