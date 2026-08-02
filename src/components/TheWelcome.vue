<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApiStore } from '../stores/apiStore'

const apiStore = useApiStore()
const router = useRouter()
const text = ref('')
const statusMessage = ref('')

const exploreApi = async () => {
  const endpoint = text.value?.trim()
  let swaggerUrl = endpoint

  if (!endpoint) {
    statusMessage.value = 'Please enter an API endpoint before exploring.'
    return
  }

  statusMessage.value = ''
  await apiStore
    .loadApiData('playground/load', { swaggerUrl })
    .then(async () => {
      if (apiStore.error) {
        statusMessage.value = `Error loading API data: ${apiStore.error}`
        return
      } else {
        statusMessage.value = 'API data loaded successfully!'
        let baseUrl = apiStore.data?.allowedDomains[0] || endpoint

        await apiStore.loadChatData(
          'playground/chat',
          `Hello, I would like to explore the API ${baseUrl}. Please provide me with an overview of the API in simple terms, including its purpose, main features, and any important details I should know. Please keep the explanation easy to understand.`,
          true,
        )
        // route to chat page
        router.push('/chat')
      }
    })
    .catch((error) => {
      statusMessage.value = `Error loading API data: ${error.message}`
    })
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
              :disable="apiStore.loading"
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
