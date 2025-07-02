'use strict'

console.log(Quadrille.VERSION)

const COLS = 10
const ROWS = 10
Quadrille.cellLength = 40

let board

function setup() {
  createCanvas(COLS * Quadrille.cellLength, ROWS * Quadrille.cellLength)
  board = createQuadrille(COLS, ROWS, COLS + ROWS + 1, color('lime'))
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