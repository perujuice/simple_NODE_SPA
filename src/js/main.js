// Description: Main entry point for the application.
window.addEventListener('load', main)

/**
 * Main entry point for the application.
 */
function main () {
  // Select icons from the desktop
  const memoryGameIcon = document.getElementById('memory-game-icon')
  const chatIcon = document.getElementById('chat-icon')
  const customAppIcon = document.getElementById('custom-app-icon')

  // Event listeners for icons to open windows
  memoryGameIcon.addEventListener('click', () => openWindow('Memory Game'))
  chatIcon.addEventListener('click', () => openWindow('Chat'))
  customAppIcon.addEventListener('click', () => openWindow('Quiz Game'))
}

/**
 * Open a new window with a title and content.
 * @param {string} appName - The name of the application to display in the window title.
 */
function openWindow (appName) {
  const newWindow = document.createElement('div')
  newWindow.draggable = true
  newWindow.className = 'custom-window'
  newWindow.id = appName.toLowerCase().replace(' ', '-')

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
  const x = Math.random() * (window.innerWidth - 350)
  const y = Math.random() * (window.innerHeight - 400)
  newWindow.style.left = `${x}px`
  newWindow.style.top = `${y}px`

  // Add drag functionality
  addDragAndDropHandlers(newWindow)

  // Close button functionality
  newWindow.querySelector('.close-button').addEventListener('click', () => {
    newWindow.remove()
  })
}

/**
 *
 * @param {*} newWindow
 */
function addDragAndDropHandlers (newWindow) {
  const itemArea = document.getElementById(newWindow.id)
  const droppableArea = document.getElementById('drop-area')

  /**
   * The event handler for the dragstart event.
   * @param {Event} event The event object.
   */
  function dragStartHandler (event) {
    const style = window.getComputedStyle(event.target, null)

    // Remember the original position
    event.dataTransfer.setData('text/plain',
      (parseInt(style.getPropertyValue('left'), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue('top'), 10) - event.clientY)
    )

    event.dataTransfer.dropEffect = 'move'

    console.log('DRAG START')
    console.log(event)
  }

  // Attach the event handler to the dragstart event
  itemArea.addEventListener('dragstart', dragStartHandler)

  /**
   *
   * @param {Event} event The event object.
   */
  function dragEndHandler (event) {
    console.log('DRAG END', event)
    // console.log(event)
  }

  itemArea.addEventListener('dragend', dragEndHandler)

  /**
   *
   * @param {Event} event The event object.
   */
  function dropHandler (event) {
    const offset = event.dataTransfer.getData('text/plain').split(',')

    itemArea.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px'
    itemArea.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px'

    console.log('DROP')
    console.log(event)
    event.preventDefault()
  }

  droppableArea.addEventListener('dragenter', (event) => {
    event.preventDefault()
  })
  droppableArea.addEventListener('dragover', (event) => {
    event.preventDefault()
  })
  droppableArea.addEventListener('drop', dropHandler)
}
