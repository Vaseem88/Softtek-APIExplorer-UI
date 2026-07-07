<script setup>
import { ref } from 'vue'

const text = ref('')
const isLoading = ref(false)
const statusMessage = ref('')

const exploreApi = async () => {
  const endpoint = text.value?.trim()
  let swaggerUrl = endpoint

  if (!endpoint) {
    statusMessage.value = 'Please enter an API endpoint before exploring.'
    return
  }

  isLoading.value = true
  statusMessage.value = ''

  try {
    const response = await fetch('http://localhost:5206/api/playground/load', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ swaggerUrl }),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json().catch(() => null)
    statusMessage.value = 'API playground loaded successfully.'
    console.log('Playground load response:', data)
  } catch (error) {
    const message = error?.message || 'Unknown error'
    statusMessage.value = `Failed to load API playground: ${message}`
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="welcome mt-48">
    <q-card flat bordered class="m-5 p-5 shadow">
      <q-card-section horizontal class="flex justify-center">
        <div class="text-h5">Welcome to the API Explorer!</div>
      </q-card-section>
      <q-card-section horizontal class="flex justify-center">
        <div class="text-subtitle2">Please enter the API endpoint you want to explore.</div>
      </q-card-section>

      <q-card-section horizontal class="flex justify-center">
        <q-input
          color="teal"
          outlined
          v-model="text"
          label="Please enter the API endpoint"
          class="w-1/2"
        >
          <template v-slot:append>
            <q-btn
              color="secondary"
              icon-right="dynamic_form"
              label="Explore API"
              @click="exploreApi"
              :disable="isLoading"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section horizontal class="justify-center">
        <div class="text-caption text-center text-black/60">
          {{ statusMessage }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
