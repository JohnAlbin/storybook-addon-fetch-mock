import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  addons: ["@chr33s/storybook-addon-fetch-mock"],
  core: { disableTelemetry: true },
  framework: "@storybook/react-vite",
  stories: ["../tests/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
};
export default config;
