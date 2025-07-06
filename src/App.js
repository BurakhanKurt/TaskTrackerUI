import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

// components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// styles
import './index.css';

// app

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            {/*kimlik doğrulaması olmadan erişilebilir */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/*kimlik doğrulaması*/}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* kimlik doğrulaması yapılmışsa dashboarda, değilse login */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />
            
            {/* dashboarda*/}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App; 