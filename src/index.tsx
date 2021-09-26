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
const w = (canvas.width = window.innerWidth)
const h = (canvas.height = window.innerHeight)

const context = canvas.getContext('2d')!

const render = () => {
  context.clearRect(0, 0, w, h)
  context.fillStyle = 'rgba(0,0,0,.1)'
  context.fillRect(0, 0, w, h)

  const beacon = beacons[0]
  if (beacon) {
    const rect = beacon.getBoundingClientRect()
  }

  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)
window.requestAnimationFrame(render)
