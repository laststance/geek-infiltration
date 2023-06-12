module.exports = {
  extends: ['ts-prefixer'],
  globals: {},
  plugins: ['react-hooks', 'react'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
