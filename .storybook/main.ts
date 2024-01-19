import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: 'vite.config.ts',
      },
    },
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal(config) {
    config.plugins = (config.plugins ?? []).filter((plugin) => plugin && 'name' in plugin && plugin.name !== 'vite:dts');
    return config;
  },
};

export default config;
