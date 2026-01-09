import { expect } from "storybook/test";
import { Component } from "./component";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Component",
  component: Component,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Component>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await expect(canvas.getByText("Error fetching data")).toBeInTheDocument();
  },
};

export const Mock: Story = {
  parameters: {
    fetchMock: {
      mocks: [
        {
          matcher: { url: "http://localhost" },
          response: {
            body: "Fetch mocked",
            status: 200,
          },
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Fetch mocked")).toBeInTheDocument();
  },
};
