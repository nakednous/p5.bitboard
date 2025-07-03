'use strict'

console.log(Quadrille.VERSION)

const COLS = 10
const ROWS = 10
Quadrille.cellLength = 40

let board
let bitboard

function setup() {
  createCanvas(COLS * Quadrille.cellLength, ROWS * Quadrille.cellLength)
  board = createQuadrille(COLS, ROWS, COLS + ROWS + 1, color('lime'))
  bitboard = createBitboard(board)
  board.clear()
}

function draw() {
  background(255)
  drawQuadrille(board)
  drawBitboard(bitboard, color('lime'))
}

function mousePressed() {
  shiftLeftBit()
}

function keyPressed() {
  shiftLeftBit()
}

function shiftLeftBit() {
  bitboard = bitboard.shift(1)
}
