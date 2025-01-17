import * as Fetch from './quiz-modules/Fetch.js'
import * as Time from './quiz-modules/timer.js'
import * as Game from './quiz-modules/Game.js'
import User from './quiz-modules/User.js'

export class QuizGame {
  constructor (container) {
    this.container = container // The parent container for the quiz game
    this.user = new User()
    this.nextURL = ''
    this.timerInterval = null
    this.startTime = null
    this.gameStarted = false
  }

  /**
   * Load the quiz game UI.
   */
  loadQuiz () {
    const header = document.createElement('h1')
    header.id = 'Header'
    header.textContent = 'Welcome to the Quiz Game!'
    this.container.appendChild(header)

    const inputContainer = document.createElement('div')
    inputContainer.className = 'input-container'
    this.container.appendChild(inputContainer)

    const nickNameInput = document.createElement('input')
    nickNameInput.type = 'text'
    nickNameInput.id = 'nick-name'
    nickNameInput.placeholder = 'Enter your nickname'
    inputContainer.appendChild(nickNameInput)

    const startButton = document.createElement('button')
    startButton.id = 'quiz-button'
    startButton.textContent = 'Start Quiz'
    this.container.appendChild(startButton)

    const highScoresButton = document.createElement('button')
    highScoresButton.id = 'high-scores-button'
    highScoresButton.textContent = 'View High Scores'
    this.container.appendChild(highScoresButton)

    startButton.addEventListener('click', () => this.startQuiz())
    highScoresButton.addEventListener('click', () => Game.displayHighScores())
  }

  /**
   * Start the quiz game.
   */
  async startQuiz () {
    if (this.gameStarted) return
    this.gameStarted = true

    const input = this.container.querySelector('#nick-name')
    this.user.name = input.value

    const inputContainer = this.clearInputContainer()
    this.displayWelcomeMessage()

    const response = await Game.startGame()
    this.nextURL = await Fetch.getNextUrl(response)

    const answerInput = this.createAnswerInputField(inputContainer)

    // Replace Start Quiz button functionality
    const startButton = this.container.querySelector('#quiz-button')
    startButton.textContent = 'Submit Answer'

    // Start the timer
    if (this.timerInterval) Time.stopTimer(this.timerInterval)
    this.timerInterval = this.timeUpCallback()

    this.startTime = new Date()

    startButton.onclick = async () => {
      const selectedAlternative = this.container.querySelector('input[name="alternative"]:checked')
      const answer = selectedAlternative ? selectedAlternative.value : answerInput.value

      const result = await Game.handleAnswerSubmission(answer, this.nextURL, this.startTime, this.user.name)
      this.nextURL = result.data.nextURL

      if (result.status === 200) {
        console.log('Correct answer')
        if (!this.nextURL) {
          console.log('End of game')
        }
      } else {
        console.log('Incorrect answer')
        this.endGame()
      }
    }
  }

  clearInputContainer () {
    const inputContainer = this.container.querySelector('.input-container')
    inputContainer.innerHTML = ''
    return inputContainer
  }

  /**
   * Display a welcome message.
   */
  displayWelcomeMessage () {
    const header = this.container.querySelector('#Header')
    header.textContent = `Welcome ${this.user.name}!`
  }

  createAnswerInputField (inputContainer) {
    const answerInput = document.createElement('input')
    answerInput.type = 'text'
    answerInput.id = 'answer-input'
    answerInput.placeholder = 'Enter your answer'
    inputContainer.appendChild(answerInput)
    return answerInput
  }

  timeUpCallback () {
    return Time.startTimer(10, () => {
      this.endGame('Time’s up! Game over.')
    })
  }

  endGame (message = 'Game over.') {
    const header = this.container.querySelector('#Header')
    header.textContent = message

    const restartButton = document.createElement('button')
    restartButton.textContent = 'Restart Game'
    restartButton.classList.add('button')
    restartButton.onclick = () => location.reload()
    this.container.appendChild(restartButton)

    const startButton = this.container.querySelector('#quiz-button')
    startButton.style.display = 'none'
  }
}
