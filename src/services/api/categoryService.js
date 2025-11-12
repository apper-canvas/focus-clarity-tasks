import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

export const categoryService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('categories_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "taskCount_c"}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform to match UI expectations
      return response.data?.map(category => ({
        Id: category.Id,
        name: category.name_c || "",
        color: category.color_c || "#6366F1",
        taskCount: category.taskCount_c || 0
      })) || [];
    } catch (error) {
      console.error("Error loading categories:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('categories_c', id, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "taskCount_c"}}
        ]
      });

      if (!response?.data) {
        throw new Error("Category not found");
      }

      // Transform to match UI expectations
      return {
        Id: response.data.Id,
        name: response.data.name_c || "",
        color: response.data.color_c || "#6366F1",
        taskCount: response.data.taskCount_c || 0
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          name_c: categoryData.name || "",
          color_c: categoryData.color || "#6366F1",
          taskCount_c: 0
        }]
      };
      
      const response = await apperClient.createRecord('categories_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdData = successful[0].data;
          return {
            Id: createdData.Id,
            name: createdData.name_c || "",
            color: createdData.color_c || "#6366F1",
            taskCount: createdData.taskCount_c || 0
          };
        }
      }
      throw new Error("Failed to create category");
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updates.name && { name_c: updates.name }),
          ...(updates.color && { color_c: updates.color }),
          ...(updates.taskCount !== undefined && { taskCount_c: updates.taskCount })
        }]
      };
      
      const response = await apperClient.updateRecord('categories_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedData = successful[0].data;
          return {
            Id: updatedData.Id,
            name: updatedData.name_c || "",
            color: updatedData.color_c || "#6366F1",
            taskCount: updatedData.taskCount_c || 0
          };
        }
      }
      throw new Error("Failed to update category");
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('categories_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return true;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async updateTaskCount(categoryName, count) {
    try {
      // First find the category by name
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('categories_c', {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "name_c",
          "Operator": "EqualTo",
          "Values": [categoryName]
        }]
      });

      if (response.data?.length > 0) {
        const categoryId = response.data[0].Id;
        return await this.update(categoryId, { taskCount: count });
      }
      return null;
    } catch (error) {
      console.error("Error updating task count:", error?.response?.data?.message || error);
      return null;
}
  }
};