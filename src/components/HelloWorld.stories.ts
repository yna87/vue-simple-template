import { expect, within } from '@storybook/test'
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

// Test Counter
export const Counter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Get button elements
    const countUpButton = await canvas.getByRole('button', { name: '+' })
    const countDownButton = await canvas.getByRole('button', { name: '-' })
    const resetButton = await canvas.getByRole('button', { name: 'Reset' })

    // Check initial count value
    const countValue = await canvas.getByText('Count: 0')
    await expect(countValue).toBeInTheDocument()

    // Click the count up button
    await countUpButton.click()
    await expect(canvas.getByText('Count: 1')).toBeInTheDocument()

    // Click the reset button
    await resetButton.click()
    await expect(canvas.getByText('Count: 0')).toBeInTheDocument()

    // Click the count down button
    await countDownButton.click()
    await expect(canvas.getByText('Count: -1')).toBeInTheDocument()
  },
}
