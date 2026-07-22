<template>
  <div class="chat-page">
    <div class="chat-header">
      <div>
        <h1>API Chatbot</h1>
        <p>Ask the AI agent for API details, examples, or results in your preferred format.</p>
      </div>
      <button class="clear-button" @click="clearChat" type="button">Clear conversation</button>
    </div>

    <section class="chat-window">
      <div v-if="apiStore.error" class="chat-error">
        {{ apiStore.error.message || apiStore.error }}
      </div>

      <div class="messages" ref="messagesRef">
        <ChatMessage
          v-for="(message, index) in apiStore.chatData"
          :key="index"
          :message="message"
        />
      </div>

      <div class="chat-footer">
        <textarea
          v-model="userQuery"
          class="chat-input"
          rows="3"
          placeholder="Type a question, example request, or desired output format..."
          @keydown.enter.exact.prevent="sendMessage"
        />

        <div class="footer-actions">
          <q-btn
            class="send-button"
            :disabled="!userQuery.trim() || apiStore.loading"
            @click="sendMessage"
          >
            {{ apiStore.loading ? 'Sending…' : 'Send' }}
          </q-btn>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useApiStore } from '../stores/apiStore'
import ChatMessage from '../components/ChatMessage.vue'

const apiStore = useApiStore()
const userQuery = ref('')
const messagesRef = ref(null)

function scrollToBottom() {
  nextTick(() => {
    const el = messagesRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

async function sendMessage() {
  const query = userQuery.value.trim()
  if (!query) {
    return
  }

  await apiStore.loadChatData('playground/chat', query)
  userQuery.value = ''
  scrollToBottom()
}

function clearChat() {
  apiStore.clearChatData()
}

onMounted(async () => {
  apiStore.fetchDataFromLocalStorage()
  await nextTick()
  scrollToBottom()
})
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.chat-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.chat-header h1 {
  margin: 0 0 0.25rem;
}

.chat-header p {
  margin: 0;
  color: #555;
}

.clear-button,
.send-button {
  border: none;
  background: #2857eb;
  color: white;
  padding: 1.25rem 7rem;
  border-radius: 999px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease;
}

.clear-button {
  background: #6b7280;
}

.clear-button:hover,
.send-button:hover {
  transform: translateY(-1px);
}

.clear-button:disabled,
.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.chat-window {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-error {
  padding: 1rem;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 0.75rem;
  color: #991b1b;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 55vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.chat-footer {
  display: grid;
  gap: 1rem;
}

.chat-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  padding: 0.9rem;
  resize: vertical;
  min-height: 84px;
  font: inherit;
}

.footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: end;
}

.footer-actions label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.95rem;
  color: #333;
}

.footer-actions select {
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  padding: 0.65rem 0.75rem;
  background: white;
}
</style>
