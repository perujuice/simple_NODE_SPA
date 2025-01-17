// chat.js
import { WebSocketHandler } from './websocket.js'
import * as storage from './storage.js'

export class ChatApp {
  constructor (container) {
    this.container = container
    this.websocket = new WebSocketHandler('wss://courselab.lnu.se/message-app/socket')
    this.username = storage.getUsername() || prompt('Enter your username:')
    storage.setUsername(this.username)

    this.websocket.connect()
    this.websocket.onMessage = this.receiveMessage.bind(this) // Set the callback for receiving messages
  }

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

    // Event listener for sending message
    sendButton.addEventListener('click', () => {
      this.sendMessage(textarea.value)
      textarea.value = ''
    })

    // Handle sending message on Enter key
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
    const message = {
      type: 'message',
      data: text,
      username: this.username,
      channel: 'general', // Channel could be dynamic if needed
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd' // API key
    }
    this.websocket.sendMessage(message) // Send the message to the WebSocket
  }

  /**
   * Receive a message and display it in the chat.
   * @param {*} message - The message object received from the WebSocket.
   */
  receiveMessage (message) {
    const messageArea = this.container.querySelector('.messages-area')

    // Create a new element for the message
    const messageElement = document.createElement('div')
    messageElement.className = 'message'
    messageElement.innerText = `${message.username}: ${message.data}`

    // Append the new message element to the message area
    messageArea.appendChild(messageElement)

    // Log the received message
    console.log('Received message:', message)

    // Retrieve messages from localStorage to display last 20 messages
    let messages = storage.getMessages()

    // Add the new message to the stored messages
    messages.push(message)

    // Keep only the last 20 messages
    if (messages.length > 20) {
      messages = messages.slice(-20)
    }

    // Store the updated list of messages in localStorage
    storage.setMessages(messages)

    // Display the last 20 messages in the chat window
    this.displayMessages()
  }

  /**
   * Display the last 20 messages in the chat window.
   */
  displayMessages () {
    const messageArea = this.container.querySelector('.messages-area')

    // Retrieve messages from localStorage
    const messages = storage.getMessages()

    // Clear the message area before re-populating it
    messageArea.innerHTML = ''

    // Append the last 20 messages to the message area
    messages.forEach(message => {
      const messageElement = document.createElement('div')
      messageElement.className = 'message'
      messageElement.innerText = `${message.username}: ${message.data}`
      messageArea.appendChild(messageElement)
    })
  }
}
