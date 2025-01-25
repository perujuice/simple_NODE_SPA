import * as Time from './quiz-modules/timer.js'
import * as Game from './quiz-modules/Game.js'
import * as UIHelper from './quiz-modules/UIHelper.js'
import User from './quiz-modules/User.js'
import * as Fetch from './quiz-modules/Fetch.js'

/**
 * Class representing the Quiz Game.
 */
export class QuizGame {
  constructor (container) {
    this.container = container // Parent container for the game
    this.user = new User()
    this.state = {
      gameStarted: false,
      nextURL: ''
    }
    this.timerInterval = null
  }

  /**
   * Load the quiz game.
   */
  loadQuiz () {
    console.log(this.container)
    const header = UIHelper.createHeader('Welcome to the Quiz Game!', 'quiz-header')
    const questionContainer = UIHelper.createDiv('question-container')
    const inputContainer = UIHelper.createDiv('input-container')
    const buttonContainer = UIHelper.createDiv('button-container')
    const timerElement = UIHelper.createDiv('timer-container')

    const nickNameInput = UIHelper.createInputField('nick-name', 'Enter your nickname')
    const startButton = UIHelper.createButton('Start Quiz', 'quiz-button', () => this.startQuiz())
    const highScoresButton = UIHelper.createButton('View High Scores', 'quiz-button', () => Game.displayHighScores(this.container))
    const timer = UIHelper.createDiv('timer')
    timerElement.appendChild(timer)

    inputContainer.appendChild(nickNameInput)
    buttonContainer.appendChild(startButton)
    buttonContainer.appendChild(highScoresButton)

    UIHelper.clearAndAppend(this.container, [
      header,
      questionContainer,
      inputContainer,
      buttonContainer,
      timerElement
    ])
  }

  /**
   * Start the quiz game.
   */
  /**
   * Start the quiz game.
   */
  async startQuiz () {
    if (this.state.gameStarted) return
    this.state.gameStarted = true

    // Hide the start and high scores buttons
    const buttonContainer = this.container.querySelector('.button-container')
    const startButton = buttonContainer.querySelector('.quiz-button')
    const highScoresButton = buttonContainer.querySelector('.quiz-button:last-child')
    UIHelper.hideElement(startButton)
    UIHelper.hideElement(highScoresButton)

    this.user.name = UIHelper.getInputValue(this.container, 'nick-name')
    UIHelper.updateHeaderText(this.container, `Welcome ${this.user.name}!`)

    // Clear the input container and prepare the question display
    const questionContainer = this.container.querySelector('.question-container')
    UIHelper.clearContainer(questionContainer) // Ensure the container is empty

    // Dynamically create the question element within the scoped container
    const questionElement = UIHelper.createDiv('question')
    questionContainer.appendChild(questionElement)

    const response = await Game.startGame(this.container) // Fetch the first question
    this.state.nextURL = Fetch.getNextUrl(response)

    // Update question text
    questionElement.innerHTML = Fetch.getQuestion(response)

    // Create an input field and submit button for the answer
    const inputContainer = UIHelper.clearContainer(this.container, 'input-container')
    const answerInput = UIHelper.createInputField('answer-input', 'Enter your answer')
    inputContainer.appendChild(answerInput)

    const submitButton = UIHelper.createButton('Submit Answer', 'quiz-button', async () => {
      const answer = UIHelper.getSelectedAnswer(inputContainer, 'alternative') || answerInput.value
      const result = await Game.handleAnswerSubmission(answer, this.state.nextURL, this.user.name, this.container)

      if (result.status === 200) {
      // Stop the timer when the answer is correct
        if (this.timerInterval) Time.stopTimer(this.timerInterval, this.container)

        this.state.nextURL = Fetch.getNextUrl(result.data)

        if (this.state.nextURL) {
        // Prepare for the next question
          UIHelper.hideElement(submitButton)
          UIHelper.hideElement(answerInput)
          const nextButton = UIHelper.createButton('Next Question', 'quiz-button', async () => {
            UIHelper.hideElement(nextButton)
            submitButton.style.display = 'block'
            answerInput.value = ''
            await this.loadNextQuestion(inputContainer, answerInput, submitButton)
          })
          inputContainer.appendChild(nextButton)
        } else {
        // End the game if no nextURL is provided
          this.endGame('Congratulations! You have completed the quiz.')
        }
      } else {
        this.endGame('Wrong!!! No more questions for you! 😠')
      }
    })

    inputContainer.appendChild(submitButton)

    // Start the timer
    this.timerInterval = Time.startTimer(10, this.container, () => this.endGame('Time’s up! Game over.'))
  }

  /**
   * Load the next question.
   * @param {HTMLElement} inputContainer - The input container.
   * @param {HTMLElement} answerInput - The answer input field.
   * @param {HTMLElement} submitButton - The submit button.
   */
  async loadNextQuestion (inputContainer, answerInput, submitButton) {
    console.log('Loading next question...')
    console.log('Next URL at start of loadNextQuestion:', this.state.nextURL)

    const response = await Fetch.get(this.state.nextURL) // Fetch the next question
    const questionText = Fetch.getQuestion(response) // Extract the question text

    const questionElement = this.container.querySelector('.question')
    questionElement.innerHTML = questionText // Display the question

    this.state.nextURL = Fetch.getNextUrl(response) // Update the next URL

    // Clear previous inputs
    UIHelper.hideElement(answerInput)
    inputContainer.innerHTML = '' // Clear previous alternatives
    inputContainer.appendChild(answerInput) // Reattach the answer input field
    inputContainer.appendChild(submitButton) // Ensure the submit button is still present

    if (response.alternatives) {
      // Display alternatives for the question
      this.displayAlternatives(response.alternatives, inputContainer)
      answerInput.style.display = 'none' // Hide text input when alternatives are displayed
    } else {
      // Handle free-text answer input
      answerInput.value = ''
      answerInput.placeholder = 'Enter your answer'
      answerInput.style.display = 'block' // Show text input for free-text questions
    }

    // Rebind the submit button for the current question
    submitButton.onclick = async () => {
      // Determine the answer based on question type
      const answer =
        UIHelper.getSelectedAnswer(inputContainer, 'alternative') || answerInput.value

      console.log('Answer:', answer)
      console.log('Submitting to URL:', this.state.nextURL)

      const result = await Game.handleAnswerSubmission(answer, this.state.nextURL, this.user.name, this.container)

      if (this.timerInterval) Time.stopTimer(this.timerInterval, this.container) // Stop the timer

      if (result.status === 200) {
        const alternativesContainer = inputContainer.querySelector('.alternatives-container')
        if (alternativesContainer) UIHelper.hideElement(alternativesContainer)

        // Display the result message
        questionElement.innerHTML = Fetch.getAnswerMessage(result)

        // Update the nextURL for the next question
        this.state.nextURL = Fetch.getNextUrl(result.data)

        if (this.state.nextURL) {
          // Show a "Next Question" button
          UIHelper.hideElement(submitButton)
          UIHelper.hideElement(answerInput)
          const nextButton = UIHelper.createButton('Next Question', 'quiz-button', async () => {
            UIHelper.hideElement(nextButton) // Hide the next button after clicking
            submitButton.style.display = 'block' // Show the submit button
            await this.loadNextQuestion(inputContainer, answerInput, submitButton)
          })
          inputContainer.appendChild(nextButton)
        } else {
          // End the game if no nextURL is provided
          UIHelper.hideElement(submitButton)
        }
      } else {
        this.endGame('Wrong!!!! No more questions for you! 😠')
      }
    }

    // Restart the timer for the new question
    this.timerInterval = Time.startTimer(10, this.container, () => this.endGame('Time’s up! Game over.'))
  }

  /**
   * Display alternatives as radio buttons.
   * @param {object} alternatives - The alternatives to display.
   * @param {HTMLElement} inputContainer - The input container.
   * @param {HTMLElement} submitButton - The submit button.
   */
  displayAlternatives (alternatives, inputContainer, submitButton) {
    // Create a container for alternatives to avoid clearing the entire inputContainer
    const alternativesContainer = inputContainer.querySelector('.alternatives-container') || UIHelper.createDiv('alternatives-container')
    alternativesContainer.innerHTML = '' // Clear only alternatives content

    for (const [key, value] of Object.entries(alternatives)) {
      const label = document.createElement('label')
      const radio = document.createElement('input')
      radio.type = 'radio'
      radio.name = 'alternative'
      radio.value = key
      label.appendChild(radio)
      label.appendChild(document.createTextNode(value))
      alternativesContainer.appendChild(label)
      alternativesContainer.appendChild(document.createElement('br'))
    }

    // Append the alternativesContainer to the inputContainer if not already present
    if (!inputContainer.contains(alternativesContainer)) {
      inputContainer.appendChild(alternativesContainer)
    }
  }

  /**
   * End the game and display a message.
   * @param {string} message The message to display.
   */
  endGame (message) {
    // Stop the timer and clear interval reference
    if (this.timerInterval) {
      Time.stopTimer(this.timerInterval, this.container)
    }

    this.timerInterval = null
    console.log('Game over:', message)
    const parent = this.container.closest('.window-content')
    const qContainer = UIHelper.clearContainer(parent, 'quiz-game-container')
    const header = UIHelper.createHeader('High Scores', 'quiz-header')
    qContainer.appendChild(header)
    header.innerHTML = message

    Game.displayEndGameButtons(qContainer)
  }
}
