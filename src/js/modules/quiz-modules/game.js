import * as Fetch from './Fetch.js'
import * as UIHelper from './UIHelper.js'
import { QuizGame } from '../quizGame.js'

/**
 * Start the game and return the server response.
 * @param {HTMLElement} container The container for this game instance.
 * @returns {object} The server response.
 */
export async function startGame (container) {
  try {
    const response = await Fetch.get('https://courselab.lnu.se/quiz/question/1')
    const questionText = Fetch.getQuestion(response)

    // Display the first question
    const questionElement = container.querySelector('.question')
    questionElement.innerHTML = `Question 1: ${questionText}`

    // Set the quiz start time
    container.dataset.startTime = new Date()

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
 * @param {HTMLElement} container The container for this game instance.
 * @returns {object} The server response.
 */
export async function handleAnswerSubmission (answer, nextURL, nickname, container) {
  try {
    console.log('Submitting answer:', answer)
    const response = await Fetch.post(nextURL, { answer })

    // Display feedback for the submitted answer
    displayAnswerMessage(container, response)

    if (response.status === 200 && !response.data.nextURL) {
      // Game is complete
      const endTime = new Date()
      const startTime = new Date(container.dataset.startTime)
      const timeTaken = Math.round((endTime - startTime) / 1000)
      console.log('Time taken:', timeTaken)
      updateHighScores(nickname, timeTaken)

      const header = container.querySelector('.quiz-header')
      if (header) {
        header.innerHTML = `Congratulations ${nickname}! You completed the quiz game in ${timeTaken} seconds.`
      }

      displayEndGameButtons(container)
    }

    return response
  } catch (error) {
    console.error('Failed to submit answer:', error)
    throw error
  }
}

/**
 * Display the high scores from localStorage.
 * @param {HTMLElement} container The container for this game instance.
 */
export function displayHighScores (container) {
  console.log(container)
  const parent = container.closest('.window-content')
  const qContainer = UIHelper.clearContainer(parent, 'quiz-game-container')
  const header = UIHelper.createHeader('High Scores', 'quiz-header')
  qContainer.appendChild(header)
  header.innerHTML = 'High Scores'

  const highScores = getHighScores()
  console.log('High scores:', highScores)

  const highScoreListContainer = UIHelper.createDiv('high-score-list-container')
  const highScoreList = document.createElement('ul')
  highScoreList.id = 'high-score-list'
  highScoreListContainer.appendChild(highScoreList)

  if (highScores && highScores.length > 0) {
    highScoreList.innerHTML = highScores
      .map((score, index) => `<li class="high-score-item">${index + 1}. ${score.nickname}: ${score.time}s</li>`)
      .join('')
  } else {
    highScoreList.innerHTML = '<li class="high-score-item">No high scores yet!</li>'
  }

  const backButton = UIHelper.createButton('Back to Game', 'button', () => backToQuiz(container))
  container.appendChild(highScoreListContainer)
  container.appendChild(backButton)
}

/**
 * Navigate back to the quiz game.
 * @param {HTMLElement} container The container for this game instance.
 */
function backToQuiz (container) {
  const parent = container.closest('.window-content')
  UIHelper.clearContainer(parent, 'quiz-game-container')
  const quizGame = new QuizGame(container)
  quizGame.loadQuiz()
}

/**
 * Display buttons for restarting the game or viewing high scores.
 * @param {HTMLElement} container The container for this game instance.
 */
export function displayEndGameButtons (container) {
  const buttonContainer = UIHelper.createDiv('button-container')
  const parent = container.closest('.window-content')
  UIHelper.clearContainer(parent, 'button-container')

  const restartButton = UIHelper.createButton('Restart Game', 'button', () => {
    UIHelper.clearContainer(parent, 'quiz-game-container')
    const quizGame = new QuizGame(container)
    if (quizGame) quizGame.loadQuiz()
  })
  const highScoresButton = UIHelper.createButton('View High Scores', 'button', () => displayHighScores(container))

  buttonContainer.appendChild(restartButton)
  buttonContainer.appendChild(highScoresButton)
  container.appendChild(buttonContainer)
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
  highScores.sort((a, b) => a.time - b.time)

  if (highScores.length > 5) {
    highScores.pop() // Keep only the top 5 scores
  }

  localStorage.setItem('highScores', JSON.stringify(highScores))
}

/**
 * Display a message for the answer feedback.
 * @param {HTMLElement} container The container for this game instance.
 * @param {object} response The server response.
 */
function displayAnswerMessage (container, response) {
  const message = Fetch.getAnswerMessage(response)
  const questionElement = container.querySelector('.question')
  if (questionElement) {
    questionElement.innerHTML = message
  }
}
