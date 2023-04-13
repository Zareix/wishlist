/** @type {import("prettier").Config & import("@trivago/prettier-plugin-sort-imports").PluginConfig} */
const config = {
    printWidth: 80,
    tabWidth: 2,
    trailingComma: 'all',
    singleQuote: true,
    semi: true,
    importOrder: ['^@/(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    plugins: [
        require.resolve('@trivago/prettier-plugin-sort-imports'),
        require.resolve('prettier-plugin-tailwindcss'),
    ],
};

module.exports = config;
