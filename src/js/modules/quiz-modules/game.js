// /modules/quiz-modules/Game.js
import * as Fetch from './Fetch.js'
import * as UIHelper from './UIHelper.js'
import { QuizGame } from '../quizGame.js'

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

    // Set the quiz start time
    window.startTime = new Date()

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
      console.log('Time taken:', timeTaken)
      updateHighScores(nickname, timeTaken)

      const questionElement = document.getElementById('Header')
      if (questionElement) {
        questionElement.innerHTML = `Congratulations ${nickname}! You completed the quiz game in ${timeTaken} seconds.`
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
  // Clear the quiz game container
  const qContainer = UIHelper.clearContainer('quiz-game-container')
  const header = UIHelper.createHeader('High Scores')
  qContainer.appendChild(header)
  header.innerHTML = 'High Scores'

  // Retrieve high scores
  const highScores = getHighScores()
  console.log('High scores:', highScores)

  // Create a container for the high score list
  const highScoreListContainer = UIHelper.createDiv('high-score-list-container')
  const highScoreList = document.createElement('ul') // Create a <ul> element for the list
  highScoreList.id = 'high-score-list' // Assign an ID for styling
  highScoreListContainer.appendChild(highScoreList)

  // Populate the high score list
  if (highScores && highScores.length > 0) {
    highScoreList.innerHTML = highScores
      .map(
        (score, index) =>
          `<li class="high-score-item">${index + 1}. ${score.nickname}: ${score.time}s</li>`
      )
      .join('')
  } else {
    // If no scores, display a message
    highScoreList.innerHTML = '<li class="high-score-item">No high scores yet!</li>'
  }

  // Add a button to navigate back to the game
  const backButton = UIHelper.createButton('Back to Game', 'button', () => backToQuiz())

  // Append the high score list container to the question container
  qContainer.appendChild(highScoreListContainer)
  qContainer.appendChild(backButton)
}

/**
 * Navigate back to the quiz game.
 */
function backToQuiz () {
  UIHelper.clearContainer('high-score-list-container')
  const quizGameContainer = document.querySelector('.quiz-game-container')
  const quizGame = new QuizGame(quizGameContainer)
  quizGame.loadQuiz()
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
  console.log('Retrieving high scores')
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
