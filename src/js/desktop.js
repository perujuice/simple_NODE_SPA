/**
 * Example program on HTML Drag and Drop API.
 */

const itemArea = document.getElementById('item')

itemArea.addEventListener('dragstart', (event) => {
  console.log('DRAG START', event)

  // Get original position
  const style = window.getComputedStyle(event.target, null)
  const startX = parseInt(style.getPropertyValue('left'), 10) - event.clientX
  const startY = parseInt(style.getPropertyValue('top'), 10) - event.clientY
  const start = {
    posX: startX,
    posY: startY
  }

  // Save the position in the dataTransfer
  event.dataTransfer.setData('application/json', JSON.stringify(start))
  console.log('Start position', start)

  // Attach the drop effect
  event.dataTransfer.dropEffect = 'move' // move, copy, link
})

const dropZone = document.querySelector('main')

dropZone.addEventListener('dragenter', (event) => {
  // console.log('DRAG ENTER DROP ZONE', event)
  // event.preventDefault()
})

dropZone.addEventListener('dragover', (event) => {
  // console.log('DRAG OVER DROP ZONE', event)
  event.preventDefault()
})

dropZone.addEventListener('drop', (event) => {
  console.log('DROPPED ON DROP ZONE', event)

  // Get the position of the dragged element and where the drop was
  const start = JSON.parse(event.dataTransfer.getData('application/json'))
  const dropX = event.clientX
  const dropY = event.clientY
  console.log('Drop position', [dropX, dropY])

  // Move element position from start to drop
  itemArea.style.left = (dropX + start.posX) + 'px'
  itemArea.style.top = (dropY + start.posY) + 'px'
})
