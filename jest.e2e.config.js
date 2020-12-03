/* eslint-disable @typescript-eslint/no-var-requires */
const tsConfig = require('./tsconfig.json')
const moduleNameMapper = require('tsconfig-paths-jest')(tsConfig)

module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testEnvironment: 'node',
    testRegex: '.e2e.test.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper,
}
