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

'use strict'

// TODOs

class Bitboard {
  static VERSION = '0.1.0'

  constructor(...args) {
    let bitboard = 0n
    let width = 8
    let height
    let littleEndian = false
    args.forEach(arg =>
      typeof arg === 'bigint'
        ? bitboard = arg
        : typeof arg === 'string'
          ? bitboard = BigInt(arg.startsWith('0b') ? arg : '0b' + arg)
          : typeof arg === 'number' && width === 8
            ? width = arg
            : typeof arg === 'number' && height === undefined
              ? height = arg
              : typeof arg === 'boolean'
                ? littleEndian = arg
                : null
    )
    if (height === undefined) {
      const bits = bitboard.toString(2).length
      height = Math.ceil(bits / width)
      console.log(`Bitboard: computed height = ${height}`)
    }
    const dim = width * height
    const bits = bitboard.toString(2).length
    if (bits > dim) {
      console.warn('Bitboard is too long and will be cropped')
      const mask = (1n << BigInt(dim)) - 1n
      const cropped = bitboard & mask
      console.warn('Cropped bitboard:', cropped.toString(2).padStart(dim, '0'))
      bitboard = cropped
    }
    this._bitboard = bitboard
    this._width = width
    this._height = height
    this._littleEndian = littleEndian
  }

  _patch(other) {
    other._p = this._p
    other._cellLength = this._cellLength
    other._x = this._x
    other._y = this._y
    other._origin = this._origin
    other.screenRow = this.screenRow
    other.screenCol = this.screenCol
  }

  _create(...args) {
    const bb = new Bitboard(...args)
    this._patch(bb)
    return bb
  }

  clone() {
    const clone = new Bitboard(
      this._bitboard,
      this._width,
      this._height,
      this._littleEndian
    )
    this._patch(clone)
    return clone
  }

  get mouseRow() {
    return this.screenRow(this._p.mouseY);
  }

  get mouseCol() {
    return this.screenCol(this._p.mouseX);
  }

  get bitboard() {
    return this._bitboard
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  get littleEndian() {
    return this._littleEndian
  }

  *cells(filter = null) {
    const isFn = typeof filter === 'function'
    const isSet = filter && !isFn && typeof filter !== 'object'
    const isObj = filter && typeof filter === 'object'
    const set = isSet ? new Set(filter) : null
    for (let row = 0; row < this._height; row++) {
      for (let col = 0; col < this._width; col++) {
        const index = BigInt(this.index(row, col))
        const bit = Number((this._bitboard >> index) & 1n)
        const match = !filter
          || (isFn && filter(bit))
          || (isSet && set.has(bit))
          || (isObj &&
            (!filter.bit || filter.bit(bit)) &&
            (!filter.row || filter.row(row)) &&
            (!filter.col || filter.col(col)))
        if (match) yield { row, col, bit }
      }
    }
  }

  *[Symbol.iterator]() {
    yield* this.cells()
  }

  visit(callback, filter = null) {
    for (const cell of this.cells(filter)) {
      callback(cell)
    }
  }

  size() {
    return this._width * this._height
  }

  index(row, col) {
    const index = row * this._width + col
    return this._littleEndian
      ? index
      : this.size() - 1 - index
  }

  cell(bitIndex) {
    const maxIndex = this.size() - 1
    const raw = Number(bitIndex)
    const index = this._littleEndian ? raw : maxIndex - raw
    return {
      row: Math.floor(index / this._width),
      col: index % this._width
    }
  }

  transpose() {
    let result = 0n
    for (const { row, col } of this.cells(bit => bit === 1)) {
      // Transpose: (row, col) → (col, row)
      const raw = col * this._height + row
      const index = this._littleEndian
        ? BigInt(raw)
        : BigInt(this._width * this._height - 1 - raw)
      result |= 1n << index
    }
    [this._width, this._height] = [this._height, this._width]
    this._bitboard = result
    return this
  }

  reflect() {
    let result = 0n
    for (const { row, col } of this.cells(bit => bit === 1)) {
      const i = BigInt((this._height - 1 - row) * this._width + col)
      const index = this._littleEndian
        ? i
        : BigInt(this.size() - 1) - i
      result |= 1n << index
    }
    this._bitboard = result
    return this
  }

  rotate() {
    return this.reflect().transpose()
  }

  fill(...args) {
    if (args.length === 0) {
      // Fill entire bitboard
      this._bitboard = (1n << BigInt(this.size())) - 1n
      return this
    }
    let row, col
    args.forEach(arg =>
      typeof arg === 'number' && row === undefined ? row = arg :
        typeof arg === 'number' && col === undefined ? col = arg : null
    )
    if (col === undefined) {
      // Fill entire row
      for (let c = 0; c < this._width; c++) this.fill(row, c)
    } else {
      // Fill single cell
      const index = BigInt(this.index(row, col))
      this._bitboard |= (1n << index)
    }
    return this
  }

  clear(...args) {
    if (args.length === 0) {
      // Clear entire bitboard
      this._bitboard = 0n
      return this
    }
    let row, col
    args.forEach(arg =>
      typeof arg === 'number' && row === undefined ? row = arg :
        typeof arg === 'number' && col === undefined ? col = arg : null
    )
    if (col === undefined) {
      // Clear entire row
      for (let c = 0; c < this._width; c++) this.clear(row, c)
    } else {
      // Clear single cell
      const index = BigInt(this.index(row, col))
      this._bitboard &= ~(1n << index)
    }
    return this
  }

  toggle(...args) {
    if (args.length === 0) {
      // Toggle all bits
      const mask = (1n << BigInt(this.size())) - 1n
      this._bitboard ^= mask
      return this
    }
    let row, col
    args.forEach(arg =>
      typeof arg === 'number' && row === undefined ? row = arg :
        typeof arg === 'number' && col === undefined ? col = arg : null
    )
    if (col === undefined) {
      // Toggle entire row (non-recursive)
      for (let c = 0; c < this._width; c++) {
        const index = BigInt(this.index(row, c))
        this._bitboard ^= (1n << index)
      }
    } else {
      // Toggle single cell
      const index = BigInt(this.index(row, col))
      this._bitboard ^= (1n << index)
    }
    return this
  }

  isFilled(row, col) {
    const index = BigInt(this.index(row, col))
    return (this._bitboard >> index) & 1n ? true : false
  }

  isEmpty(row, col) {
    return !this.isFilled(row, col)
  }

  toBinaryString() {
    return this._bitboard.toString(2)
  }

  mask() {
    return (1n << BigInt(this.size())) - 1n
  }

  and(other) {
    const fitted = other._fit(this)
    return this._create((this._bitboard & fitted.bitboard) & this.mask(), this._width, this._height, this._littleEndian)
  }

  or(other) {
    const fitted = other._fit(this)
    return this._create((this._bitboard | fitted.bitboard) & this.mask(), this._width, this._height, this._littleEndian)
  }

  xor(other) {
    const fitted = other._fit(this)
    return this._create((this._bitboard ^ fitted.bitboard) & this.mask(), this._width, this._height, this._littleEndian)
  }

  not() {
    return this._create((~this._bitboard) & this.mask(), this._width, this._height, this._littleEndian)
  }

  _fit(other) {
    const width = other.width
    const height = other.height
    const original = this.bitboard
    const fitted = new Bitboard(0n, width, height, this._littleEndian)
    for (const { row, col, bit } of this) {
      if (row < height && col < width && bit) {
        fitted.fill(row, col)
      }
    }
    if (fitted.bitboard !== original) {
      console.warn(`Bitboard value changed from ${original} to ${fitted.bitboard} to fit dimensions (${width}, ${height})`)
    }
    return fitted
  }

  order() {
    let count = 0n
    let v = this._bitboard
    while (v) {
      count += v & 1n
      v >>= 1n
    }
    return Number(count)
  }

  ring(row, col, radius = 1, wrap = true) {
    const W = this._width
    const H = this._height
    const S = 2 * radius + 1
    let bits = 0n
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const isRing = Math.abs(dr) === radius || Math.abs(dc) === radius || (dr === 0 && dc === 0)
        if (!isRing) continue
        let rr = row + dr
        let cc = col + dc
        if (!wrap) {
          if (rr < 0 || rr >= H || cc < 0 || cc >= W) continue
        } else {
          rr = (rr + H) % H
          cc = (cc + W) % W
        }
        const originalIndex = BigInt(this.index(rr, cc))
        const bit = (this._bitboard >> originalIndex) & 1n
        if (bit) {
          const newIndex = BigInt((dr + radius) * S + (dc + radius))
          bits |= 1n << newIndex
        }
      }
    }
    return this._create(bits, S, S, false)
  }

  translate(dx = 0, dy = 0, wrap = true) {
    let result = 0n
    for (const { row, col } of this.cells(bit => bit === 1)) {
      let r2 = row + dy
      let c2 = col + dx
      if (wrap) {
        r2 = (r2 + this._height) % this._height
        c2 = (c2 + this._width) % this._width
        const index = BigInt(this.index(r2, c2))
        result |= 1n << index
      } else if (r2 >= 0 && r2 < this._height && c2 >= 0 && c2 < this._width) {
        const index = BigInt(this.index(r2, c2))
        result |= 1n << index
      }
    }
    return this._create(result, this._width, this._height, this._littleEndian)
  }

  /*
  shift(dx = 1, wrap = true) {
    const totalBits = BigInt(this.size())
    const mask = (1n << totalBits) - 1n
    if (dx === 0) return this._create(this._bitboard, this._width, this._height, this._littleEndian)
    if (Math.abs(dx) !== 1) {
      console.warn('shift only supports dx = -1, 0, or 1.')
      return this._create(this._bitboard, this._width, this._height, this._littleEndian)
    }
    const left = dx === 1
    let result
    if (wrap) {
      // Circular shift
      result = left
        ? ((this._bitboard << 1n) | (this._bitboard >> (totalBits - 1n))) & mask
        : ((this._bitboard >> 1n) | ((this._bitboard & 1n) << (totalBits - 1n))) & mask
    } else {
      // Logical shift (zero fill)
      result = left
        ? (this._bitboard << 1n) & mask
        : this._bitboard >> 1n
    }
    return this._create(result, this._width, this._height, this._littleEndian)
  }
  */

  shift(wrap = true) {
    const totalBits = BigInt(this.size())
    const mask = (1n << totalBits) - 1n
    const leftShifted = this._bitboard << 1n
    let result = wrap
      ? (leftShifted | (this._bitboard >> (totalBits - 1n))) & mask  // circular shift
      : leftShifted & mask                                           // logical shift
    return this._create(result, this._width, this._height, this._littleEndian)
  }

  bounds() {
    let minRow = this._height, maxRow = -1, minCol = this._width, maxCol = -1
    for (let row = 0; row < this._height; row++) {
      for (let col = 0; col < this._width; col++) {
        const i = BigInt(this.index(row, col))
        if (((this._bitboard >> i) & 1n) === 1n) {
          if (row < minRow) minRow = row
          if (row > maxRow) maxRow = row
          if (col < minCol) minCol = col
          if (col > maxCol) maxCol = col
        }
      }
    }
    return minRow <= maxRow
      ? { row: minRow, col: minCol, width: maxCol - minCol + 1, height: maxRow - minRow + 1 }
      : undefined
  }

  crop(row, col, w, h) {
    let result = 0n
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const sourceIndex = BigInt(new Bitboard(0n, this._width, this._height, this._littleEndian).index(row + r, col + c))
        const targetIndex = BigInt(new Bitboard(0n, w, h, this._littleEndian).index(r, c))
        if (((this._bitboard >> sourceIndex) & 1n) === 1n) {
          result |= 1n << targetIndex
        }
      }
    }
    return this._create(result, w, h, this._littleEndian)
  }
}

// Export the Bitboard class as the default export
export default Bitboard