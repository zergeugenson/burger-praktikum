module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: { jsx: true },
	},
	plugins: [
		'react',
		'react-hooks',
		'react-refresh',
		'@typescript-eslint',
		'prettier',
		'unused-imports',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
		'prettier',
	],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'unused-imports/no-unused-imports': 'error',
		'prettier/prettier': 'error',
	},
	settings: {
		react: { version: 'detect' },
	},
	ignorePatterns: ['dist', 'node_modules'],
};
