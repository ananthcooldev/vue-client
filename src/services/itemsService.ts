import api from './api';
import type { Item, ItemCreate, ItemUpdate } from '../types';

export const itemsService = {
  async getAll(): Promise<Item[]> {
    const response = await api.get<Item[]>('/Items');
    return response.data;
  },

  async getById(id: number): Promise<Item> {
    const response = await api.get<Item>(`/Items/${id}`);
    return response.data;
  },

  async create(item: ItemCreate): Promise<Item> {
    const response = await api.post<Item>('/Items', item);
    return response.data;
  },

  async update(id: number, item: ItemUpdate): Promise<Item> {
    const response = await api.put<Item>(`/Items/${id}`, item);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Items/${id}`);
  },
};

