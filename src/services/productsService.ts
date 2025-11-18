import api from './api';
import type { Product } from '../types';

export const productsService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>('/Product');
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/Product/${id}`);
    return response.data;
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await api.post<Product>('/Product', product);
    return response.data;
  },

  async update(id: number, product: Product): Promise<void> {
    await api.put(`/Product/${id}`, product);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Product/${id}`);
  },
};

