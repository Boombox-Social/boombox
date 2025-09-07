// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      ".env*",
      "prisma/migrations/**",
      "src/generated/**",
      "prisma/generated/**",
      "**/generated/**",
      "**/*.generated.*",
      "**/*.min.js",
      "**/*.bundle.js",
      "**/wasm.js",
      "**/wasm-engine*.js",
      "**/runtime/**",
      "**/.next/**",
      "**/node_modules/**",
      "**/.cache/**",
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    languageOptions: {
      parser: compat.config({
        parser: "@typescript-eslint/parser",
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
          project: "./tsconfig.json",
          tsconfigRootDir: __dirname,
        },
      })[0].languageOptions.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-console": "off",
      
      // Enhanced duplicate detection rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      
      // Catch duplicate declarations
      "no-redeclare": "error",
      "@typescript-eslint/no-redeclare": "error",
      
      // Catch duplicate function declarations
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-func-assign": "error",
      
      // Catch duplicate imports
      "no-duplicate-imports": "error",
      "import/no-duplicates": "error",
      
      // TypeScript specific duplicate detection - DISABLE problematic rules
      "@typescript-eslint/no-duplicate-enum-values": "off", // Disable this rule
      "@typescript-eslint/no-duplicate-type-constituents": "off", // Disable this rule
      
      // React Hooks Rules
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      
      // Relaxed rules for development
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-interface": "warn",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "prefer-const": "off",
      "import/no-anonymous-default-export": "off",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "no-unused-expressions": "off",
      "no-inner-declarations": "error",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
    }
  },
  // File-specific overrides
  {
    files: ["**/*.tsx", "**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-redeclare": "error",
      "@typescript-eslint/no-redeclare": "error",
    }
  },
  {
    files: ["src/app/contexts/**/*.tsx"],
    rules: {
      "react-hooks/exhaustive-deps": "warn",
    }
  },
  {
    files: ["src/app/components/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-redeclare": "error",
      "@typescript-eslint/no-redeclare": "error",
    }
  },
];

export default eslintConfig;