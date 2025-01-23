export class WebSocketHandler {
  constructor (url) {
    this.url = url
    this.socket = null
    this.onMessage = null // Callback for receiving messages
  }

  /**
   * Connect to the WebSocket server.
   */
  connect () {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return // Already connected
    }

    this.socket = new WebSocket(this.url)

    // Handle the open event
    this.socket.onopen = () => {
      console.log('WebSocket connected.')
    }

    // Handle incoming messages
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log('Message received from socket:', message)
      if (this.onMessage) {
        this.onMessage(message)
      }
    }

    // Handle errors
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    // Handle connection closure
    this.socket.onclose = () => {
      console.log('WebSocket connection closed.')
    }
  }

  /**
   * Send a message to the server.
   * @param {object} message - The message to send.
   */
  sendMessage (message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      console.log('Message sent to socket:', message)
    }
  }
}
