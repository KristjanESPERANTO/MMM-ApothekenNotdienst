import eslintPluginImport from "eslint-plugin-import";
import eslintPluginJs from "@eslint/js";
import eslintPluginStylistic from "@stylistic/eslint-plugin";
import globals from "globals";

const config = [
  eslintPluginJs.configs.all,
  {
    "files": ["**/*.js"],
    "languageOptions": {
      "globals": {
        ...globals.browser,
        ...globals.node,
        "Log": "readonly",
        "Module": "readonly"
      }
    },
    "plugins": {
      ...eslintPluginStylistic.configs["all-flat"].plugins,
      "import": eslintPluginImport
    },
    "rules": {
      ...eslintPluginImport.configs.recommended.rules,
      ...eslintPluginStylistic.configs["all-flat"].rules,
      "@stylistic/array-element-newline": ["error", "consistent"],
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/function-call-argument-newline": ["error", "consistent"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/object-property-newline": "off",
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/quote-props": ["error", "as-needed"],
      "capitalized-comments": "off",
      "consistent-this": "off",
      "line-comment-position": "off",
      "max-lines-per-function": ["error", 150],
      "max-statements": ["error", 50],
      "no-await-in-loop": "off",
      "no-inline-comments": "off",
      "no-magic-numbers": "off",
      "no-param-reassign": "off",
      "no-undef": "warn",
      "one-var": "off",
      "sort-keys": "off",
      "strict": "off"
    }
  },
  {
    "files": ["**/*.mjs"],
    "languageOptions": {
      "ecmaVersion": "latest",
      "globals": {
        ...globals.node
      },
      "sourceType": "module"
    },
    "plugins": {
      ...eslintPluginStylistic.configs["all-flat"].plugins
    },
    "rules": {
      ...eslintPluginStylistic.configs["all-flat"].rules,
      "@stylistic/array-element-newline": "off",
      "@stylistic/indent": ["error", 2],
      "@stylistic/padded-blocks": ["error", "never"],
      "func-style": "off",
      "max-lines-per-function": ["error", 100],
      "no-magic-numbers": "off",
      "one-var": "off",
      "prefer-destructuring": "off"
    }
  }
];

export default config;
