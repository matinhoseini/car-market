@'
/** @type {import('postcss').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
'@ | Out-File -FilePath postcss.config.mjs -Encoding utf8