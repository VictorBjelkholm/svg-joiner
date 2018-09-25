#! /usr/bin/env node

const fs = require('fs')
const tools = require('simple-svg-tools')

const svgMargin = 5
const filesToJoin = process.argv.splice(2)

const widths = []
const bodies = filesToJoin.map((filePath) => {
  const file = fs.readFileSync(filePath)

  const svg = new tools.SVG(file.toString())
  widths.push(svg.width)
  return svg.getBody()
})

let currentUsedSpace = 0
const wrappedBodies = bodies.map((body, index) => {
  const width = widths[index] + svgMargin
  const marginLeft = currentUsedSpace
  currentUsedSpace = currentUsedSpace + width
  // Replacing the following to make sure there is no collisions:
  // id="a" => id="${index}"
  // url(#a) => url(#${index})
  let newBody = body
  newBody = newBody.replace('id="a"', `id="${index}"`)
  newBody = newBody.replace('url(#a)', `url(#${index})`)

  return `<svg width="${width}px" x="${marginLeft}px">${newBody}</svg>`
})

const combined = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${currentUsedSpace}" height="40">
  ${wrappedBodies.join('\n')}
</svg>`

console.log(combined)
