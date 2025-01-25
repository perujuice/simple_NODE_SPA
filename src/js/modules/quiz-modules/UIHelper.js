/**
 * Create a header element with text.
 * @param {string} text The text to display.
 * @param {string} [className] Optional class name for the header.
 * @returns {HTMLElement} The header element.
 */
export function createHeader (text, className = '') {
  const header = document.createElement('h1')
  header.textContent = text
  if (className) header.className = className // Apply optional class
  header.style.textAlign = 'center'
  return header
}

/**
 * Create a div element with a class name.
 * @param {string} className The class name of the div.
 * @returns {HTMLElement} The div element.
 */
export function createDiv (className) {
  const div = document.createElement('div')
  div.className = className
  return div
}

/**
 * Hide an element.
 * @param {HTMLElement} element The element to hide.
 */
export function hideElement (element) {
  if (element) element.style.display = 'none'
}

/**
 * Show an element.
 * @param {HTMLElement} element The element to show.
 */
export function showElement (element) {
  if (element) element.style.display = 'block'
}

/**
 * Create an input field.
 * @param {string} className The class name of the input field.
 * @param {string} placeholder The placeholder text.
 * @returns {HTMLElement} The input field.
 */
export function createInputField (className, placeholder) {
  const input = document.createElement('input')
  input.type = 'text'
  input.className = className // Use class instead of ID
  input.placeholder = placeholder
  return input
}

/**
 * Create a button element.
 * @param {string} text The text to display on the button.
 * @param {string} className The class name of the button.
 * @param {Function} onClick The function to call when the button is clicked.
 * @returns {HTMLElement} The button element.
 */
export function createButton (text, className, onClick) {
  const button = document.createElement('button')
  button.className = className
  button.textContent = text
  button.onclick = onClick
  return button
}

/**
 * Clear the container and append new elements.
 * @param {HTMLElement} container The container to clear and append to.
 * @param {HTMLElement[]} elements The elements to append to the container.
 */
export function clearAndAppend (container, elements) {
  if (!container) return
  container.innerHTML = '' // Clear all content
  elements.forEach((element) => container.appendChild(element)) // Append new elements
}

/**
 * Update the header text within a container.
 * @param {HTMLElement} container The container containing the header.
 * @param {string} text The text to display.
 * @param {string} [className] Optional class name to identify the header.
 */
export function updateHeaderText (container, text, className = '') {
  const header = className
    ? container.querySelector(`.${className}`)
    : container.querySelector('h1')
  if (header) header.textContent = text
}

/**
 * Clear a container by its class name within a parent container.
 * @param {HTMLElement} parent The parent container to scope the query.
 * @param {string} className The class name of the container to clear.
 * @returns {HTMLElement} The cleared container.
 */
export function clearContainer (parent, className) {
  const container = parent.querySelector(`.${className}`)
  if (container) container.innerHTML = ''
  return container
}

/**
 * Get the value of an input field.
 * @param {HTMLElement} parent The parent container to scope the query.
 * @param {string} className The class name of the input field.
 * @returns {string} The value of the input field, or an empty string if not found.
 */
export function getInputValue (parent, className) {
  const input = parent.querySelector(`.${className}`)
  return input ? input.value : ''
}

/**
 * Get the selected answer from a radio button group.
 * @param {HTMLElement} parent The parent container to scope the query.
 * @param {string} name The name of the radio button group.
 * @returns {string} The value of the selected radio button, or an empty string if not found.
 */
export function getSelectedAnswer (parent, name) {
  const selected = parent.querySelector(`input[name="${name}"]:checked`)
  return selected ? selected.value : ''
}
