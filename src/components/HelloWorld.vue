<script setup lang="ts">
import { useCounter } from '@/composables/useCounter';

defineProps<{
  msg: string
}>()

const { count, increment, decrement, reset } = useCounter()
</script>

<template>
  <div class="space-y-6 flex flex-col items-center">
    <h1 class="text-3xl font-bold">{{ msg }}</h1>

    <div class="space-y-4 flex flex-col items-center">
      <p class="text-lg">Count: {{ count }}</p>
      <div class="flex gap-2 justify-center">
        <button @click="increment" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          +
        </button>
        <button @click="decrement" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          -
        </button>
        <button @click="reset" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
