<template>
  <div :class="['chat-message', message.role === 'user' ? 'user-message' : 'assistant-message']">
    <div class="message-header">
      <span class="message-role">{{ message.role === 'user' ? 'You' : 'AI Assistant' }}</span>
      <span class="message-time">{{ formattedTimestamp }}</span>
    </div>

    <div class="message-body">
      <template v-if="message.role === 'user'">
        <p>{{ message.text }}</p>
      </template>
      <template v-else>
        <pre>{{ message.data.explanation }}</pre>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const formattedTimestamp = computed(() => {
  if (!props.message.timestamp) {
    return ''
  }
  return new Date(props.message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<style scoped>
.chat-message {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  max-width: 100%;
}

.user-message {
  background: #e6f4ff;
  border: 1px solid #b3e5ff;
  align-self: flex-end;
}

.assistant-message {
  background: #f4f4f5;
  border: 1px solid #d3d3d8;
  align-self: flex-start;
}

.message-header {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: #555;
}

.message-role {
  font-weight: 600;
}

.message-body pre,
.message-body p {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  line-height: 1.5;
}
</style>
