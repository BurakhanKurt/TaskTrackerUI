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
  setEndDate,
  clearFilters
} from '../../store/slices/taskSlice';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskStats from './TaskStats';

const Dashboard = () => {
  // input verileri
  const [searchInput, setSearchInput] = useState('');
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
    endDate
  } = useSelector((state) => state.tasks);

  // yüklendiğinde veya filtreler değiştiğinde getir
  useEffect(() => {
    const params = {
      page,
      pageSize,
      statusFilter,
      searchTerm: searchTerm || undefined,
      endDate: endDate || undefined
    };
    dispatch(fetchTasks(params));
  }, [dispatch, page, pageSize, statusFilter, searchTerm, endDate]);

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
  const handleEndDateChange = useCallback((date) => {
    dispatch(setEndDate(date));
  }, [dispatch]);

  // filtreleri temizle
  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setSearchInput('');
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

  // görev oluşturma
  const handleCreateTask = useCallback(async (taskData) => {
    const result = await dispatch(createTask(taskData));
    if (createTask.fulfilled.match(result)) {
      // başarılı
    }
  }, [dispatch]);

  // görev başlığı güncelleme
  const handleUpdateTitle = useCallback(async (taskId, newTitle) => {
    const result = await dispatch(updateTaskTitle({ id: taskId, title: newTitle }));
    if (updateTaskTitle.fulfilled.match(result)) {
      // başarılı
    }
  }, [dispatch]);

  // görev durumu değiştirme
  const handleToggleCompletion = useCallback(async (taskId, isCompleted) => {
    const result = await dispatch(toggleTaskCompletion({ id: taskId, isCompleted }));
    if (toggleTaskCompletion.fulfilled.match(result)) {
      // başarılı
    }
  }, [dispatch]);

  // görev silme
  const handleDeleteTask = useCallback(async (taskId) => {
    const result = await dispatch(deleteTask(taskId));
    if (deleteTask.fulfilled.match(result)) {
      // başarılı
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Görev Yöneticisi</h1>
          <p className="mt-2 text-gray-600">Görevlerinizi organize edin ve takip edin</p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <TaskStats 
            total={totalTasks}
            completed={completed}
            pending={pending}
            progress={progress}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Görev</h3>
              <TaskForm 
                onSubmit={handleCreateTask}
                loading={creating}
                error={error}
              />
            </div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Görevleriniz</h3>
              
              {/* Filters */}
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              
              {/* Task List */}
              <TaskList 
                tasks={tasks}
                isUpdating={updating}
                isDeleting={deleting}
                isLoading={loading}
                onUpdateTitle={handleUpdateTitle}
                onToggleCompletion={handleToggleCompletion}
                onDelete={handleDeleteTask}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Önceki
                    </button>
                    
                    <span className="text-sm text-gray-600">
                      Sayfa {page} / {totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sonraki
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 