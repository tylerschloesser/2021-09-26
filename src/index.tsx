import ReactDom from 'react-dom'
import { App } from './app'

const beacons: Element[] = []

const mo = new MutationObserver((records) => {
  console.log(records)

  records.forEach((record) => {
    record.addedNodes.forEach((node) => {
      console.log({ node })
      ;(node as HTMLElement)
        .querySelectorAll('[data-beacon]')
        .forEach((beacon) => {
          console.log(beacon.getBoundingClientRect())
          beacons.push(beacon)
        })
    })
  })
}).observe(document.getElementById('app')!, { childList: true, subtree: true })

ReactDom.render(<App />, document.getElementById('app'))

const canvas = document.querySelector('canvas')!
let w = (canvas.width = window.innerWidth)
let h = (canvas.height = window.innerHeight)

const context = canvas.getContext('2d')!

let renderOverlay: boolean = true
const toggleButton = document.querySelector(
  'button#toggle',
) as HTMLButtonElement
toggleButton.onclick = () => {
  renderOverlay = !renderOverlay
}

window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth
  h = canvas.height = window.innerHeight
})

const pointerEventCache: PointerEvent[] = []
window.onpointermove = (e) => {
  pointerEventCache.push(e)
}

const render = () => {
  context.clearRect(0, 0, w, h)

  if (!renderOverlay) {
    window.requestAnimationFrame(render)
    return
  }

  context.fillStyle = 'rgba(0,0,0,.1)'
  context.fillRect(0, 0, w, h)

  beacons.forEach((beacon) => {
    const rect = beacon.getBoundingClientRect()
    context.strokeStyle = 'red'
    context.strokeRect(rect.x, rect.y, rect.width, rect.height)
  })

  context.beginPath()
  for (let i = 0; i < pointerEventCache.length - 2; i++) {
    let a = pointerEventCache[i]
    let b = pointerEventCache[i + 1]
    context.moveTo(a.x, a.y)
    context.lineTo(b.x, b.y)
  }
  context.stroke()

  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)
