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

  // render the game tiles
  gameArray.forEach((number, index) => {
    const tile = document.createElement('div')
    tile.className = 'tile'
    tile.dataset.number = number
    tile.dataset.index = index

    const frontFace = document.createElement('div')
    frontFace.className = 'front-face'
    frontFace.innerText = number

    const backFace = document.createElement('div')
    backFace.className = 'back-face'
    backFace.innerText = '?' // Placeholder for the back face

    tile.appendChild(frontFace)
    tile.appendChild(backFace)
    container.appendChild(tile)
  })
}
