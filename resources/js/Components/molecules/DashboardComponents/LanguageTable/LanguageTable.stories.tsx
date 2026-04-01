import type { StoryObj } from '@storybook/react';

import LanguageTable from './LanguageTable';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Language/Table',
  component: LanguageTable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LanguageTable>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    style: { width: 700 },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Error: Story = {
  args: {
    error: 'Error loading language',
  },
};
