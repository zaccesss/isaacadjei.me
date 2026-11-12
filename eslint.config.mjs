import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    // a dot folder at the root holds build output, caches or a tool's working files, never the site's own source
    ignores: [".*/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default config;
