'use strict'

console.log(Quadrille.VERSION)
const COLS = 10
const ROWS = 10
Quadrille.cellLength = 40
Quadrille.tileDisplay = undefined

let board, knightBoard, jumpsBoard
const knight = Quadrille.chessSymbols.get('N')
const target = 'lightblue'

// 🔥 Pre-encoded bitboards with origin at (5, 5)
const knightRaw = 17592186044416n
const jumpsRaw = 46193421450995564544n

function setup() {
  createCanvas(COLS * Quadrille.cellLength, ROWS * Quadrille.cellLength)
  board = createQuadrille(COLS, ROWS).fill()
  knightBoard = createQuadrille(COLS, ROWS)
  jumpsBoard = createQuadrille(COLS, ROWS)
}

function draw() {
  background(255)
  drawQuadrille(board)
  drawQuadrille(knightBoard)
  drawQuadrille(jumpsBoard)
}

function mousePressed() {
  const row = board.mouseRow
  const col = board.mouseCol

  const dx = col - 5
  const dy = row - 5

  //const knight = new Bitboard(17592186044416n, COLS, ROWS, false).translate(dx, dy, true)
  //const jumps = new Bitboard(46193421450995564544n, COLS, ROWS, false).translate(dx, dy, true)
  const knight = createBitboard(17592186044416n, 0, COLS, ROWS, false).translate(dx, dy, true)
  const jumps = createBitboard(46193421450995564544n, 0, COLS, ROWS, false).translate(dx, dy, true)

  knightBoard.clear().fill(knight.bitboard, Quadrille.chessSymbols.get('N'))
  jumpsBoard.clear().fill(jumps.bitboard, color('lightblue'))
}
