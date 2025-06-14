import type { Preview } from "@storybook/react-vite";

import '../node_modules/@beesoft/headless-ui/dist/headless-ui.css';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;
