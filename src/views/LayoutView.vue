<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> API Explorer </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" elevated>
      <div>
        <q-list>
          <q-item clickable class="text-primary" v-ripple to="/">
            <q-item-section>Home</q-item-section>
          </q-item>

          <!-- <q-item clickable class="text-primary" v-ripple to="/explorer">
            <q-item-section>Explorer</q-item-section>
          </q-item> -->

          <q-item clickable class="text-primary" v-ripple to="/chat">
            <q-item-section>Chat</q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <div class="overlay" v-if="apiStore.loading">
        <q-spinner-ball color="red" class="spinner" />
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useApiStore } from '../stores/apiStore'
const apiStore = useApiStore()

const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
<style scoped>
.spinner {
  width: 10rem;
  height: 10rem;
  position: absolute;
  z-index: 9999;
}

/* Container that covers the entire screen */
.overlay {
  position: fixed; /* Sits on top of the viewport */
  top: 0;
  left: 0;
  width: 100vw; /* Full width */
  height: 100vh; /* Full height */
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent backdrop */
  z-index: 9999; /* Ensures it stays on top of other content */

  /* Centering Engine */
  display: flex;
  justify-content: center; /* Horizontally centers the loader */
  align-items: center; /* Vertically centers the loader */
}
</style>
