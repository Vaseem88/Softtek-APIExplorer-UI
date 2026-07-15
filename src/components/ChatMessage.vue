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
  format: {
    type: String,
    required: true,
    default: 'pretty-json',
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

const formattedOutput = computed(() => {
  const content = props.message.data ?? props.message.text ?? props.message
  if (typeof content === 'string') {
    return content
  }

  switch (props.format) {
    case 'json-compact':
      return JSON.stringify(content)
    case 'yaml':
      return objectToYaml(content)
    case 'raw':
      return String(content)
    case 'pretty-json':
    default:
      return JSON.stringify(content, null, 2)
  }
})

function objectToYaml(value, indent = 0) {
  const prefix = ' '.repeat(indent)

  if (value === null) {
    return 'null'
  }

  if (typeof value === 'string') {
    const escaped = value.replace(/"/g, '\\"')
    if (escaped.includes('\n')) {
      const lines = escaped.split('\n').map((line) => `${prefix}  ${line}`)
      return `|\n${lines.join('\n')}`
    }
    return `"${escaped}"`
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        const formatted = objectToYaml(item, indent + 2)
        if (typeof item === 'object' && item !== null) {
          return `${prefix}-\n${formatted}`
        }
        return `${prefix}- ${formatted}`
      })
      .join('\n')
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, item]) => {
        if (item === null || typeof item !== 'object') {
          return `${prefix}${key}: ${objectToYaml(item, 0)}`
        }
        return `${prefix}${key}:\n${objectToYaml(item, indent + 2)}`
      })
      .join('\n')
  }

  return String(value)
}
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
