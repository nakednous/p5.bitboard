'use strict'

console.log(Quadrille.VERSION)

const COLS = 10
const ROWS = 10
Quadrille.cellLength = 40

let board

function setup() {
  createCanvas(COLS * Quadrille.cellLength, ROWS * Quadrille.cellLength)
  board = createQuadrille(COLS, ROWS, COLS + ROWS + 1, color('lime'))
  // active at (0,0) and (2,0)
  const b = new Bitboard(0b100000100n, 3, 3)
  for (const { row, col, value } of b) {
    console.log(row, col, value)
  }
  for (const cell of b.cells(v => v === 0)) {
    console.log('Empty cell at', cell.row, cell.col)
  }
}

function draw() {
  background(255)
  drawQuadrille(board)
}

function mousePressed() {
  shiftLeftBit()
}

function keyPressed() {
  shiftLeftBit()
}

function shiftLeftBit() {
  const b = new Bitboard(board.toBitboard(), board.width, board.height)
  const shifted = b.shift(1, false)
  board.clear().fill(shifted.bitboard, color('magenta'))
}