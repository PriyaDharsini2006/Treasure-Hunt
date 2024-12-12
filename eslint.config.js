import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default {
  extends: compat.extends("next/core-web-vitals"),
  parserOptions: {
    ecmaVersion: 2021,  // Ensure ECMAScript version
    sourceType: "module",  // Use module source type
  },
};
