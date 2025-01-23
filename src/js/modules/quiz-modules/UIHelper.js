/**
 * Create a header element with text
 * @param {string} text the text to display
 * @returns {HTMLElement} the header element
 */
export function createHeader (text) {
  const header = document.createElement('h1')
  header.id = 'Header'
  header.textContent = text
  header.style.textAlign = 'center'
  return header
}

/**
 * Create a div element with a class name
 * @param {string} className The class name of the div
 * @returns {HTMLElement} the div element
 */
export function createDiv (className) {
  const div = document.createElement('div')
  div.className = className
  return div
}

/**
 * Hide an element
 * @param {HTMLElement} element The element to hide
 */
export function hideElement (element) {
  element.style.display = 'none'
}

/**
 * Show an element.
 * @param {HTMLElement} element The element to show
 */
export function showElement (element) {
  element.style.display = 'block'
}

/**
 * Create an input field
 * @param {string} id The id of the input field.
 * @param {string} placeholder The placeholder text.
 * @returns {HTMLElement} the input field
 */
export function createInputField (id, placeholder) {
  const input = document.createElement('input')
  input.type = 'text'
  input.id = id
  input.placeholder = placeholder
  return input
}

/**
 * Create a button element
 * @param {string} text The text to display on the button.
 * @param {string} className The class name of the button.
 * @param {Function} onClick The function to call when the button is clicked.
 * @returns {HTMLElement} the button element
 */
export function createButton (text, className, onClick) {
  const button = document.createElement('button')
  button.className = className
  button.textContent = text
  button.onclick = onClick
  return button
}

/**
 * Create a list item element
 * @param {HTMLElement} container The container to append the list item to
 * @param {HTMLElement} elements The elements to append to the container
 */
export function clearAndAppend (container, elements) {
  container.innerHTML = ''
  elements.forEach((element) => container.appendChild(element))
}

/**
 * Update the header text
 * @param {HTMLElement} container The container to update
 * @param {string} text The text to display
 */
export function updateHeaderText (container, text) {
  const header = container.querySelector('#Header')
  if (header) header.textContent = text
}

/**
 * Clear the container, if it exists
 * @param {string} className The class name of the container
 * @returns {HTMLElement} the container
 */
export function clearContainer (className) {
  const container = document.querySelector(`.${className}`)
  if (container) container.innerHTML = ''
  return container
}

/**
 * Method to get the value of an input field
 * @param {string} id The id of the input field
 * @returns {string} the value of the input field
 */
export function getInputValue (id) {
  const input = document.getElementById(id)
  return input ? input.value : '' // Return the value if the input exists, if not return an empty string.
}

/**
 * Method to get the selected answer from a radio button group
 * @param {string} name The name of the radio button group
 * @returns {string} the value of the selected radio button
 */
export function getSelectedAnswer (name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`)
  return selected ? selected.value : ''
}
