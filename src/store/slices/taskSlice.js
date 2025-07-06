import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksAPI } from '../../services/api';

// get all
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await tasksAPI.getAll(params);
      
      // model
      return {
        tasks: response.data.data.tasks,
        totalCount: response.data.data.totalCount,
        page: response.data.data.page,
        pageSize: response.data.data.pageSize,
        totalPages: response.data.data.totalPages,
        totalTasks: response.data.data.totalTasks,
        completed: response.data.data.completed,
        pending: response.data.data.pending,
        progress: response.data.data.progress,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.messages || 'Görevler yüklenemedi');
    }
  }
);

// create
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await tasksAPI.create(taskData);
      
      // model
      const taskId = response.data.data;
      
      // new task
      const newTask = {
        id: taskId,
        title: taskData.title,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      
      // refresh
      const state = getState();
      dispatch(fetchTasks({
        page: state.tasks.page,
        pageSize: state.tasks.pageSize,
        statusFilter: state.tasks.statusFilter,
        searchTerm: state.tasks.searchTerm,
        startDate: state.tasks.startDate,
        endDate: state.tasks.endDate
      }));
      
      return newTask;
    } catch (error) {
      return rejectWithValue(error.response?.data?.messages || 'Görev oluşturulamadı');
    }
  }
);

// update title
export const updateTaskTitle = createAsyncThunk(
  'tasks/updateTaskTitle',
  async ({ id, title }, { rejectWithValue, dispatch, getState }) => {
    try {
      await tasksAPI.updateTitle(id, title);
      
      // refresh
      const state = getState();
      dispatch(fetchTasks({
        page: state.tasks.page,
        pageSize: state.tasks.pageSize,
        statusFilter: state.tasks.statusFilter,
        searchTerm: state.tasks.searchTerm,
        startDate: state.tasks.startDate,
        endDate: state.tasks.endDate
      }));
      
      return { id, title };
    } catch (error) {
      return rejectWithValue(error.response?.data?.messages || 'Görev güncellenemedi');
    }
  }
);


// export
export const toggleTaskCompletion = createAsyncThunk(
  'tasks/toggleTaskCompletion',
  async ({ id, isCompleted }, { rejectWithValue, dispatch, getState }) => {
    try {
      await tasksAPI.updateStatus(id, isCompleted);
      
      // refresh
      const state = getState();
      dispatch(fetchTasks({
        page: state.tasks.page,
        pageSize: state.tasks.pageSize,
        statusFilter: state.tasks.statusFilter,
        searchTerm: state.tasks.searchTerm,
        startDate: state.tasks.startDate,
        endDate: state.tasks.endDate
      }));
      
      return { id, isCompleted };
    } catch (error) {
      return rejectWithValue(error.response?.data?.messages || 'Görev güncellenemedi');
    }
  }
);

// update due date
export const updateTaskDueDate = createAsyncThunk(
  'tasks/updateTaskDueDate',
  async ({ id, dueDate }, { rejectWithValue, dispatch, getState }) => {
    try {
      await tasksAPI.updateDueDate(id, dueDate);
      
      // refresh
      const state = getState();
      dispatch(fetchTasks({
        page: state.tasks.page,
        pageSize: state.tasks.pageSize,
        statusFilter: state.tasks.statusFilter,
        searchTerm: state.tasks.searchTerm,
        startDate: state.tasks.startDate,
        endDate: state.tasks.endDate
      }));
      
      return { id, dueDate };
    } catch (error) {
      return rejectWithValue(error.response?.data?.messages || 'Görev güncellenemedi');
    }
  }
);

// delete
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue, dispatch, getState }) => {
    try {
      await tasksAPI.delete(taskId);
      
      // refresh
      const state = getState();
      dispatch(fetchTasks({
        page: state.tasks.page,
        pageSize: state.tasks.pageSize,
        statusFilter: state.tasks.statusFilter,
        searchTerm: state.tasks.searchTerm,
        startDate: state.tasks.startDate,
        endDate: state.tasks.endDate
      }));
      
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.messages || 'Görev silinemedi');
    }
  }
);

// initial state
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
  // pagination
  totalCount: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  totalTasks: 0,
  completed: 0,
  pending: 0,
  progress: 0,
  // filters
  statusFilter: null,
  searchTerm: '',
  startDate: null,
  endDate: null,
};

// reducer
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // error
    clearError: (state) => {
      state.error = null;
    },
    // clear tasks
    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
    },
    // set page
    setPage: (state, action) => {
      state.page = action.payload;
    },
    // set page size
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    // set status filter
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    // set search term
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    // set start date
    setStartDate: (state, action) => {
      state.startDate = action.payload;
      state.page = 1;
    },
    // set end date
    setEndDate: (state, action) => {
      state.endDate = action.payload;
      state.page = 1;
    },
    // clear filters
    clearFilters: (state) => {
      state.statusFilter = null;
      state.searchTerm = '';
      state.startDate = null;
      state.endDate = null;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    // get all
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.totalCount = action.payload.totalCount;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.totalPages = action.payload.totalPages;
        state.totalTasks = action.payload.totalTasks;
        state.completed = action.payload.completed;
        state.pending = action.payload.pending;
        state.progress = action.payload.progress;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // create
      .addCase(createTask.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.creating = false;
        state.tasks.push(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      
      // update title
      .addCase(updateTaskTitle.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateTaskTitle.fulfilled, (state, action) => {
        state.updating = false;
        const taskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].title = action.payload.title;
        }
        state.error = null;
      })
      .addCase(updateTaskTitle.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      
      // toggle completion
      .addCase(toggleTaskCompletion.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        state.updating = false;
        const taskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].isCompleted = action.payload.isCompleted;
        }
        state.error = null;
      })
      .addCase(toggleTaskCompletion.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      
      // update due date
      .addCase(updateTaskDueDate.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateTaskDueDate.fulfilled, (state, action) => {
        state.updating = false;
        const taskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].dueDate = action.payload.dueDate;
        }
        state.error = null;
      })
      .addCase(updateTaskDueDate.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      
      // delete
      .addCase(deleteTask.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleting = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

// actions
export const { 
  clearError, 
  clearTasks, 
  setPage, 
  setPageSize, 
  setStatusFilter, 
  setSearchTerm, 
  setStartDate, 
  setEndDate, 
  clearFilters 
} = taskSlice.actions;

export default taskSlice.reducer; 