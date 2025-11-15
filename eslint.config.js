import { fixupPluginRules } from "@eslint/compat";
import pluginJs from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettier from "eslint-plugin-prettier";
import promise from "eslint-plugin-promise";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default [
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: { "react-hooks": fixupPluginRules(pluginReactHooks) },
    rules: { ...pluginReactHooks.configs.recommended.rules },
  },
  {
    settings: { react: { version: "detect" } },
    rules: {
      "react/no-array-index-key": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "no-undef": "error",
      "no-useless-escape": "off",
      "react/prop-types": "off",
      "no-unused-vars": "warn",
      "no-var": "warn",
      "react/jsx-no-duplicate-props": "warn",
      "react/self-closing-comp": "off",
      "react/jsx-pascal-case": "warn",
      "react/destructuring-assignment": ["warn", "always"],
      "react/no-deprecated": "warn",
      "react/require-render-return": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/display-name": "off",

      // General consistency
      "no-console": ["warn", { allow: ["warn", "error", "log"] }],
      "prefer-const": "error",
      eqeqeq: ["error", "smart"],
      "object-shorthand": ["error", "always"],
      "no-param-reassign": ["warn", { props: false }],
      complexity: ["warn", { max: 15 }],
    },
  },
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  // Extra plugins and their rules
  {
    plugins: {
      "jsx-a11y": jsxA11y,
      unicorn,
      promise,
      "import-x": importX,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Prettier formatting surfaced as lint errors
      "prettier/prettier": "error",

      // Accessibility
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/no-static-element-interactions": "warn",

      // unicorn best practices
      // "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "unicorn/no-null": "off",
      "unicorn/prefer-query-selector": "error",
      "unicorn/prefer-node-protocol": "error",

      // promise hygiene
      "promise/no-return-wrap": "error",
      "promise/no-nesting": "warn",

      // import static checks only (sorting is handled by Prettier plugin)
      "import-x/no-duplicates": "error",
      "import-x/no-mutable-exports": "error",
      "import-x/no-useless-path-segments": "warn",
      "import-x/no-cycle": "warn",
    },
  },
  { ignores: [".next/*", "node_modules/*", "src/generated/*"] },
  { files: ["**/*.jsx", "**/*.js", "**/*.ts", "**/*.tsx"] },
  { languageOptions: { globals: { ...globals.node, ...globals.browser, Bun: "readonly" } } },
  prettier,
];
