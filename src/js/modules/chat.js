import { WebSocketHandler } from './websocket.js'

/**
 * A simple chat application class.
 */
export class ChatApp {
  /**
   * Create a new chat application.
   * @param {HTMLElement} container - The container element for the chat.
   */
  constructor (container) {
    this.container = container
    this.websocket = new WebSocketHandler('wss://courselab.lnu.se/message-app/socket') // Shared WebSocket instance
    this.username = localStorage.getItem('username') || prompt('Enter your username:') // Prompt for username if not set
    localStorage.setItem('username', this.username) // Save the username globally

    this.messages = [] // Maintain independent messages for this instance

    this.websocket.connect() // Connect to the WebSocket
    this.receiveMessage = this.receiveMessage.bind(this) // Bind the message handler to this instance
    this.websocket.addMessageListener(this.receiveMessage) // Register as a listener
    this.initUI()

    // Clean up when the window is closed
    this.container.closest('.custom-window').querySelector('.close-button').addEventListener('click', () => {
      this.websocket.removeMessageListener(this.receiveMessage) // Remove WebSocket listener for this instance
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

    const textarea = document.createElement('textarea')
    textarea.className = 'message-input'
    this.container.appendChild(textarea)

    const sendButton = document.createElement('button')
    sendButton.className = 'send-button'
    sendButton.innerText = 'Send'
    this.container.appendChild(sendButton)

    // Add a click event listener to the send button to send messages
    sendButton.addEventListener('click', () => {
      this.sendMessage(textarea.value)
      textarea.value = ''
    })

    // Add a keydown event listener to the textarea to send messages when Enter is pressed
    textarea.addEventListener('keydown', (event) => {
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
   * @param {*} message - The message object received from the WebSocket.
   */
  receiveMessage (message) {
    if (message.type === 'message') {
      this.addMessageToDisplay(message) // Display the message in this instance
    }
  }

  /**
   * Add a message to the display and instance's message history.
   * @param {*} message - The message object to display.
   */
  addMessageToDisplay (message) {
    this.messages.push(message) // Add to instance's message list

    const messageArea = this.container.querySelector('.messages-area')
    const messageElement = document.createElement('div')
    messageElement.className = 'message'
    messageElement.innerText = `${message.username}: ${message.data}`
    messageArea.appendChild(messageElement)

    // Scroll to the latest message
    messageArea.scrollTop = messageArea.scrollHeight
  }
}
