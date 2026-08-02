import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    // Without this, `npm run lint` walks build output and design-system bundles
    // and reports ~4,000 errors in generated JavaScript, which buries the real
    // findings in `src/` and makes lint useless as a CI gate.
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "design-system/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
