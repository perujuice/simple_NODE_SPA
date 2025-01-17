// websocket.js
export class WebSocketHandler {
  constructor (url) {
    this.url = url
    this.socket = null
  }

  /**
   * Method to connect to the WebSocket.
   */
  connect () {
    this.socket = new WebSocket(this.url)

    // Log when the connection is opened.
    this.socket.onopen = () => {
      console.log('WebSocket connected.')
    }

    // Log any messages received from the server.
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log('Message received from socket:', message)
      if (message.type !== 'heartbeat' && message.type !== 'notification') {
        this.onMessage(message)
      }
    }

    // log any errors.
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    // When the server closes the connection.
    this.socket.onclose = () => {
      console.log('WebSocket connection closed.')
    }
  }

  /**
   * Set the callback for receiving messages.
   * @param {*} message - The message received from the WebSocket.
   */
  sendMessage (message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      console.log('Message sent to socket:', message)
    }
  }
}
