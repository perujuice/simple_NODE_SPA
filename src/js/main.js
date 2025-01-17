import * as memoryGame from './modules/memoryGame.js'
import { ChatApp } from './modules/chat.js'
import { QuizGame } from './modules/quizGame.js'

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

  memoryGameIcon.addEventListener('click', () => openWindow('Memory Game', '/images/memory.png'))
  chatIcon.addEventListener('click', () => openWindow('Chat', '/images/chat.png'))
  customAppIcon.addEventListener('click', () => openWindow('Quiz Game', '/images/quiz.webp'))
}

/**
 * Open a new window with the given app name.
 * @param {string} appName - The name of the app to open.
 * @param {string} appIcon - The icon of the app to open.
 */
function openWindow (appName, appIcon) {
  const newWindow = document.createElement('div')
  newWindow.draggable = true
  newWindow.className = 'custom-window'
  newWindow.id = `window-${++windowCounter}`// Assign a unique ID to make sure the windows are unique.

  newWindow.innerHTML = `
    <header class="window-header">
        <img src="${appIcon}" alt="${appName}" class="window-logo">
        <span class="window-title">${appName}</span>
        <button class="close-button">X</button>
    </header>
    <div class="window-content"> </div>
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

  // Load the app based on the app name
  if (appName === 'Memory Game') {
    const memoryGameContainer = document.createElement('div')
    const statusPanel = document.createElement('div')
    statusPanel.className = 'status-panel'

    memoryGameContainer.className = 'memory-game-container'
    newWindow.querySelector('.window-content').appendChild(memoryGameContainer)
    newWindow.querySelector('.window-content').appendChild(statusPanel)

    setTimeout(() => memoryGame.startMemoryGame(4, 4, memoryGameContainer, statusPanel), 0)
    // Lod the chat app based on the app name.
  } else if (appName === 'Chat') {
    const chatContainer = document.createElement('div')
    chatContainer.className = 'chat-container'
    newWindow.querySelector('.window-content').appendChild(chatContainer)

    // Create the ChatApp instance for this window
    const chat = new ChatApp(chatContainer)
    chat.displayMessages()
  } else if (appName === 'Quiz Game') {
    const quizGameContainer = document.createElement('div')
    quizGameContainer.className = 'quiz-game-container'
    newWindow.querySelector('.window-content').appendChild(quizGameContainer)

    const quizGame = new QuizGame(quizGameContainer)
    quizGame.loadQuiz()
  }
}

/**
 * Add drag and drop handlers to the given window.
 * @param {HTMLElement} newWindow - The window to add drag and drop handlers to.
 */
function addDragAndDropHandlers (newWindow) {
  let offsetX = 0 // default value
  let offsetY = 0 // default value

  // Focus the window when it's clicked and bring it to the front
  newWindow.addEventListener('click', () => {
    bringWindowToFront(newWindow)
  })

  newWindow.addEventListener('dragstart', (event) => {
    const style = window.getComputedStyle(newWindow, null)
    offsetX = parseInt(style.left, 10) - event.clientX
    offsetY = parseInt(style.top, 10) - event.clientY
    event.dataTransfer.setData('text/plain', `${offsetX},${offsetY}`)
    event.dataTransfer.effectAllowed = 'move'

    bringWindowToFront(newWindow)

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

/**
 * Bring the window to the front by adjusting its z-index.
 * @param {HTMLElement} windowElement - The window element to bring to the front.
 */
function bringWindowToFront (windowElement) {
  // Set the highest z-index value to bring this window to the front
  const allWindows = document.querySelectorAll('.custom-window')
  let highestZIndex = 0

  // Loop through all windows to find the highest z-index
  allWindows.forEach((windowElement) => {
    const currentZIndex = parseInt(window.getComputedStyle(windowElement).zIndex, 10)
    highestZIndex = Math.max(highestZIndex, currentZIndex)
  })

  // Set the z-index of the clicked or dragged window to the highest + 1 to bring it to the front
  windowElement.style.zIndex = highestZIndex + 1
}
