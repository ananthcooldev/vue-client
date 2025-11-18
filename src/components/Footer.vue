<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Vue .NET CRUD</h3>
          <p>A full-stack application built with Vue.js and .NET Core</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/items">Items</router-link></li>
            <li><router-link to="/products">Products</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Technologies</h4>
          <ul>
            <li>Vue.js 3</li>
            <li>.NET Core 9</li>
            <li>TypeScript</li>
            <li>Axios</li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>About</h4>
          <p>CRUD application demonstrating Vue.js frontend with .NET Core API backend.</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Vue .NET CRUD. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  background: #2c3e50;
  color: #ecf0f1;
  margin-top: auto;
  padding: 2rem 0 1rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: #42b983;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.footer-section h4 {
  color: #ecf0f1;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
}

.footer-section p {
  color: #bdc3c7;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 0.9rem;
}

.footer-section ul li a:hover {
  color: #42b983;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 1rem;
  text-align: center;
}

.footer-bottom p {
  color: #95a5a6;
  font-size: 0.85rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer {
    padding: 1.5rem 0 1rem;
  }
}
</style>

