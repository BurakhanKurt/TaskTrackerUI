import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';

// all slices
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
  // dev tools
  devTools: process.env.NODE_ENV !== 'production',
});

// export
export default store; 