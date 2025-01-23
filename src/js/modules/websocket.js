/**
 * WebSocketHandler class to handle WebSocket connections.
 */
export class WebSocketHandler {
  constructor (url) {
    // Check if an instance already exists
    if (WebSocketHandler.instance) {
      return WebSocketHandler.instance
    }
    this.url = url
    this.socket = null
    this.listeners = [] // List of message listeners, to be called when a message is received
    WebSocketHandler.instance = this // Save the instance
  }

  /**
   * Connect to the WebSocket server.
   */
  connect () {
    // If the socket is already open, return
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return
    }

    this.socket = new WebSocket(this.url)

    this.socket.onopen = () => {
      console.log('WebSocket connected.')
    }

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log('Message received from socket:', message)
      if (message.type !== 'heartbeat' && message.type !== 'notification') {
        this.listeners.forEach((listener) => listener(message))
      }
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    this.socket.onclose = () => {
      console.log('WebSocket connection closed.')
    }
  }

  /**
   * Send a message to the WebSocket server.
   * @param {string} message - The message to send to the WebSocket server.
   */
  sendMessage (message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      console.log('Message sent to socket:', message)
    }
  }

  /**
   * Add a message listener.
   * @param {*} callback - The callback function to be called when a message is received.
   */
  addMessageListener (callback) {
    this.listeners.push(callback)
  }

  /**
   * Remove a message listener.
   * @param {*} callback - The callback function to be removed from the list of listeners.
   */
  removeMessageListener (callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  }
}
