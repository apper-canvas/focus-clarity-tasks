import { useState, useEffect, useCallback } from "react";
import { categoryService } from "@/services/api/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = useCallback(async (categoryData) => {
    try {
      const newCategory = await categoryService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error("Error adding category:", err);
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (categoryId, updates) => {
    try {
      const updatedCategory = await categoryService.update(categoryId, updates);
      setCategories(prev => prev.map(category => 
        category.Id === categoryId ? updatedCategory : category
      ));
      return updatedCategory;
    } catch (err) {
      console.error("Error updating category:", err);
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (categoryId) => {
    try {
      await categoryService.delete(categoryId);
      setCategories(prev => prev.filter(category => category.Id !== categoryId));
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
    }
  }, []);

  return {
    categories,
    loading,
    error,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    setCategories
  };
};