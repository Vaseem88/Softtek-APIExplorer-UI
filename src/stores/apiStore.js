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

  return {
    data,
    loading,
    error,
    chatData,
    loadApiData,
    loadChatData,
    clearChatData,
    fetchDataFromLocalStorage,
  }
})
