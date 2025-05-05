module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '\\.[jt]sx?$': 'esbuild-jest',
    },
    moduleNameMapper: {
        '^react-i18next$': '<rootDir>/__mocks__/react-i18next.js',
    },
};
