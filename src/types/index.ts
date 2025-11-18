// API Types
export interface Item {
  id: number;
  name: string;
  description?: string;
}

export interface ItemCreate {
  name: string;
  description?: string;
}

export interface ItemUpdate {
  name?: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface LoginModel {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

