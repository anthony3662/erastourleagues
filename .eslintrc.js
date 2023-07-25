module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },

  ignorePatterns: ['*.spec.*', '**/build/**'],
  extends: ['react-app', 'prettier', 'plugin:import/typescript'],
  plugins: ['import', 'prettier', 'react-hooks'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  rules: {
    'prettier/prettier': ['error'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'import/extensions': 0,
  },
};
