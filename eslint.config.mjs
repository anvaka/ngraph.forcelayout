import globals from "globals";

export default [
  {
    ignores: ["**/dist", "demo/dist"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      semi: "error",
      "no-undef": "error",
      "no-unused-vars": "error",
      "no-shadow": "error",
    },
  },
];
