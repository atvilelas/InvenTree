import type { Plugin } from 'vite';

import { exec } from 'child_process';

export function ExtractSVGWatcher(): Plugin {
  return {
    name: 'vite-plugin-extract-icon',
    apply: 'serve', // works correctly now because of Plugin typing
    configureServer(server) {
      server.watcher.on('change', (file: string) => {
        if (file.indexOf('lib/images/svg') !== -1 || file.indexOf('lib/scripts')) {
          return;
        }
        if (
          file.endsWith('.tsx') ||
          file.endsWith('.ts') ||
          file.endsWith('.vue') ||
          file.endsWith('.html')
        ) {
          console.log(`[extract-iconify] File changed: ${file}`);
          exec(
            'vite-node ./lib/scripts/extractIcons.ts',
            (err, stdout, stderr) => {
              if (err) {
                console.error(`[extract-iconify] Error:\n${stderr}`);
              } else {
                console.log(`[extract-iconify] Done:\n${stdout}`);
              }
            },
          );
        }
      });
    },
  };
}
