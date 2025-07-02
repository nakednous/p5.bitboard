/**
 * @file Defines the Bitboard class — the core class of the p5.bitboard library.
 * @version 0.1.0
 * @author JP Charalambos
 * @license GPL-3.0-only
 *
 * @description
 * Bitboard p5.js toolkit.
 * This module defines the Bitboard class.
 */

'use strict';

import p5 from 'p5';

// TODOs
class Bitboard {
  constructor(value = 0n, width = 8, height = 8, littleEndian = false) {
    this.value = BigInt(value)
    this.width = width
    this.height = height
    this.littleEndian = littleEndian
  }

  dim() {
    return this.value.toString(2).length
  }

  index(row, col) {
    const index = row * this.width + col
    return this.littleEndian
      ? BigInt(index)
      : BigInt(this.width * this.height - 1 - index)
  }

  cell(bitIndex) {
    const maxIndex = this.width * this.height - 1
    const raw = Number(bitIndex)
    const index = this.littleEndian ? raw : maxIndex - raw
    return {
      row: Math.floor(index / this.width),
      col: index % this.width
    }
  }

  toBinaryString() {
    return this.value.toString(2)
  }

  static fromBinaryString(s, width = 8, height = 8, littleEndian = false) {
    return new Bitboard(BigInt('0b' + s), width, height, littleEndian)
  }

  mask() {
    return (1n << BigInt(this.width * this.height)) - 1n
  }

  and(other) {
    return new Bitboard((this.value & other.value) & this.mask(), this.width, this.height, this.littleEndian)
  }

  or(other) {
    return new Bitboard((this.value | other.value) & this.mask(), this.width, this.height, this.littleEndian)
  }

  xor(other) {
    return new Bitboard((this.value ^ other.value) & this.mask(), this.width, this.height, this.littleEndian)
  }

  not() {
    return new Bitboard((~this.value) & this.mask(), this.width, this.height, this.littleEndian)
  }

  rank() {
    let count = 0n
    let v = this.value
    while (v) {
      count += v & 1n
      v >>= 1n
    }
    return count
  }

  translate(dx = 0, dy = 0, truncate = false) {
    let result = 0n
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const i = this.index(row, col)
        if (((this.value >> i) & 1n) === 1n) {
          const r2 = row + dy
          const c2 = col + dx
          if (truncate && (r2 < 0 || r2 >= this.height || c2 < 0 || c2 >= this.width)) continue
          const wrappedRow = ((r2 % this.height) + this.height) % this.height
          const wrappedCol = ((c2 % this.width) + this.width) % this.width
          const j = this.index(truncate ? r2 : wrappedRow, truncate ? c2 : wrappedCol)
          result |= 1n << j
        }
      }
    }
    return new Bitboard(result, this.width, this.height, this.littleEndian)
  }

  shift(dx = 1, truncate = false) {
    const totalBits = BigInt(this.width * this.height)
    const mask = (1n << totalBits) - 1n
    if (dx === 0) return new Bitboard(this.value, this.width, this.height, this.littleEndian)
    if (Math.abs(dx) !== 1) {
      console.warn('shift only supports dx = -1, 0, or 1.')
      return new Bitboard(this.value, this.width, this.height, this.littleEndian)
    }
    const left = dx === 1
    const result = truncate
      ? left ? (this.value << 1n) & mask : this.value >> 1n
      : left
        ? ((this.value << 1n) | ((this.value >> (totalBits - 1n)) & 1n)) & mask
        : (this.value >> 1n) | ((this.value & 1n) << (totalBits - 1n))
    return new Bitboard(result, this.width, this.height, this.littleEndian)
  }

  bounds() {
    let minRow = this.height, maxRow = -1, minCol = this.width, maxCol = -1
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const i = this.index(row, col)
        if (((this.value >> i) & 1n) === 1n) {
          if (row < minRow) minRow = row
          if (row > maxRow) maxRow = row
          if (col < minCol) minCol = col
          if (col > maxCol) maxCol = col
        }
      }
    }
    return minRow <= maxRow
      ? { row: minRow, col: minCol, width: maxCol - minCol + 1, height: maxRow - minRow + 1 }
      : null
  }

  crop(row, col, w, h) {
    let result = 0n
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const sourceIndex = new Bitboard(0n, this.width, this.height, this.littleEndian).index(row + r, col + c)
        const targetIndex = new Bitboard(0n, w, h, this.littleEndian).index(r, c)
        if (((this.value >> sourceIndex) & 1n) === 1n) {
          result |= 1n << targetIndex
        }
      }
    }
    return new Bitboard(result, w, h, this.littleEndian)
  }
}

// Export the Bitboard class as the default export
export default Bitboard;