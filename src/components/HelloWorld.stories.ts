import type { Meta, StoryObj } from '@storybook/vue3-vite'

import HelloWorld from './HelloWorld.vue'

const meta = {
  args: {
    msg: 'Welcome to Vue 3 + Vite',
  },
  render: (args) => ({
    components: { HelloWorld },
    setup() {
      return { args }
    },
    template: '<HelloWorld v-bind="args" />',
  }),
} satisfies Meta<typeof HelloWorld>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}
