export { startMemoryGame }

// To be replaced for more appropriate images.
const imageFiles = [
  '/images/memory_flags/america.webp',
  '/images/memory_flags/confederate.png',
  '/images/memory_flags/germany.png',
  '/images/memory_flags/happy.jpg',
  '/images/memory_flags/iceland.webp',
  '/images/memory_flags/poland.png',
  'images/memory_flags/pirate.png',
  '/images/memory_flags/north_korea.svg'
]

/**
 * Start the memory game with the given number of rows and columns.
 * @param {*} rows The number of rows in the game board.
 * @param {*} cols The number of columns in the game board
 * @param {*} container The container where the game will be rendered.
 */
function startMemoryGame (rows = 4, cols = 4, container) {
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
    tile.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleTileClick(tile)
    })
  })

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
      checkMatch()
    }
  }

  /**
   * Check if the two flipped tiles match.
   */
  function checkMatch () {
    const firstImageSrc = firstTile.dataset.imageSrc
    const secondImageSrc = secondTile.dataset.imageSrc

    // Check if the numbers match
    if (firstImageSrc === secondImageSrc) {
      matchedPairs++ // Increment the matched pairs
      firstTile = null // Reset the first tile
      secondTile = null // Reset the second tile

      if (matchedPairs === totalTiles / 2) {
        setTimeout(() => alert(`You won! Attempts: ${attempts}`), 500) // Display a winning message
      }
    } else {
      // If the numbers don't match, flip the tiles back after a delay.
      setTimeout(() => {
        firstTile.classList.remove('flipped')
        secondTile.classList.remove('flipped')
        firstTile = null
        secondTile = null
      }, 1000)
    }
  }
}
