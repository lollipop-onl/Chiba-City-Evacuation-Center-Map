import { UserConfig } from 'vite';
import path from 'path';

const config: UserConfig = {
  cssPreprocessOptions: {
    scss: {
      includePaths: [path.join(__dirname, 'src/assets/styles')],
    }
  }
};

export default config;
