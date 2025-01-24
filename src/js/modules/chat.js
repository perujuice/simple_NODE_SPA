import { WebSocketHandler } from './websocket.js'
import EmojiButton from 'emoji-button'

export class ChatApp {
  /**
   * Create a new chat application.
   * @param {HTMLElement} container - The container element for the chat.
   */
  constructor (container) {
    this.container = container
    this.websocket = new WebSocketHandler('wss://courselab.lnu.se/message-app/socket') // Independent WebSocket instance
    this.username = null // Username will be set after the prompt

    this.messages = [] // Maintain independent messages for this instance

    this.initUI() // Initialize the chat UI

    this.websocket.connect() // Connect to the WebSocket
    this.receiveMessage = this.receiveMessage.bind(this) // Bind the message handler to this instance
    this.websocket.onMessage = this.receiveMessage // Register as a listener

    this.showUsernamePrompt() // Show the username prompt

    // Clean up when the window is closed
    this.container.closest('.custom-window').querySelector('.close-button').addEventListener('click', () => {
      this.websocket.socket.close() // Close WebSocket connection for this instance
    })
  }

  /**
   * Show a username prompt inside the chat container.
   */
  showUsernamePrompt () {
    const window = this.container.closest('.custom-window')
    window.style.vistibility = 'hidden' // Hide the chat window

    const modal = document.createElement('div')
    modal.className = 'username-modal'

    const promptText = document.createElement('p')
    promptText.textContent = 'Enter your username to start chatting:'

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Enter your username'

    const submitButton = document.createElement('button')
    submitButton.textContent = 'Submit'

    modal.appendChild(promptText)
    modal.appendChild(input)
    modal.appendChild(submitButton)
    document.body.appendChild(modal)

    // Handle saved username
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      promptText.textContent = `Use saved username: "${savedUsername}"? Or enter a new one.`
      input.value = savedUsername
    }

    // Handle submit
    submitButton.addEventListener('click', () => {
      const username = input.value.trim()
      if (username) {
        this.username = username
        localStorage.setItem('username', username) // Save the username
        modal.remove() // Remove the modal
        window.style.vistibility = 'visible' // Show the chat window
      } else {
        alert('Please enter a valid username.')
      }
    })
  }

  /**
   * Initialize the chat UI.
   */
  initUI () {
    // Create the chat UI
    const messageArea = document.createElement('div')
    messageArea.className = 'messages-area'
    this.container.appendChild(messageArea)

    const inputContainer = document.createElement('div')
    inputContainer.className = 'chat-input-container'
    this.container.appendChild(inputContainer)

    const textarea = document.createElement('textarea')
    textarea.className = 'message-input'
    inputContainer.appendChild(textarea)

    // Create the emoji button
    const emojiButton = document.createElement('button')
    emojiButton.className = 'emoji-button'
    emojiButton.id = 'emoji-button'
    emojiButton.innerText = '😊'
    inputContainer.appendChild(emojiButton)

    // Initialize the emoji picker
    const picker = new EmojiButton({
      position: 'right', // Adjust picker position relative to the button
      autoHide: false, // Prevent the picker from hiding automatically
      i18n: { search: 'Search emojis' } // Customize the search input placeholder
    })

    picker.on('emoji', emoji => {
      textarea.value += emoji // Add the selected emoji to the textarea
    })

    emojiButton.addEventListener('click', () => {
      picker.pickerVisible ? picker.hidePicker() : picker.showPicker(emojiButton)
    })

    // Add a keydown event listener to the textarea to send messages when Enter is pressed
    textarea.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.sendMessage(textarea.value)
        textarea.value = ''
      }
    })
  }

  /**
   * Send a message to the chat.
   * @param {*} text - The message text to send.
   */
  sendMessage (text) {
    if (!text.trim()) return // Prevent sending empty messages

    const message = {
      type: 'message',
      data: text,
      username: this.username,
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd' // API key
    }

    this.websocket.sendMessage(message) // Send the message to the WebSocket
  }

  /**
   * Receive a message from the WebSocket and display it in the chat.
   * @param {object} message - The message object received from the WebSocket.
   */
  receiveMessage (message) {
    if (message.type === 'notification') {
      // Display notification messages as system messages
      this.addSystemMessageToDisplay(`Server: ${message.data}`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    } else if (message.type === 'message') {
      // Display regular chat messages with a local timestamp
      this.addMessageToDisplay({
        ...message, // Copy all properties from the message object using the spread operator
        localTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    }
  }

  /**
   * Add a message to the display and instance's message history.
   * @param {object} message - The message object to display.
   */
  addMessageToDisplay (message) {
    this.messages.push(message) // Add to instance's message list

    const messageArea = this.container.querySelector('.messages-area')
    const messageElement = document.createElement('div')
    messageElement.className = 'message'

    const time = message.localTimestamp || 'Unknown Time' // Use local timestamp or fallback
    messageElement.innerText = `[${time}] ${message.username}: ${message.data}`

    messageArea.appendChild(messageElement)

    // Scroll to the latest message
    messageArea.scrollTop = messageArea.scrollHeight
  }

  /**
   * Add a system message to the display.
   * @param {string} messageText - The system message text to display.
   * @param {string} timestamp - The timestamp to display.
   */
  addSystemMessageToDisplay (messageText, timestamp) {
    const messageArea = this.container.querySelector('.messages-area')
    const messageElement = document.createElement('div')
    messageElement.className = 'message system-message'

    messageElement.innerText = `[${timestamp}] ${messageText}`

    messageArea.appendChild(messageElement)

    // Scroll to the latest message
    messageArea.scrollTop = messageArea.scrollHeight
  }
}
