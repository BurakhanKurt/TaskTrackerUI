import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// kullanıcı kaydı için async thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      
      // Kayıt başarılı olduğunda kullanıcıyı otomatik giriş yapmıyoruz
      // Kullanıcı ayrıca login yapmalı
      return { success: true, message: 'Kayıt başarılı' };
    } catch (error) {
      return rejectWithValue(error.response?.data?.messages || 'Kayıt işlemi başarısız');
    }
  }
);

// kullanıcı girişi için async thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      
      // model
      const user = {
        id: response.data.data.id, 
        email: response.data.data.email,
        username: response.data.data.username,
        name: response.data.data.username,
      };
      
      // tokenı kaydet
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token: response.data.data.token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.messages || 'Giriş başarısız');
    }
  }
);

// kullanıcı çıkışı için async thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // localStorageı temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return null;
    } catch (error) {
      return rejectWithValue('Çıkış başarısız');
    }
  }
);

// başlangıç durumu
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// reducer slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // hata temizleme
    clearError: (state) => {
      state.error = null;
    },
    // yükleme durumu ayarlama
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // kayıt işlemleri
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Kayıt başarılı olduğunda kullanıcıyı otomatik giriş yapmıyoruz
        // Kullanıcı ayrıca login yapmalı
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // giriş işlemleri
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // çıkış işlemleri
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// action'ları export et
export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer; 