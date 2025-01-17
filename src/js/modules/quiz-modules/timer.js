export { startTimer, stopTimer }

/**
 * Method to start a timer, which will run for the given duration.
 * @param {number} duration The duration of the timer in seconds.
 * @param {Function} timeUpCallback The callback function to call when the time is up.
 * @returns {number} The interval ID of the timer
 */
function startTimer (duration = 10, timeUpCallback) {
  let timeLeft = duration
  const timerElement = document.getElementById('timer')
  timerElement.innerHTML = `Time left: ${timeLeft}s`

  const timerInterval = setInterval(() => {
    timeLeft--
    timerElement.innerHTML = `Time left: ${timeLeft}s`

    if (timeLeft <= 0) {
      clearInterval(timerInterval)
      console.log('Time is up!')
      timerElement.innerHTML = "Time's up!"
      if (timeUpCallback) timeUpCallback() // Call the callback if provided
    }
  }, 1000)

  return timerInterval
}

/**
 * The method to stop the timer.
 * @param {number} timerInterval The interval ID of the timer.
 */
function stopTimer (timerInterval) {
  clearInterval(timerInterval)
  document.getElementById('timer').innerHTML = ''
}
