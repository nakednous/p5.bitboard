'use strict'

console.log(Quadrille.VERSION)

const COLS = 12
const ROWS = 8
Quadrille.cellLength = 40

let bitboard

function setup() {
  createCanvas(max(ROWS, COLS) * Quadrille.cellLength, max(ROWS, COLS) * Quadrille.cellLength)
  const board = createQuadrille(COLS, ROWS, COLS + ROWS + 1, color('lime'))
  bitboard = createBitboard(board)
  board.clear()
}

function draw() {
  background(255)
  drawBitboard(bitboard, color('lime'))
}

function mousePressed() {
  bitboard = shiftRight()
}

function keyPressed() {
  const row = bitboard.mouseRow
  const col = bitboard.mouseCol
  if (key === 'p') bitboard.fill(row)
  if (key === 'q') bitboard.rotate()
  if (key === 'r') bitboard = bitboard.reflect()
  if (key === 's') bitboard = bitboard.shift()
  if (key === 't') bitboard.transpose()
  if (key === 'u') bitboard.transpose().fill(col).transpose()
}

function shiftLeft(wrap = true) {
  return bitboard.shift(wrap)
}

function shiftRight(wrap = true) {
  return bitboard.transpose().reflect().transpose().shift(wrap).transpose().reflect().transpose()
}

function shiftDown(wrap = true) {
  return bitboard.transpose().shift(wrap).transpose()
}

function shiftUp(wrap = true) {
  return bitboard.reflect().transpose().shift(wrap).transpose().reflect()
}

