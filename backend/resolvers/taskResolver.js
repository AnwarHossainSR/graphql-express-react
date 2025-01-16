const Task = require("../models/Task");
const User = require("../models/User");

const taskResolver = {
  Query: {
    async getTasks() {
      return await Task.find().populate("createdBy");
    },
    async getTaskById(_, { id }) {
      return await Task.findById(id).populate("createdBy");
    },
  },
  Mutation: {
    async createTask(_, { input }, context) {
      const { id } = context.user;

      // Ensure user is authenticated
      if (!id) throw new Error("Authentication required");

      // Create new task
      const task = new Task({ ...input, createdBy: id });
      await task.save();

      return await task.populate("createdBy").execPopulate();
    },
    async updateTask(_, { id, input }, context) {
      const { id: userId } = context.user;

      // Find task and check ownership
      const task = await Task.findById(id);
      if (!task) throw new Error("Task not found");
      if (task.createdBy.toString() !== userId)
        throw new Error("Not authorized");

      // Update task
      Object.assign(task, input);
      await task.save();

      return await task.populate("createdBy").execPopulate();
    },
    async deleteTask(_, { id }, context) {
      const { id: userId } = context.user;

      // Find task and check ownership
      const task = await Task.findById(id);
      if (!task) throw new Error("Task not found");
      if (task.createdBy.toString() !== userId)
        throw new Error("Not authorized");

      await task.remove();
      return "Task deleted successfully";
    },
  },
};

module.exports = taskResolver;
