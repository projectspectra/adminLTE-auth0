import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

const configs = [
  { ...pluginJs.configs.recommended },
  ...tseslint.configs.recommended,
];

configs.forEach((config) => {
  // lint only ts files
  config.files = [
    "**/*.ts",
  ];

  config.ignores = [
    "public/**/*",
    "dist/**/*",
  ];

  config.rules = {
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-empty-object-type": "off",
  }
});

// Uncomment to see eslint configs
// console.log(tseslint.configs.recommended);

/** @type {import('eslint').Linter.Config[]} */
export default configs;