<template>
  <div class="products-container">
    <div class="header">
      <h1>Products Management</h1>
      <button @click="showCreateModal = true" class="btn-primary">Add New Product</button>
    </div>

    <div v-if="loading" class="loading">Loading products...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="products.length === 0" class="empty">No products found</div>
    <table v-else class="products-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>${{ product.price.toFixed(2) }}</td>
          <td>{{ product.category }}</td>
          <td>
            <button @click="editProduct(product)" class="btn-edit">Edit</button>
            <button @click="deleteProduct(product.id)" class="btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingProduct" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>{{ editingProduct ? 'Edit Product' : 'Create New Product' }}</h2>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Name</label>
            <input v-model="formData.name" required />
          </div>
          <div class="form-group">
            <label>Price</label>
            <input v-model.number="formData.price" type="number" step="0.01" min="0" required />
          </div>
          <div class="form-group">
            <label>Category</label>
            <input v-model="formData.category" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { productsService } from '../services/productsService';
import type { Product } from '../types';

const products = ref<Product[]>([]);
const loading = ref(false);
const error = ref('');
const showCreateModal = ref(false);
const editingProduct = ref<Product | null>(null);
const formData = ref<Omit<Product, 'id'>>({
  name: '',
  price: 0,
  category: '',
});

const loadProducts = async () => {
  loading.value = true;
  error.value = '';
  try {
    products.value = await productsService.getAll();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load products';
  } finally {
    loading.value = false;
  }
};

const editProduct = (product: Product) => {
  editingProduct.value = product;
  formData.value = {
    name: product.name,
    price: product.price,
    category: product.category,
  };
};

const saveProduct = async () => {
  try {
    if (editingProduct.value) {
      await productsService.update(editingProduct.value.id, {
        id: editingProduct.value.id,
        ...formData.value,
      });
    } else {
      await productsService.create(formData.value);
    }
    closeModal();
    await loadProducts();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save product';
  }
};

const deleteProduct = async (id: number) => {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    await productsService.delete(id);
    await loadProducts();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to delete product';
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingProduct.value = null;
  formData.value = { name: '', price: 0, category: '' };
};

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.products-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: #42b983;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:hover {
  background: #35a372;
}

.btn-edit {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete:hover {
  background: #c0392b;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.products-table th {
  background: #42b983;
  color: white;
  padding: 1rem;
  text-align: left;
}

.products-table td {
  padding: 1rem;
  border-top: 1px solid #eee;
}

.products-table tr:hover {
  background: #f5f5f5;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #e74c3c;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal h2 {
  margin-bottom: 1.5rem;
  color: #42b983;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #7f8c8d;
}
</style>

