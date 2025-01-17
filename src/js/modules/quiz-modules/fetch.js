/**
 * Do a fetch GET request and return the response as JSON.
 * @param {string} url to send request to
 * @returns {object} the JSON response
 */
export async function get (url) {
  // Do a fetch request on that url using await
  const response = await fetch(url)

  // Get the response as json (asynchronous request)
  const data = await response.json()

  // Check if the response is ok
  if (!response.ok) {
    console.log(response)
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return data
}

/**
 * Do a fetch POST request and return the response as JSON.
 * @param {string} url to send request to
 * @param {object} body to submit
 * @returns {object} the JSON response
 */
export async function post (url, body = null) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  const response = await fetch(url, options)
  const data = await response.json()

  return { data, status: response.status }
}

/**
 * Method to get the next URL from the current HTTP response.
 * @param {JSON} response The json response.
 * @returns {string} The next URL.
 */
export async function getNextUrl (response) {
  return response.nextURL
}

/**
 * Gets the question from the current HTTP response.
 * @param {*} response The json response.
 * @returns {*} The question.
 */
export async function getQuestion (response) {
  return response.question
}

/**
 * Gets the message from the current HTTP response.
 * @param {*} response The json response.
 * @returns {*} The message.
 */
export function getAnswerMessage (response) {
  return response.data.message
}
