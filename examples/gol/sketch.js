'use strict'

Quadrille.cellLength = 20

const w = 30, h =20
let seed, board, next
let life

function setup() {
  createCanvas(w * Quadrille.cellLength, h * Quadrille.cellLength)
  frameRate(2)
  life = color('lime')
  // /*
  board = createBitboard(0n, w, h)
  // Glider pattern = 0b111101111111111111101111n = 16252911n
  //seed = createBitboard(0b111101111111111111101111n, 3, 8)
  //seed = createBitboard(16252911n, 3, 8)
  //seed = createBitboard(0b111101111111111111101111n, 3, 8)
  seed = createBitboard(16252911n, 3)
  //console.log(seed.toBinaryString())
  board = board.or(seed).translate(8, 6)
  //seed = createBitboard(16252911n, 20, 20)
  //board = board.or(seed)
}

function draw() {
  background('black')
  next = board.clone()
  for (const { row, col, bit } of board) {
    const neighbors = board.ring(row, col).order() - bit
    if (bit === 1) {
      if (neighbors < 2 || neighbors > 3) next.clear(row, col)
    } else {
      if (neighbors === 3) next.fill(row, col)
    }
  }
  board = next
  drawBitboard(board, life)
}
