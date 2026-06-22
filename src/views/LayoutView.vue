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

          <q-item clickable class="text-primary" v-ripple to="/explorer">
            <q-item-section>Explorer</q-item-section>
          </q-item>

          <q-item clickable class="text-primary" v-ripple to="/chat">
            <q-item-section>Chat</q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
