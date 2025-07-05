'use strict'

Quadrille.cellLength = 20

let seed, board
let life

function setup() {
  createCanvas(20 * Quadrille.cellLength, 20 * Quadrille.cellLength)
  frameRate(2)
  //q = createQuadrille(20, 20)
  life = color('lime')
  // /*
  board = createBitboard(0n, 20, 20)
  // Glider pattern = 0b111101111111111111101111n = 16252911n
  //seed = createBitboard(0b111101111111111111101111n, 3, 8)
  seed = createBitboard(16252911n, 3, 8)
  //console.log(seed.toBinaryString())
  //board = board.or(seed)
  board = board.or(seed).translate(8, 6)
  //seed = createBitboard(16252911n, 20, 20)
  //board = board.or(seed)
}

function draw() {
  background('black')
  drawBitboard(board, life)
}

function mousePressed() {
  const row = board.mouseRow
  const col = board.mouseCol
  console.log(row, col)
  board.toggle(row, col)
}
