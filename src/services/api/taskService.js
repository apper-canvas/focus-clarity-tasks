import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "completedAt_c"}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform to match UI expectations
      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || "",
        description: task.description_c || "",
        priority: task.priority_c || "medium",
        category: task.category_c?.name_c || "Personal", // Extract name from lookup
        completed: task.completed_c || false,
        createdAt: task.createdAt_c || new Date().toISOString(),
        completedAt: task.completedAt_c || null
      })) || [];
    } catch (error) {
      console.error("Error loading tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('tasks_c', id, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "completedAt_c"}}
        ]
      });

      if (!response?.data) {
        throw new Error("Task not found");
      }

      // Transform to match UI expectations
      return {
        Id: response.data.Id,
        title: response.data.title_c || "",
        description: response.data.description_c || "",
        priority: response.data.priority_c || "medium",
        category: response.data.category_c?.name_c || "Personal",
        completed: response.data.completed_c || false,
        createdAt: response.data.createdAt_c || new Date().toISOString(),
        completedAt: response.data.completedAt_c || null
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      
      // Find category ID by name for lookup field
      let categoryId = null;
      if (taskData.category && taskData.category !== "Personal") {
        const categoryResponse = await apperClient.fetchRecords('categories_c', {
          fields: [{"field": {"Name": "Id"}}],
          where: [{
            "FieldName": "name_c",
            "Operator": "EqualTo",
            "Values": [taskData.category]
          }]
        });
        
        if (categoryResponse.data?.length > 0) {
          categoryId = categoryResponse.data[0].Id;
        }
      }

      const params = {
        records: [{
          title_c: taskData.title || "",
          description_c: taskData.description || "",
          priority_c: taskData.priority || "medium",
          ...(categoryId && { category_c: categoryId }),
          completed_c: false,
          createdAt_c: new Date().toISOString(),
          completedAt_c: null
        }]
      };
      
      const response = await apperClient.createRecord('tasks_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdData = successful[0].data;
          return {
            Id: createdData.Id,
            title: createdData.title_c || "",
            description: createdData.description_c || "",
            priority: createdData.priority_c || "medium",
            category: taskData.category || "Personal", // Use original category name
            completed: createdData.completed_c || false,
            createdAt: createdData.createdAt_c || new Date().toISOString(),
            completedAt: createdData.completedAt_c || null
          };
        }
      }
      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      
      // Find category ID by name for lookup field if category is being updated
      let categoryId = null;
      if (updates.category && updates.category !== "Personal") {
        const categoryResponse = await apperClient.fetchRecords('categories_c', {
          fields: [{"field": {"Name": "Id"}}],
          where: [{
            "FieldName": "name_c",
            "Operator": "EqualTo",
            "Values": [updates.category]
          }]
        });
        
        if (categoryResponse.data?.length > 0) {
          categoryId = categoryResponse.data[0].Id;
        }
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...(updates.title && { title_c: updates.title }),
          ...(updates.description !== undefined && { description_c: updates.description }),
          ...(updates.priority && { priority_c: updates.priority }),
          ...(categoryId && { category_c: categoryId }),
          ...(updates.completed !== undefined && { completed_c: updates.completed }),
          ...(updates.completed !== undefined && {
            completedAt_c: updates.completed ? new Date().toISOString() : null
          })
        }]
      };
      
      const response = await apperClient.updateRecord('tasks_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedData = successful[0].data;
          return {
            Id: updatedData.Id,
            title: updatedData.title_c || "",
            description: updatedData.description_c || "",
            priority: updatedData.priority_c || "medium",
            category: updates.category || "Personal",
            completed: updatedData.completed_c || false,
            createdAt: updatedData.createdAt_c || new Date().toISOString(),
            completedAt: updatedData.completedAt_c || null
          };
        }
      }
      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('tasks_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "completedAt_c"}}
        ],
        where: [{
          "FieldName": "category_c.name_c",
          "Operator": "EqualTo",
          "Values": [category]
        }]
      });

      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || "",
        description: task.description_c || "",
        priority: task.priority_c || "medium",
        category: task.category_c?.name_c || "Personal",
        completed: task.completed_c || false,
        createdAt: task.createdAt_c || new Date().toISOString(),
        completedAt: task.completedAt_c || null
      })) || [];
    } catch (error) {
      console.error("Error getting tasks by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByStatus(completed) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "completedAt_c"}}
        ],
        where: [{
          "FieldName": "completed_c",
          "Operator": "EqualTo",
          "Values": [completed]
        }]
      });

      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || "",
        description: task.description_c || "",
        priority: task.priority_c || "medium",
        category: task.category_c?.name_c || "Personal",
        completed: task.completed_c || false,
        createdAt: task.createdAt_c || new Date().toISOString(),
        completedAt: task.completedAt_c || null
      })) || [];
    } catch (error) {
      console.error("Error getting tasks by status:", error?.response?.data?.message || error);
      return [];
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "completedAt_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "title_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ]
            },
            {
              "conditions": [
                {
                  "fieldName": "description_c",
                  "operator": "Contains", 
                  "values": [query]
                }
              ]
            }
          ]
        }]
      });

      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || "",
        description: task.description_c || "",
        priority: task.priority_c || "medium",
        category: task.category_c?.name_c || "Personal",
        completed: task.completed_c || false,
        createdAt: task.createdAt_c || new Date().toISOString(),
        completedAt: task.completedAt_c || null
      })) || [];
    } catch (error) {
      console.error("Error searching tasks:", error?.response?.data?.message || error);
      return [];
    }
  }
};