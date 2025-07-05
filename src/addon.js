/**
 * @file Adds `createBitboard` and `drawBitboard` functions to the p5 prototype.
 * @version 0.1.0
 * @author JP Charalambos
 * @license GPL-3.0-only
 *
 * @description
 * Prototype extensions for p5.js that support creating and rendering Bitboard instances.
 * Part of the p5.bitboard.js library.
 */

'use strict'

import p5 from 'p5'
import Bitboard from './bitboard.js'
import Quadrille from 'p5.quadrille'

p5.registerAddon((_, fn) => {
  fn.createBitboard = function (...args) {
    let bb
    if (args[0] instanceof Quadrille) {
      const [quadrille, littleEndian = false] = args
      const bitboard = quadrille.toBitboard(littleEndian)
      bb = new Bitboard(bitboard, quadrille.width, quadrille.height, littleEndian)
    } else {
      bb = new Bitboard(...args)
    }
    bb._p = this
    bb._cellLength = Quadrille.cellLength
    bb._x = 0
    bb._y = 0
    bb._origin = 'corner'
    bb.screenRow = (pixelY, y = bb._y, cl = bb._cellLength || Quadrille.cellLength) =>
      bb._p.floor((pixelY - (bb._origin === 'center' ? bb._p.height / 2 : y)) / cl)
    bb.screenCol = (pixelX, x = bb._x, cl = bb._cellLength || Quadrille.cellLength) =>
      bb._p.floor((pixelX - (bb._origin === 'center' ? bb._p.width / 2 : x)) / cl)
    return bb
  }

  fn.drawBitboard = function (bitboard, value = 0, {
    graphics = this,
    x,
    y,
    row,
    col,
    filter,
    textFont,
    origin,
    options = {},
    functionDisplay = Quadrille.functionDisplay,
    imageDisplay = Quadrille.imageDisplay,
    colorDisplay = Quadrille.colorDisplay,
    stringDisplay = Quadrille.stringDisplay,
    numberDisplay = Quadrille.numberDisplay,
    tileDisplay = Quadrille.tileDisplay,
    arrayDisplay = Quadrille.arrayDisplay,
    objectDisplay = Quadrille.objectDisplay,
    cellLength = Quadrille.cellLength,
    outlineWeight = Quadrille.outlineWeight,
    outline = Quadrille.outline,
    textColor = Quadrille.textColor,
    textZoom = Quadrille.textZoom
  } = {}) {
    const mode = graphics._renderer instanceof p5.RendererGL ? 'webgl' : 'p2d'
    origin ??= mode === 'webgl' ? 'center' : 'corner'
    options.origin ??= origin
    bitboard._cellLength = cellLength
    bitboard._x = x ? x : col ? col * cellLength : 0
    bitboard._y = y ? y : row ? row * cellLength : 0
    graphics.push()
    mode === 'webgl'
      ? (origin === 'corner' && graphics.translate(-graphics.width / 2, -graphics.height / 2))
      : (origin === 'center' && graphics.translate(graphics.width / 2, graphics.height / 2))
    graphics.translate(bitboard._x, bitboard._y)
    for (const { row, col, bit } of bitboard.cells(filter)) {
      //if (bit) {
      graphics.push()
      graphics.translate(col * cellLength, row * cellLength)
      options.row = row
      options.col = col
      const params = {
        graphics,
        value: bit ? value : undefined,
        width: bitboard.width,
        height: bitboard.height,
        row,
        col,
        outline,
        outlineWeight,
        cellLength,
        textColor,
        textZoom,
        textFont,
        origin,
        options,
        functionDisplay,
        imageDisplay,
        colorDisplay,
        stringDisplay,
        numberDisplay,
        tileDisplay,
        arrayDisplay,
        objectDisplay
      }
      Quadrille._display(params)
      graphics.pop()
      //}
    }
    graphics.pop()
    return bitboard
  }
})

// Export default for ESM and IIFE
export default Bitboard