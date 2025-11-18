<template>
  <div class="items-container">
    <div class="header">
      <h1>Items Management</h1>
      <button @click="showCreateModal = true" class="btn-primary">Add New Item</button>
    </div>

    <div v-if="loading" class="loading">Loading items...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="items.length === 0" class="empty">No items found</div>
    <table v-else class="items-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description || '-' }}</td>
          <td>
            <button @click="editItem(item)" class="btn-edit">Edit</button>
            <button @click="deleteItem(item.id)" class="btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingItem" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>{{ editingItem ? 'Edit Item' : 'Create New Item' }}</h2>
        <form @submit.prevent="saveItem">
          <div class="form-group">
            <label>Name</label>
            <input v-model="formData.name" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" rows="3"></textarea>
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
import { itemsService } from '../services/itemsService';
import type { Item, ItemCreate, ItemUpdate } from '../types';

const items = ref<Item[]>([]);
const loading = ref(false);
const error = ref('');
const showCreateModal = ref(false);
const editingItem = ref<Item | null>(null);
const formData = ref<ItemCreate>({
  name: '',
  description: '',
});

const loadItems = async () => {
  loading.value = true;
  error.value = '';
  try {
    items.value = await itemsService.getAll();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load items';
  } finally {
    loading.value = false;
  }
};

const editItem = (item: Item) => {
  editingItem.value = item;
  formData.value = {
    name: item.name,
    description: item.description || '',
  };
};

const saveItem = async () => {
  try {
    if (editingItem.value) {
      await itemsService.update(editingItem.value.id, formData.value as ItemUpdate);
    } else {
      await itemsService.create(formData.value);
    }
    closeModal();
    await loadItems();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save item';
  }
};

const deleteItem = async (id: number) => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  
  try {
    await itemsService.delete(id);
    await loadItems();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to delete item';
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingItem.value = null;
  formData.value = { name: '', description: '' };
};

onMounted(() => {
  loadItems();
});
</script>

<style scoped>
.items-container {
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

.items-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.items-table th {
  background: #42b983;
  color: white;
  padding: 1rem;
  text-align: left;
}

.items-table td {
  padding: 1rem;
  border-top: 1px solid #eee;
}

.items-table tr:hover {
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
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

