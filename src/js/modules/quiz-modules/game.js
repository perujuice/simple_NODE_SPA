// /modules/quiz-modules/Game.js
import * as Fetch from './Fetch.js'
import * as UIHelper from './UIHelper.js'

/**
 * Start the game and return the server response.
 * @returns {object} The server response.
 */
export async function startGame () {
  try {
    const response = await Fetch.get('https://courselab.lnu.se/quiz/question/1')
    const questionText = await Fetch.getQuestion(response)

    // Display the first question
    const questionElement = document.getElementById('question')
    questionElement.innerHTML = `Question 1: ${questionText}`

    return response
  } catch (error) {
    console.error('Failed to start game:', error)
    throw error
  }
}

/**
 * Handle the answer submission and return the response.
 * @param {string} answer The user's answer.
 * @param {string} nextURL The next question URL.
 * @param {string} nickname The user's nickname.
 * @returns {object} The server response.
 */
export async function handleAnswerSubmission (answer, nextURL, nickname) {
  try {
    console.log('Submitting answer:', answer)
    const response = await Fetch.post(nextURL, { answer })

    // Display feedback for the submitted answer
    displayAnswerMessage(response)

    if (response.status === 200 && !response.data.nextURL) {
      // Game is complete
      const endTime = new Date()
      const timeTaken = Math.round((endTime - window.startTime) / 1000)
      updateHighScores(nickname, timeTaken)

      const questionElement = document.getElementById('question')
      if (questionElement) {
        questionElement.innerHTML = `Congratulations ${nickname}! You completed the game in ${timeTaken} seconds.`
        console.log(`Congratulations ${nickname}! You completed the game in ${timeTaken} seconds.`)
      }

      displayEndGameButtons()
    }

    return response
  } catch (error) {
    console.error('Failed to submit answer:', error)
    throw error
  }
}

/**
 * Display the high scores from localStorage.
 */
export function displayHighScores () {
  const highScores = getHighScores()
  const highScoreList = document.getElementById('high-scores-list')
  if (highScoreList) {
    highScoreList.innerHTML = highScores
      .map((score, index) => `<li>${index + 1}. ${score.nickname}: ${score.time}s</li>`)
      .join('')
  }
}

/**
 * Display buttons for restarting the game or viewing high scores.
 */
export function displayEndGameButtons () {
  const buttonContainer = UIHelper.clearContainer('button-container')

  // Add restart and high scores buttons
  const restartButton = UIHelper.createButton('Restart Game', 'button', () => location.reload())
  const highScoresButton = UIHelper.createButton('View High Scores', 'button', displayHighScores)

  buttonContainer.appendChild(restartButton)
  buttonContainer.appendChild(highScoresButton)
}

/**
 * Get high scores from localStorage.
 * @returns {Array} The high scores array.
 */
function getHighScores () {
  return JSON.parse(localStorage.getItem('highScores')) || []
}

/**
 * Update high scores and save them to localStorage.
 * @param {string} nickname The user's nickname.
 * @param {number} timeTaken The time taken to complete the game.
 */
function updateHighScores (nickname, timeTaken) {
  const highScores = getHighScores()
  highScores.push({ nickname, time: timeTaken })
  highScores.sort((a, b) => a.time - b.time) // Sort by time (ascending)

  if (highScores.length > 5) {
    highScores.pop() // Keep only the top 5 scores
  }

  localStorage.setItem('highScores', JSON.stringify(highScores))
}

/**
 * Display a message for the answer feedback.
 * @param {object} response The server response.
 */
function displayAnswerMessage (response) {
  const message = Fetch.getAnswerMessage(response)
  const questionElement = document.getElementById('question')
  if (questionElement) {
    questionElement.innerHTML = message
  }
}
