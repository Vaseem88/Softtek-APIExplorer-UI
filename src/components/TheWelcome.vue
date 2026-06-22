<script setup></script>

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
            <q-btn color="secondary" icon-right="dynamic_form" label="Explore API" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </div>
</template>
