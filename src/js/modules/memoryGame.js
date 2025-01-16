export { startMemoryGame }

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

  // Create an array of duplicate numbers from 0 to totalTiles / 2
  const gameArray = []
  for (let i = 0; i < totalTiles / 2; i++) {
    gameArray.push(i)
    gameArray.push(i)
  }

  // Shuffle the array to randomize the tile positions
  gameArray.sort(() => Math.random() - 0.5) // Producing numbers between -0.5 and 0.5

  let firstTile = null // Initialize the first tile
  let secondTile = null // Initialize the second tile

  // render the game tiles
  gameArray.forEach((number, index) => {
    // Create the tile element for each number in the gameArray.
    const tile = document.createElement('div')
    tile.className = 'tile'
    tile.dataset.number = number
    tile.dataset.index = index

    // Create the front face of the tile
    const frontFace = document.createElement('div')
    frontFace.className = 'front-face'
    frontFace.innerText = number

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
      checkMatch()
    }
  }

  /**
   * Check if the two flipped tiles match.
   */
  function checkMatch () {
    const firstNumber = firstTile.dataset.number
    const secondNumber = secondTile.dataset.number

    // Check if the numbers match
    if (firstNumber === secondNumber) {
      firstTile = null // Reset the first tile
      secondTile = null // Reset the second tile
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
