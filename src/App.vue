<script setup>
import Header from '@/components/Header.vue'
</script>

<template>
  <div class="app-container">
    <Header />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
/* Global Reset */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #2d1b69 0%, #462985 100%);
  color: var(--text-color);
}

:root {
  --primary-color: #1db954;
  --background-color: #121212;
  --text-color: #ffffff;
  --secondary-text: #b3b3b3;
  --card-background: #181818;
  --hover-color: #282828;
  --header-height: 64px;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  width: 100%;
  margin-top: var(--header-height);
}

a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--primary-color);
}

button {
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  main {
    padding: 1rem;
  }
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
