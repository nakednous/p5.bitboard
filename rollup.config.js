import resolve from '@rollup/plugin-node-resolve'

const external = ['p5']

export default [
  // ESM build for npm / Vite
  {
    input: 'src/addon.js',
    external,
    output: {
      file: 'dist/p5.bitboard.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [resolve()]
  },
  // IIFE build for <script> / CDN
  {
    input: 'src/addon.js',
    external,
    output: {
      file: 'dist/p5.bitboard.js',
      format: 'iife',
      name: 'Bitboard',
      globals: { p5: 'p5' },
      exports: 'default',
      sourcemap: true
    },
    plugins: [resolve()]
  }
]
