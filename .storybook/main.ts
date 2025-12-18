import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    "../src/stories/*.stories.ts",
    "../src/tests/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  framework: "@storybook/react-vite",
  addons: ['storybook-addon-fetch-mock'],
};
export default config;
