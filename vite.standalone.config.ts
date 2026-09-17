import { copyFileSync, rmSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Builds the same app as vite.config.ts into one self-contained file that runs
 * from disk: dist/RiskPoint.html. Scripts, styles and fonts are inlined.
 *
 * It builds into a temporary directory and copies the result out, so the normal
 * build's dist/index.html is left untouched.
 */
const TMP = 'dist/.standalone';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteSingleFile(),
    {
      name: 'riskpoint-standalone-output',
      closeBundle() {
        copyFileSync(`${TMP}/index.html`, 'dist/RiskPoint.html');
        rmSync(TMP, { recursive: true, force: true });
        this.info('Standalone build written to dist/RiskPoint.html');
      },
    },
  ],
  build: {
    outDir: TMP,
    emptyOutDir: true,
    // Inline every asset, including the Sora woff2 files.
    assetsInlineLimit: 100_000_000,
  },
});
