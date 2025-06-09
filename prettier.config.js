module.exports = {
  semi: false,
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  importOrder: ["^react", "^[a-z]", "^@", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
