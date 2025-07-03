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
    return new Bitboard(...args)
  }

  fn.drawBitboard = function (bitboard, value, {
    graphics = this,
    x,
    y,
    row,
    col,
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
    const width = bitboard.width
    const height = bitboard.height
    const mode = graphics._renderer instanceof p5.RendererGL ? 'webgl' : 'p2d'
    origin ??= mode === 'webgl' ? 'center' : 'corner'
    options.origin ??= origin
    const cx = x ?? (Number.isInteger(col) ? col * cellLength : 0)
    const cy = y ?? (Number.isInteger(row) ? row * cellLength : 0)
    graphics.push()
    // Align to p5 coordinate convention
    if (mode === 'webgl') {
      if (origin === 'corner') graphics.translate(-graphics.width / 2, -graphics.height / 2)
    } else {
      if (origin === 'center') graphics.translate(graphics.width / 2, graphics.height / 2)
    }
    graphics.translate(cx, cy)
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const index = bitboard.index(row, col)
        const bit = (bitboard.bitboard >> index) & 1n
        if (bit) {
          graphics.push()
          graphics.translate(col * cellLength, row * cellLength)
          const params = {
            graphics,
            value,
            width,
            height,
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
        }
      }
    }
    graphics.pop()
    return bitboard
  }
})

// Export default for ESM and IIFE
export default Bitboard