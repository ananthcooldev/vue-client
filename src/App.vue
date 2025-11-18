<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">Vue .NET CRUD</router-link>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/items">Items</router-link>
          <router-link to="/products">Products</router-link>
          <button v-if="isAuthenticated" @click="handleLogout" class="btn-logout">Logout</button>
          <router-link v-else to="/login" class="btn-login">Login</router-link>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from './services/authService';
import Footer from './components/Footer.vue';

const router = useRouter();
const isAuthenticated = ref(false);

const checkAuth = () => {
  isAuthenticated.value = authService.isAuthenticated();
};

const handleLogout = () => {
  authService.logout();
  isAuthenticated.value = false;
  router.push('/login');
};

onMounted(() => {
  checkAuth();
  // Update auth status when route changes
  router.afterEach(() => {
    checkAuth();
  });
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #42b983;
}

.btn-logout,
.btn-login {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background 0.2s;
}

.btn-logout:hover,
.btn-login:hover {
  background: #35a372;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}
</style>
