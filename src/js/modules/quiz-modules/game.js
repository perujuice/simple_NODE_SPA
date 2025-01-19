import * as Fetch from './Fetch.js'
export { displayQuestion, startGame, handleAnswerSubmission, displayAnswerMessage, displayHihgScores, displayAlternatives }

const localStorage = window.localStorage

/**
 * Method to get high scores from local storage.
 * @returns {string} high scores from local storage.
 */
function getHighScores () {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || []
  return highScores
}

/**
 * Method to save high scores to local storage.
 * @param {Array} highScores The high scores to save.
 */
function saveHighScores (highScores) {
  localStorage.setItem('highScores', JSON.stringify(highScores))
}

/**
 * Method to update high scores.
 * @param {string} nickname The nickname of the user.
 * @param {number} timeTaken The time taken to complete the game.
 * @returns {Array} high scores.
 */
function updateHighScores (nickname, timeTaken) {
  const highScores = getHighScores()
  highScores.push({ nickname, time: timeTaken })
  highScores.sort((a, b) => a.time - b.time) // Sort by time (ascending)
  if (highScores.length > 5) highScores.pop() // Keep only the top 5 scores
  saveHighScores(highScores)
  return highScores
}

/**
 * Method to start the game.
 * @returns {JSON} json response.
 */
async function startGame () {
  const response = await Fetch.get('https://courselab.lnu.se/quiz/question/1')
  const question = await Fetch.getQuestion(response)
  const question1 = document.getElementById('question')
  console.log('Question1: ', question)
  question1.innerHTML = `Question 1: ${question}`
  return response
}

/**
 * Method to display the question.
 * @param {string} url The URL of the question.
 * @returns {JSON} json response.
 */
async function displayQuestion (url) {
  const response = await Fetch.get(url)
  const resp1 = await Fetch.getQuestion(response)
  const question = document.getElementById('question')
  question.innerHTML = `Question: ${resp1}`
  return response
}

/**
 * Method to handle the answer submission.
 * @param {*} answer the answer to the question.
 * @param {*} nextURL the URL of the answer.
 * @param {*} startTime the start time of the game.
 * @param {*} nickname the nickname of the user.
 * @returns {JSON} json response.
 */
async function handleAnswerSubmission (answer, nextURL, startTime, nickname) {
  const sendAnswer = await Fetch.post(nextURL, { answer })
  displayAnswerMessage(sendAnswer) // Display the answer message to the user

  // The game is over when there is no nextURL
  if (sendAnswer.status === 200) {
    if (!sendAnswer.data.nextURL) {
      // End of game
      const endTime = new Date()
      const timeTaken = Math.round((endTime - startTime) / 1000)
      updateHighScores(nickname, timeTaken)

      document.getElementById('question').innerHTML = `
                Congratulations ${nickname}! You completed the game in ${timeTaken} seconds.`
      document.getElementById('button-container').innerHTML = `
                <div>
                    <button id="restart-button" class="button">Restart Game</button>
                    <button id="view-high-scores-button" class="button">View High Scores</button>
                </div>
            `
      document.getElementById('restart-button').onclick = () => location.reload()
      document.getElementById('view-high-scores-button').onclick = () => {
        displayHihgScores()
      }

      return sendAnswer
    }
  }

  console.log('SendAnswer.data: ', sendAnswer.data)
  return sendAnswer
}

/**
 * Method to display high scores.
 */
function displayHihgScores () {
  const q = document.getElementById('question')
  const b = document.getElementById('button-container')
  const h = document.getElementById('Header')
  const hContainer = document.getElementById('high-scores-list-container')
  q.style.display = 'none'
  b.style.display = 'none'
  h.innerHTML = 'High Scores'

  const highScores = getHighScores()
  const highScoreList = document.getElementById('high-score-list')
  highScoreList.innerHTML = ''

  highScores.forEach((score, index) => {
    const listItem = document.createElement('li')
    listItem.textContent = `${index + 1}. ${score.nickname}: ${score.time}s`
    highScoreList.appendChild(listItem)
  })

  // Show high scores container
  hContainer.style.display = 'block'

  // Add event listener to the "Back to Quiz" button
  document.getElementById('back-to-quiz-button').onclick = () => {
    location.reload()
  }
}

/**
 * Method to display the answer message.
 * @param {string} response the response to the answer.
 */
function displayAnswerMessage (response) {
  const message = Fetch.getAnswerMessage(response)
  const answerMessage = document.getElementById('question')
  answerMessage.innerHTML = message
}

/**
 *
 * @param {*} alternatives the alternatives
 * @param {*} container the container
 */
/**
 * Display the alternatives to the user.
 * @param {Object} alternatives - The alternatives to display, with keys representing values and values as labels.
 * @param {HTMLElement} container - The container where the alternatives will be displayed.
 */
function displayAlternatives (alternatives, container) {
  const inputContainer = container.querySelector('.input-container') || document.createElement('div')
  inputContainer.className = 'input-container'
  inputContainer.innerHTML = '' // Clear any previous alternatives

  // Create and append each alternative as a radio button
  for (const [key, value] of Object.entries(alternatives)) {
    const label = document.createElement('label')
    const radio = document.createElement('input')
    radio.type = 'radio'
    radio.name = 'alternative'
    radio.value = key

    label.appendChild(radio)
    label.appendChild(document.createTextNode(value))

    inputContainer.appendChild(label)
    inputContainer.appendChild(document.createElement('br')) // Add a line break for better spacing
  }

  if (!container.querySelector('.input-container')) {
    container.appendChild(inputContainer)
  }
}
