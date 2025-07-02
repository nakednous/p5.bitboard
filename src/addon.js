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

p5.registerAddon((_, fn) => {
  fn.createBitboard = function (...args) {
    return new Bitboard(...args)
  }
});

// Export default for ESM and IIFE
export default Bitboard
// export { Bitboard } // requires a src/iife-entry.js