'use strict'

console.log(Quadrille.VERSION)
console.log(Bitboard.VERSION)

const COLS = 10
const ROWS = 10
Quadrille.cellLength = 40
Quadrille.tileDisplay = undefined

let board, knightBitboard, jumpsBitboard
const knightSymbol = Quadrille.chessSymbols.get('N')
const targetColor = 'lightblue'

function setup() {
  createCanvas(COLS * Quadrille.cellLength, ROWS * Quadrille.cellLength)
  board = createQuadrille(COLS, ROWS).fill()

  // These are placeholder bitboards; they get updated on click
  knightBitboard = createBitboard(0n, COLS, ROWS)
  jumpsBitboard = createBitboard(0n, COLS, ROWS)
}

function draw() {
  background(0)
  drawQuadrille(board)
  drawBitboard(knightBitboard, knightSymbol)
  drawBitboard(jumpsBitboard, color(targetColor))
  //drawBitboard(jumpsBitboard)
}

function mousePressed() {
  const row = board.mouseRow
  const col = board.mouseCol

  const dx = col - 5
  const dy = row - 5

  knightBitboard = createBitboard(17592186044416n, COLS, ROWS).translate(dx, dy, true)
  jumpsBitboard = createBitboard(46193421450995564544n, COLS, ROWS).translate(dx, dy, true)
}