import React, { useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskTitle, toggleTaskCompletion, deleteTask, updateTaskDueDate } from '../../store/slices/taskSlice';
import TaskRow from './TaskRow';
import { validateUpdateTaskTitle, validateUpdateTaskDueDate } from '../../utils/validators';


const TaskList = memo(({ tasks, isUpdating, isDeleting, isLoading }) => {
  // input verileri
  const [showMobileContentModal, setShowMobileContentModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editMobileTitle, setEditMobileTitle] = useState('');
  const [isUpdatingMobile, setIsUpdatingMobile] = useState(false);

  // hooks
  const dispatch = useDispatch();

//title güncelle
  const handleUpdateTitle = useCallback(async (id, title) => {
    await dispatch(updateTaskTitle({ id, title }));
  }, [dispatch]);

  // completion
  const handleToggleCompletion = useCallback(async (id, isCompleted) => {
    await dispatch(toggleTaskCompletion({ id, isCompleted }));
  }, [dispatch]);

  // delete
  const handleDeleteTask = useCallback(async (id) => {
    await dispatch(deleteTask(id));
  }, [dispatch]);

  // due date
  const handleUpdateDueDate = useCallback(async (id, dueDate) => {
    await dispatch(updateTaskDueDate({ id, dueDate }));
  }, [dispatch]);

  // save
  const handleSaveMobileContent = async () => {
    if (!selectedTask) return;
    
    // validasyon
    const errors = validateUpdateTaskTitle(selectedTask.id, editMobileTitle.trim());
    
    if (Object.keys(errors).length > 0) {
      // hata göster
      console.error('Doğrulama hatası:', errors.title);
      return;
    }
    
    setIsUpdatingMobile(true);
    try {
      // sadece title güncelle
      if (editMobileTitle.trim() !== selectedTask.title) {
        await handleUpdateTitle(selectedTask.id, editMobileTitle.trim());
      }
      setShowMobileContentModal(false);
    } catch (error) {
      console.error('Mobil başlık güncellenirken hata:', error);
    } finally {
      setIsUpdatingMobile(false);
    }
  };

  // cancel
  const handleCancelMobileContent = () => {
    setShowMobileContentModal(false);
    setSelectedTask(null);
    setEditMobileTitle('');
  };

  // overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  // format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  // loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Görevler yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Görevler Tablosu - Masaüstü */}
      <div className="hidden md:block overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Durum Sütunu */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              
              {/* Başlık Sütunu */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlık
              </th>
              
              {/* Bitiş Tarihi Sütunu */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bitiş Tarihi
              </th>
              
              {/* İşlemler Sütunu */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onUpdateTitle={handleUpdateTitle}
                onToggleCompletion={handleToggleCompletion}
                onDelete={handleDeleteTask}
                onUpdateDueDate={handleUpdateDueDate}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Görev Kartları - Mobil */}
      <div className="md:hidden space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white border border-gray-200 rounded-lg p-4 ${
              task.isCompleted ? 'bg-green-50' : ''
            }`}
          >
            {/* Başlık */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2 flex-1">
                {/* Durum İkonu */}
                {task.isCompleted ? (
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                )}
                
                {/* Başlık */}
                <h3 className={`font-medium text-gray-900 truncate ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </h3>
              </div>
            </div>

            {/* Bitiş Tarihi */}
            <div className="mb-2">
              {task.dueDate ? (
                <div 
                  className="flex items-center space-x-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-200"
                  onClick={async () => {
                    const newDate = prompt('Yeni bitiş tarihi (YYYY-MM-DD):', task.dueDate);
                    if (newDate !== null) {
                      // validasyon
                      const errors = validateUpdateTaskDueDate(task.id, newDate || null);
                      if (Object.keys(errors).length > 0) {
                        alert('Hata: ' + errors.dueDate);
                        return;
                      }
                      try {
                        await handleUpdateDueDate(task.id, newDate || null);
                      } catch (error) {
                        const errorMessage = error.payload || 'Tarih güncellenirken bir hata oluştu';
                        alert('Hata: ' + errorMessage);
                      }
                    }
                  }}
                  title="Bitiş tarihini düzenlemek için tıklayın"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className={`text-sm ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {formatDate(task.dueDate)}
                  </span>
                  {isOverdue(task.dueDate) && !task.isCompleted && (
                    <span className="text-xs text-red-500">(Gecikmiş)</span>
                  )}
                </div>
              ) : (
                <div 
                  className="flex items-center space-x-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-200"
                  onClick={async () => {
                    const newDate = prompt('Bitiş tarihi ekle (YYYY-MM-DD):', '');
                    if (newDate !== null) {
                      // validasyon
                      const errors = validateUpdateTaskDueDate(task.id, newDate || null);
                      if (Object.keys(errors).length > 0) {
                        alert('Hata: ' + errors.dueDate);
                        return;
                      }
                      try {
                        await handleUpdateDueDate(task.id, newDate || null);
                      } catch (error) {
                        const errorMessage = error.payload || 'Tarih güncellenirken bir hata oluştu';
                        alert('Hata: ' + errorMessage);
                      }
                    }
                  }}
                  title="Bitiş tarihi eklemek için tıklayın"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-400">Tarih ekle</span>
                </div>
              )}
            </div>

            {/* İşlemler */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">

                {/* Durum Değiştirme Butonu */}
                <button
                  onClick={() => handleToggleCompletion(task.id, !task.isCompleted)}
                  disabled={isUpdating}
                  className={`text-sm px-3 py-1 rounded-full font-medium transition-colors duration-200 ${
                    task.isCompleted
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  } disabled:opacity-50`}
                  title={task.isCompleted ? 'Bekliyor olarak işaretle' : 'Tamamlandı olarak işaretle'}
                >
                  {isUpdating ? 'Güncelleniyor...' : (task.isCompleted ? 'Bekliyor' : 'Tamamlandı')}
                </button>
              </div>

              {/* Silme Butonu */}
              <button
                onClick={() => handleDeleteTask(task.id)}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50"
                title="Görevi sil"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Boş Durum */}
      {tasks.length === 0 && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Henüz görev yok
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Yeni bir görev oluşturmak için yukarıdaki alana tıklayın.
          </p>
        </div>
      )}

      {/* Mobil İçerik Modal */}
      {showMobileContentModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 md:hidden">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Görev Düzenle</h3>
              <button
                onClick={handleCancelMobileContent}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Başlık Girdisi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={editMobileTitle}
                  onChange={(e) => setEditMobileTitle(e.target.value)}
                  className="w-full input-field"
                  placeholder="Görev başlığı"
                  disabled={isUpdatingMobile}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelMobileContent}
                className="btn-secondary"
                disabled={isUpdatingMobile}
              >
                İptal
              </button>
              <button
                onClick={handleSaveMobileContent}
                disabled={isUpdatingMobile}
                className="btn-primary"
              >
                {isUpdatingMobile ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default TaskList;