import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://e-commercesite-6g9s.onrender.com";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () =>
    set({
      formData: {
        name: "",
        price: "",
        image: "",
      },
    }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.error("Error in addProduct:", error);
      toast.error("Failed to add product");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      if (Array.isArray(response.data.data)) {
        set({ products: response.data.data, error: null });
      } else {
        set({ products: [], error: "Invalid response format" });
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 429) {
        set({ error: "Rate limit exceeded", products: [] });
      } else {
        set({ error: "Something went wrong", products: [] });
      }
      console.error("Error in fetchProducts:", error);
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      const { products } = get();
      const updated = products.filter((product) => product.id !== id);
      set({ products: updated });
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      toast.error("Failed to delete product");
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      const product = response.data.data;
      set({
        currentProduct: product,
        formData: product,
        error: null,
      });
    } catch (error) {
      console.error("Error in fetchProduct:", error);
      set({ error: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
      set({ currentProduct: response.data.data });
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error in updateProduct:", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
