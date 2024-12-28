import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect", // React sürümünü otomatik olarak algılar
      },
    },
  },
  {
    rules: {
      // JSX kullanımı için React'ın scope'ta olması gerekmiyor (React 17+ kullanıyorsanız)
      "react/react-in-jsx-scope": "off",
      // PropTypes kuralını aktifleştirmeniz gerekebilir
      "react/prop-types": "warn",
    },
  },
];
