// eslint-disable-next-line @typescript-eslint/no-var-requires
const moduleNameMapper = require('tsconfig-paths-jest')({
    compilerOptions: {
        baseUrl: './',
        paths: {
            '@/*': ['./src/*'],
        },
    },
})

module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testEnvironment: 'node',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper,
}
