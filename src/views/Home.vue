<template>
  <div class="home">
    <h1>Welcome to Vue .NET CRUD Application</h1>
    <div class="cards">
      <router-link to="/items" class="card">
        <h2>Items Management</h2>
        <p>Manage your items (Requires Authentication)</p>
      </router-link>
      <router-link to="/products" class="card">
        <h2>Products Management</h2>
        <p>Manage your products</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #42b983;
  margin-bottom: 2rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.card {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card h2 {
  color: #42b983;
  margin-bottom: 1rem;
}

.card p {
  color: #666;
}
</style>

