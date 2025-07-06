import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../../store/slices/taskSlice';
import { validateCreateTask } from '../../utils/validators';


const TaskForm = () => {
  // input verileri
  const [taskData, setTaskData] = useState({
    title: '',
    dueDate: ''
  });
  const [error, setError] = useState('');

  // hooks
  const dispatch = useDispatch();
  const { creating, loading } = useSelector((state) => state.tasks);

  // input değişiklikleri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // kullanıcı yazmaya başladığında hatayı temizle
    if (error) {
      setError('');
    }
  };

  // validasyon
  const validateTask = () => {
    const errors = validateCreateTask(taskData);
    
    if (Object.keys(errors).length > 0) {
      // ilk hatayı göster
      const firstError = Object.values(errors)[0];
      setError(firstError);
      return false;
    }
    
    return true;
  };

  // form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();

    // önce görevi doğrula
    if (!validateTask()) {
      return;
    }

    // görev verileri
    const newTaskData = {
      title: taskData.title.trim(),
      dueDate: taskData.dueDate || null,
    };

    // görev oluşturma send
    const result = await dispatch(createTask(newTaskData));
    
    // başarılıysa formu temizle
    if (createTask.fulfilled.match(result)) {
      setTaskData({
        title: '',
        dueDate: ''
      });
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Görev Başlığı
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={taskData.title}
          onChange={handleInputChange}
          placeholder="Görev başlığını giriniz..."
          className={`w-full input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          disabled={creating || loading}
        />
      </div>

      {/* due date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
          Bitiş Tarihi (İsteğe Bağlı)
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={taskData.dueDate}
          onChange={handleInputChange}

          className="w-full input-field"
          disabled={creating || loading}
        />
      </div>

      {/* error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* submit */}
      <button
        type="submit"
        disabled={creating || loading || !taskData.title.trim()}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {creating ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Ekleniyor...
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Yükleniyor...
          </div>
        ) : (
          'Görev Ekle'
        )}
      </button>
    </form>
  );
};

export default TaskForm; 