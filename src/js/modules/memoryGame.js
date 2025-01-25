export { initializeMemoryGame }

// To be replaced for more appropriate images.
const imageFiles = [
  '/images/memory_flags/america.webp',
  '/images/memory_flags/confederate.png',
  '/images/memory_flags/germany.png',
  '/images/memory_flags/happy.jpg',
  '/images/memory_flags/iceland.webp',
  '/images/memory_flags/poland.png',
  'images/memory_flags/pirate.png',
  '/images/memory_flags/sweden.webp'
]

/**
 * Initialize the memory game with the dropdown menu to select the board size.
 * @param {*} container - The container where the game will be rendered.
 * @param {*} statusPanel - The status panel where the game status will be displayed.
 */
function initializeMemoryGame (container, statusPanel) {
  // Clear any existing content
  container.innerHTML = ''
  statusPanel.style.visibility = 'hidden'

  // Create and display the welcome message
  const welcomeMessage = document.createElement('p')
  welcomeMessage.textContent = 'Welcome to the Memory Game! Please select the board size to start:'
  container.appendChild(welcomeMessage)

  // Create the dropdown menu for board size
  const dropdown = document.createElement('select')
  dropdown.id = 'boardSize'
  const sizes = ['2x2', '2x4', '4x4']
  sizes.forEach(size => {
    const option = document.createElement('option')
    option.value = size
    option.textContent = size
    dropdown.appendChild(option)
  })
  container.appendChild(dropdown)

  // Create the "Start Game" button
  const startButton = document.createElement('button')
  startButton.textContent = 'Start Game'
  container.appendChild(startButton)

  // Handle the "Start Game" button click event
  startButton.addEventListener('click', () => {
    const [rows, cols] = dropdown.value.split('x').map(Number)
    startMemoryGame(rows, cols, container, statusPanel)
  })
}

/**
 * Start the memory game with the given number of rows and columns.
 * @param {*} rows The number of rows in the game board.
 * @param {*} cols The number of columns in the game board
 * @param {*} container The container where the game will be rendered.
 * @param {*} statusPanel The status panel where the game status will be displayed.
 */
function startMemoryGame (rows = 4, cols = 4, container, statusPanel) {
  statusPanel.style.visibility = 'visible' // Show the status panel
  const totalTiles = rows * cols // Calculate the total number of tiles
  // Check if the total number of tiles is even
  // They have to be even since we always need pairs of tiles.
  if (totalTiles % 2 !== 0) {
    console.error('The board must have an even number of tiles.')
    return
  }

  // Create the game board html structure.
  // Note to self for reference: https://www.w3schools.com/css/tryit.asp?filename=trycss_grid
  container.innerHTML = '' // Clear any existing game content
  container.className = 'game-board'
  container.style.gridTemplateRows = `repeat(${rows}, 1fr)` // Style the grid rows
  container.style.gridTemplateColumns = `repeat(${cols}, 1fr)` // Style the grid columns

  // Create the game array with the required number of pairs
  const images = imageFiles.slice(0, totalTiles / 2) // Take only the required number of pairs
  const gameArray = [...images, ...images] // Duplicate the images to create pairs
  gameArray.sort(() => Math.random() - 0.5) // Shuffle the array

  let firstTile = null // Initialize the first tile
  let secondTile = null // Initialize the second tile
  let attempts = 0 // Initialize the number of attempts
  let matchedPairs = 0 // Initialize the number of matched pairs
  const startTime = Date.now()

  // Create the tiles
  const tiles = []
  // render the game tiles
  gameArray.forEach((imageSrc, index) => {
    // Create the tile element for each image in the gameArray.
    const tile = document.createElement('div')
    tile.className = 'tile'
    tile.dataset.imageSrc = imageSrc
    tile.dataset.index = index

    // Create the front face of the tile
    const frontFace = document.createElement('img')
    frontFace.src = imageSrc
    frontFace.className = 'front-face'
    frontFace.alt = 'Memory Tile'

    // Create the element that represenents the back face of the tile.
    const backFace = document.createElement('div')
    backFace.className = 'back-face'
    backFace.innerText = '?' // Placeholder for the back face

    tile.appendChild(frontFace)
    tile.appendChild(backFace)
    container.appendChild(tile)

    // Add event listeners for tile clicks and keyboard navigation
    tile.tabIndex = 0 // Make it focusable for keyboard navigation
    tile.addEventListener('click', () => handleTileClick(tile))
    // Not sure yet about the keyboard navigation!
    // Keyboard navigation state
    tile.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleTileClick(tile)
    })
    tiles.push(tile) // Add the tile to the tiles array
  })

  const gameWindow = container.closest('.custom-window')
  const timerInterval = setInterval(updateStatusPanel, 1000)

  let currentIndex = 0 // Initialize the current index for keyboard navigation
  tiles[currentIndex].focus() // Focus on the first tile

  /**
   * Handle the click event on a tile.
   * @param {HTMLElement} tile Tile element that was clicked on the gameboard.
   */
  function handleTileClick (tile) {
    if (firstTile && secondTile) return // Wait for unmatched tiles to be hidden

    tile.classList.add('flipped') // Add the flipped class to the tile for styling efects.

    // Check if the first tile has been set
    if (!firstTile) {
      firstTile = tile
      // Check if the second tile has been set
    } else if (tile !== firstTile) {
      secondTile = tile
      attempts++ // Increment the number of attempts
      updateStatusPanel() // Update the status panel
      checkMatch()
    }
  }

  /**
   * Check if the two flipped tiles match.
   */
  function checkMatch () {
    const firstImageSrc = firstTile.dataset.imageSrc
    const secondImageSrc = secondTile.dataset.imageSrc

    // Check if the tiles match
    if (firstImageSrc === secondImageSrc) {
      matchedPairs++ // Increment the matched pairs

      setTimeout(() => {
        firstTile.style.visibility = 'hidden' // Hide the first tile
        secondTile.style.visibility = 'hidden' // Hide the second tile
        firstTile = null // Reset the first tile
        secondTile = null // Reset the second tile

        if (matchedPairs === totalTiles / 2) {
          clearInterval(timerInterval)
          setTimeout(() => {
            updateStatusPanel(true)
          }, 500) // Display a winning message
        }
      }, 800)
    } else {
      // If the tiles don't match, flip them back after a delay
      setTimeout(() => {
        firstTile.classList.remove('flipped')
        secondTile.classList.remove('flipped')
        firstTile = null
        secondTile = null
      }, 1000)
    }
  }

  /**
   * Update the status panel with the number of attempts and time elapsed.
   * @param {boolean} gameEnded Whether the game has ended or not.
   */
  function updateStatusPanel (gameEnded = false) {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000)
    statusPanel.innerHTML = `
      <p>Attempts: ${attempts}</p>
      <p>Time: ${elapsedTime} seconds</p>
    `

    if (gameEnded) {
      statusPanel.innerHTML += '<p>Game Over! Congratulations!</p>'
    }
  }

  /**
   * Handle keyboard navigation for the game tiles.
   * @param {*} event The keydown event object.
   */
  function handleKeyboardNavigation (event) {
    const { key } = event
    const totalTiles = tiles.length

    // Allow browser shortcuts
    if (event.ctrlKey || event.altKey || event.metaKey || ['F12', 'F5'].includes(key)) {
      return
    }

    // Prevent default behavior to stop it from affecting other UI elements like headers
    event.preventDefault()

    // Move based on the arrow key pressed
    if (key === 'ArrowUp') {
      // Move up by subtracting cols
      if (currentIndex >= cols) {
        currentIndex -= cols
      }
    } else if (key === 'ArrowDown') {
      // Move down by adding cols
      if (currentIndex + cols < totalTiles) {
        currentIndex += cols
      }
    } else if (key === 'ArrowLeft') {
      // Move left by subtracting 1, but ensure it doesnt move to a tile in a previous row
      if (currentIndex % cols !== 0) {
        currentIndex -= 1
      }
    } else if (key === 'ArrowRight') {
      // Move right by adding 1, but ensure it donesn't move to a tile in the next row
      if (currentIndex % cols !== cols - 1) {
        currentIndex += 1
      }
    }
    // Focus the new tile after updating the index
    tiles[currentIndex].focus()
  }

  // Listen for arrow key presses to navigate the tiles
  document.addEventListener('keydown', handleKeyboardNavigation)

  /**
   * Add or remove keyboard navigation when the game window gains or loses focus.
   * @param {boolean} enable - Whether to enable or disable navigation.
   */
  function toggleKeyboardNavigation (enable) {
    if (enable) {
      document.addEventListener('keydown', handleKeyboardNavigation)
    } else {
      document.removeEventListener('keydown', handleKeyboardNavigation)
    }
  }

  // Attach event listeners to manage focus and keyboard navigation
  gameWindow.addEventListener('focusin', () => toggleKeyboardNavigation(true))
  gameWindow.addEventListener('focusout', () => toggleKeyboardNavigation(false))
  updateStatusPanel() // Initialize status panel immediately

  // Clean up event listeners when the game is closed
  const closeButton = gameWindow.querySelector('.close-button')
  closeButton.addEventListener('click', () => {
    clearInterval(timerInterval)
    toggleKeyboardNavigation(false)
  })
}
