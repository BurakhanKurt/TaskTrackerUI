import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';


const Layout = ({ children }) => {
  // hooks
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  // logout
  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Başlık */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo ve Başlık */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary-600">
                  Görev Takip
                </h1>
              </div>
            </div>

            {/* Kullanıcı Menüsü */}
            <div className="flex items-center space-x-4">
              {/* Kullanıcı Bilgileri */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-sm text-gray-700">
                  Hoş geldiniz, <span className="font-medium">{user?.name || 'Kullanıcı'}</span>
                </div>
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>

              {/* Çıkış Butonu */}
              <button
                onClick={handleLogout}
                disabled={loading}
                className="btn-secondary text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                    Çıkış yapılıyor...
                  </div>
                ) : (
                  'Çıkış'
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 