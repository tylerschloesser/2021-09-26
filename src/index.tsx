import ReactDom from 'react-dom'
import { App } from './app'

const beacons: Element[] = []

const mo = new MutationObserver((records) => {
  records.forEach((record) => {
    record.addedNodes.forEach((node) => {
      ;(node as HTMLElement)
        .querySelectorAll('[data-beacon]')
        .forEach((beacon) => {
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

let pointerTimeout: number | null = null

let lastPointerEvent: PointerEvent | null = null
let pointerEventCache: PointerEvent[] = []
let pointerInMotion = false
let motionAngle: number | null = null

window.onpointermove = (e) => {
  if (pointerTimeout) {
    window.clearTimeout(pointerTimeout)
  }
  if (!pointerInMotion) {
    pointerEventCache = []
  }
  pointerInMotion = true
  lastPointerEvent = e
  pointerEventCache.push(e)

  if (pointerEventCache.length > 1) {
    const first = pointerEventCache[0]
    const last = pointerEventCache[pointerEventCache.length - 1]

    motionAngle = Math.atan2(last.y - first.y, last.x - first.x)
  }

  pointerTimeout = window.setTimeout(() => {
    pointerInMotion = false
  }, 100)
}

function renderMotionAngle(size: number) {
  context.strokeStyle = '#222'
  context.beginPath()
  context.arc(size, size, size, 0, Math.PI * 2)

  if (motionAngle) {
    context.moveTo(size, size)

    const x = size
    const y = 0
    context.lineTo(
      size + Math.cos(motionAngle) * x - Math.sin(motionAngle) * y,
      size + Math.sin(motionAngle) * x + Math.cos(motionAngle) * y,
    )
  }

  context.stroke()
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
  for (let i = 0; i < pointerEventCache.length - 1; i++) {
    let a = pointerEventCache[i]
    let b = pointerEventCache[i + 1]
    context.moveTo(a.x, a.y)
    context.lineTo(b.x, b.y)
  }
  context.strokeStyle = '#222'
  context.stroke()

  if (lastPointerEvent) {
    context.beginPath()
    context.arc(lastPointerEvent.x, lastPointerEvent.y, 10, 0, Math.PI * 2)
    context.stroke()
  }

  renderMotionAngle(100)

  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)
