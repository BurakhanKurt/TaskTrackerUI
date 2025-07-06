import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTasks, 
  clearError, 
  createTask, 
  updateTaskTitle, 
  toggleTaskCompletion, 
  deleteTask,
  setPage,
  setStatusFilter,
  setSearchTerm,
  setStartDate,
  setEndDate,
  clearFilters
} from '../../store/slices/taskSlice';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskStats from './TaskStats';

const Dashboard = () => {
  // input verileri
  const [searchInput, setSearchInput] = useState('');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  
  // Arama için debounce referansı
  const searchTimeoutRef = useRef(null);

  // hooks
  const dispatch = useDispatch();
  const { 
    tasks, 
    loading, 
    error, 
    page, 
    pageSize, 
    totalPages, 
    totalTasks, 
    completed, 
    pending, 
    progress,
    creating,
    updating,
    deleting,
    statusFilter,
    searchTerm,
    startDate,
    endDate
  } = useSelector((state) => state.tasks);

  // yüklendiğinde veya filtreler değiştiğinde getir
  useEffect(() => {
    const params = {
      page,
      pageSize,
      statusFilter,
      searchTerm: searchTerm || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    };
    dispatch(fetchTasks(params));
  }, [dispatch, page, pageSize, statusFilter, searchTerm, startDate, endDate]);

  // pagination
  const handlePageChange = useCallback((newPage) => {
    dispatch(setPage(newPage));
  }, [dispatch]);

  // status filtresi
  const handleStatusFilterChange = useCallback((filter) => {
    dispatch(setStatusFilter(filter));
  }, [dispatch]);

  // debounce ile arama
  const handleSearch = useCallback((term) => {
    // timeout temizle
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // debounce ile arama
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(setSearchTerm(term));
    }, 500);
  }, [dispatch]);

  // tarih filtreleri
  const handleStartDateChange = useCallback((date) => {
    dispatch(setStartDate(date));
  }, [dispatch]);

  const handleEndDateChange = useCallback((date) => {
    dispatch(setEndDate(date));
  }, [dispatch]);

  // filtreleri temizle
  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setSearchInput('');
    setStartDateInput('');
    setEndDateInput('');
    
    // arama timeout'unu temizle
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, [dispatch]);

  // kaldırıldığında hatayı temizle
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
      // arama timeout'unu temizle
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [dispatch, error]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ana Sayfa</h2>
          <p className="mt-1 text-sm text-gray-600">
            Görevlerinizi yönetin ve ilerlemenizi takip edin
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Görevler yüklenirken hata oluştu
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Statistics */}
      <TaskStats 
        totalTasks={totalTasks}
        completed={completed}
        pending={pending}
        progress={progress}
      />

      {/* Add New Task Form */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Görev Ekle</h3>
        <TaskForm />
      </div>

      {/* Task List */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Görevleriniz</h3>
        
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durum Filtresi
              </label>
              <select
                value={statusFilter || ''}
                onChange={(e) => handleStatusFilterChange(e.target.value || null)}
                className="w-full input-field"
              >
                <option value="">Tümü</option>
                <option value="1">Tamamlanan</option>
                <option value="2">Bekleyen</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arama
              </label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="Görev başlığı ara..."
                className="w-full input-field"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                value={startDateInput}
                onChange={(e) => {
                  setStartDateInput(e.target.value);
                  handleStartDateChange(e.target.value || null);
                }}
                className="w-full input-field"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={endDateInput}
                onChange={(e) => {
                  setEndDateInput(e.target.value);
                  handleEndDateChange(e.target.value || null);
                }}
                className="w-full input-field"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end">
            <button
              onClick={handleClearFilters}
              className="btn-secondary"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
        {(loading || creating || updating || deleting) ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">
              {loading ? 'Görevler yükleniyor...' : 
               creating ? 'Görev ekleniyor...' : 
               updating ? 'Görev güncelleniyor...' : 
               'Görev siliniyor...'}
            </span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Görev yok</h3>
            <p className="mt-1 text-sm text-gray-500">
              Yeni bir görev oluşturmak için yukarıdaki alana tıklayın.
            </p>
          </div>
        ) : (
          <>
            <TaskList 
              tasks={tasks} 
              isUpdating={updating}
              isDeleting={deleting}
              isLoading={loading}
            />
            {/* Pagination - Only visible when there are more than 10 tasks */}
            {totalTasks > 10 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{(page - 1) * pageSize + 1}</span>
                      {' - '}
                      <span className="font-medium">
                        {Math.min(page * pageSize, totalTasks)}
                      </span>
                      {' / '}
                      <span className="font-medium">{totalTasks}</span>
                      {' görev gösteriliyor'}
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Önceki</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Page Numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (page <= 3) {
                          pageNumber = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              pageNumber === page
                                ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Sonraki</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 