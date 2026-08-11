import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApiStore = defineStore('api', () => {
  const data = ref([])
  const loading = ref(false)
  const error = ref(null)
  const chatData = ref([])
  const baseUrl = 'http://localhost:5206/api/'

  function fetchDataFromLocalStorage() {
    const storedData = localStorage.getItem('apiData')
    if (storedData) {
      data.value = JSON.parse(storedData)
    }

    const storedChatData = localStorage.getItem('chatData')
    if (storedChatData) {
      chatData.value = JSON.parse(storedChatData)
    }
  }

  async function loadApiData(endpoint, body) {
    fetchDataFromLocalStorage()

    if (data.value && data.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null

    await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((jsonData) => {
        data.value = jsonData
        localStorage.setItem('apiData', JSON.stringify(jsonData))
        chatData.value = []
        localStorage.removeItem('chatData')
      })
      .catch((err) => {
        error.value = err
      })
      .finally(() => {
        loading.value = false
      })
  }

  async function loadChatData(endpoint, userQuery, firstLoad = false) {
    if (!userQuery || !userQuery.trim()) {
      return
    }

    loading.value = true
    error.value = null

    if (!firstLoad) {
      const now = new Date().toISOString()
      chatData.value.push({
        role: 'user',
        text: userQuery,
        timestamp: now,
      })
      localStorage.setItem('chatData', JSON.stringify(chatData.value))
    }

    const charRequest = {
      sessionId: data.value?.sessionId ?? null,
      intent: userQuery,
    }

    await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(charRequest),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((jsonData) => {
        chatData.value.push({
          role: 'assistant',
          data: jsonData,
          timestamp: new Date().toISOString(),
        })
        localStorage.setItem('chatData', JSON.stringify(chatData.value))
      })
      .catch((err) => {
        error.value = err
      })
      .finally(() => {
        loading.value = false
      })
  }

  function clearChatData() {
    chatData.value = []
    localStorage.removeItem('chatData')
  }

  async function loadChatStreamData(endpoint, userQuery, firstLoad = false) {
    loading.value = true
    error.value = null

    if (!firstLoad) {
      const now = new Date().toISOString()
      chatData.value.push({
        role: 'user',
        text: userQuery,
        timestamp: now,
      })
      localStorage.setItem('chatData', JSON.stringify(chatData.value))
    }

    const charRequest = {
      sessionId: data.value?.sessionId ?? null,
      intent: userQuery,
    }
    let accumulatedData = ''

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(charRequest),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      // Create the assistant message entry upfront
      const assistantMessageIndex = chatData.value.length
      chatData.value.push({
        role: 'assistant',
        data: { explanation: '' },
        timestamp: new Date().toISOString(),
      })

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          if (buffer.trim()) {
            const event = parseSSEEvent(buffer)
            if (event) {
              accumulatedData += event
              chatData.value[assistantMessageIndex].data.explanation = accumulatedData
              scrollToBottom()
            }
          }
          break
        }

        let chunkText = decoder.decode(value, { stream: true })
        loading.value = false

        buffer += chunkText
        const lines = buffer.split('\n')
        buffer = lines[lines.length - 1]

        for (let i = 0; i < lines.length - 1; i++) {
          if (lines[i].trim()) {
            const event = parseSSEEvent(lines[i])
            if (event) {
              accumulatedData += event
              // Update the assistant message in real-time as data streams in
              chatData.value[assistantMessageIndex].data.explanation = accumulatedData
              scrollToBottom()
            }
          }
        }
      }
      localStorage.setItem('chatData', JSON.stringify(chatData.value))
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  function parseSSEEvent(line) {
    if (!line.startsWith('data: ')) {
      return null
    }

    let parsedLine = line.replace(/^data: /, '')
    if (parsedLine === '[DONE]') {
      return null
    } else if (parsedLine == '') {
      return parsedLine + '\n'
    }
    return parsedLine
  }

  function scrollToBottom() {
    const chatWindow = document.querySelector('.chat-window > .messages')
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight
    }
  }

  return {
    data,
    loading,
    error,
    chatData,
    loadApiData,
    loadChatData,
    loadChatStreamData,
    clearChatData,
    fetchDataFromLocalStorage,
  }
})
