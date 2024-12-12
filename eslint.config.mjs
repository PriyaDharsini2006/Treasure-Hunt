import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    extends: ["next/core-web-vitals"], // This should be an array as part of flat config
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
  },
];
