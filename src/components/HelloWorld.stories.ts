import type { Meta, StoryObj } from '@storybook/vue3-vite'

import HelloWorld from './HelloWorld.vue'

type CustomArgs = InstanceType<typeof HelloWorld> & {}

const meta: Meta<CustomArgs> = {
  args: {
    msg: 'Hello World!',
  },
  render: (args) => ({
    components: { HelloWorld },
    setup() {
      return { args }
    },
    template: '<HelloWorld v-bind="args" />',
  }),
}

export default meta
type Story = StoryObj<CustomArgs>

export const Basic: Story = {}
