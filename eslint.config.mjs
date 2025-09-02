import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow console.log in development
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          "argsIgnorePattern": "^_", 
          "varsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_"
        }
      ],
      // Allow explicit any when needed
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow empty interfaces for extending
      "@typescript-eslint/no-empty-interface": "warn",
      // Disable prefer-const for destructuring
      "prefer-const": ["error", { "destructuring": "all" }],
      // Allow non-null assertions when necessary
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },
  {
    ignores: [
      ".next/**/*",
      "out/**/*", 
      "build/**/*",
      "dist/**/*",
      "generated/**/*",
      "src/generated/**/*",
      "prisma/migrations/**/*",
      "node_modules/**/*",
      "*.config.js",
      "*.config.mjs",
    ],
  },
];

export default eslintConfig;