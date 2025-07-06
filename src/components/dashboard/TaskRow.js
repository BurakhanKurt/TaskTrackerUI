import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { validateUpdateTaskTitle, validateUpdateTaskDueDate } from '../../utils/validators';


const TaskRow = memo(({ 
  task, 
  onUpdateTitle, 
  onToggleCompletion, 
  onDelete, 
  onUpdateDueDate,
  isUpdating, 
  isDeleting 
}) => {
  // callback'leri memoize et
  const memoizedOnUpdateTitle = useCallback(onUpdateTitle, [onUpdateTitle]);
  const memoizedOnToggleCompletion = useCallback(onToggleCompletion, [onToggleCompletion]);
  const memoizedOnDelete = useCallback(onDelete, [onDelete]);
  const memoizedOnUpdateDueDate = useCallback(onUpdateDueDate, [onUpdateDueDate]);

  // input verileri
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDateValue, setEditDateValue] = useState(task.dueDate || '');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showThreeDotMenu, setShowThreeDotMenu] = useState(false);
  const [threeDotMenuPosition, setThreeDotMenuPosition] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingDate, setIsSavingDate] = useState(false);

  // focus
  const inputRef = useRef(null);
  const dateInputRef = useRef(null);
  const contextMenuRef = useRef(null);
  const threeDotMenuRef = useRef(null);
  const rowRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // isEditing true olduğunda düzenlemeye başla
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // isEditingDate true olduğunda tarih düzenlemeye başla
  useEffect(() => {
    if (isEditingDate && dateInputRef.current) {
      dateInputRef.current.focus();
    }
  }, [isEditingDate]);

  // title değiştiğinde düzenleme değerini güncelle
  useEffect(() => {
    if (!isEditing) {
      setEditValue(task.title);
    }
  }, [task.title, isEditing]);

  // dueDate değiştiğinde düzenleme değerini güncelle
  useEffect(() => {
    if (!isEditingDate) {
      setEditDateValue(task.dueDate || '');
    }
  }, [task.dueDate, isEditingDate]);

  // kaldırıldığında debounce timeout'unu temizle
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // dışarı tıklandığında veya esc tuşuna basıldığında menüleri kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
      if (threeDotMenuRef.current && !threeDotMenuRef.current.contains(event.target)) {
        setShowThreeDotMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowContextMenu(false);
        setShowThreeDotMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // start edit
  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(task.title);
  };

  // start date edit
  const handleStartDateEdit = () => {
    setIsEditingDate(true);
    setEditDateValue(task.dueDate || '');
  };

  // save date edit
  const handleSaveDateEdit = async () => {
    // Eğer tarih değişmediyse sadece edit modundan çık
    if (editDateValue === (task.dueDate || '')) {
      setIsEditingDate(false);
      return;
    }
    
    // validasyon
    const errors = validateUpdateTaskDueDate(task.id, editDateValue || null);
    
    if (Object.keys(errors).length > 0) {
      // hata göster
      alert('Hata: ' + errors.dueDate);
      setEditDateValue(task.dueDate || '');
      setIsEditingDate(false);
      return;
    }
    
    setIsSavingDate(true);
    try {
      await memoizedOnUpdateDueDate(task.id, editDateValue || null);
      setIsEditingDate(false);
    } catch (error) {
      console.error('Tarih güncellenirken hata:', error);
      // API hatası mesajını göster
      const errorMessage = error.payload || 'Tarih güncellenirken bir hata oluştu';
      alert('Hata: ' + errorMessage);
      setEditDateValue(task.dueDate || '');
      setIsEditingDate(false);
    } finally {
      setIsSavingDate(false);
    }
  };

  // cancel date edit
  const handleCancelDateEdit = () => {
    setEditDateValue(task.dueDate || '');
    setIsEditingDate(false);
  };

  // debounced save
  const debouncedSave = async (value) => {
    const trimmedValue = value.trim();
    
    // validasyon
    const errors = validateUpdateTaskTitle(task.id, trimmedValue);
    
    if (Object.keys(errors).length === 0 && trimmedValue !== task.title) {
      setIsSaving(true);
      try {
        await memoizedOnUpdateTitle(task.id, trimmedValue);
        // başarılıysa edit modundan çık
        setIsEditing(false);
      } catch (error) {
        console.error('Başlık güncellenirken hata:', error);
        // hata durumunda orijinal değere sıfırla
        setEditValue(task.title);
      } finally {
        setIsSaving(false);
      }
    } else if (Object.keys(errors).length > 0) {
      // hata göster
      console.error('Doğrulama hatası:', errors.title);
      setEditValue(task.title);
      setIsEditing(false);
    } else if (!trimmedValue) {
      // boşsa orijinal değere sıfırla
      setEditValue(task.title);
      setIsEditing(false);
    }
  };

  // debounce ile girdi değişikliğini işle
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    
    // mevcut timeoutu temizle
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // debounced kaydetme için yeni timeout ayarla
    debounceTimeoutRef.current = setTimeout(() => {
      debouncedSave(newValue);
    }, 1000);
  };

  // save edit
  const handleSaveEdit = async () => {
    // bekleyen debounce'u temizle
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    const trimmedValue = editValue.trim();
    
    // validasyon
    const errors = validateUpdateTaskTitle(task.id, trimmedValue);
    
    if (Object.keys(errors).length === 0 && trimmedValue !== task.title) {
      setIsSaving(true);
      try {
        await memoizedOnUpdateTitle(task.id, trimmedValue);
        // başarılıysa edit modundan çık
        setIsEditing(false);
      } catch (error) {
        console.error('Başlık güncellenirken hata:', error);
        setEditValue(task.title);
        setIsEditing(false);
      } finally {
        setIsSaving(false);
      }
    } else if (Object.keys(errors).length > 0) {
      // hata göster
      console.error('Doğrulama hatası:', errors.title);
      setEditValue(task.title);
      setIsEditing(false);
    } else if (!trimmedValue) {
      // boşsa orijinal değere sıfırla
      setEditValue(task.title);
      setIsEditing(false);
    } else {
      // değişiklik yoksa sadece edit modundan çık
      setIsEditing(false);
    }
  };

  // cancel edit
  const handleCancelEdit = () => {
    setEditValue(task.title);
    setIsEditing(false);
  };

  // key press
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // toggle completion
  const handleToggleCompletion = async () => {
    await memoizedOnToggleCompletion(task.id, !task.isCompleted);
  };

  // context menu
  const handleContextMenu = (e) => {
    e.preventDefault(); // Varsayılan tarayıcı bağlam menüsünü engelle
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
    setShowThreeDotMenu(false); // Üç nokta menüsü açıksa kapat
  };

  // three dot menu
  const handleThreeDotMenu = (e) => {
    e.preventDefault();
    setThreeDotMenuPosition({ x: e.clientX, y: e.clientY });
    setShowThreeDotMenu(true);
    setShowContextMenu(false); // Bağlam menüsü açıksa kapat
  };

  // delete
  const handleDelete = async () => {
    setShowContextMenu(false);
    await memoizedOnDelete(task.id);
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

  return (
    <>
      <tr 
        ref={rowRef}
        className={`hover:bg-gray-50 ${task.isCompleted ? 'bg-green-50' : ''}`}
        onContextMenu={handleContextMenu}
      >
        {/* Durum Sütunu */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex justify-center">
            {task.isCompleted ? (
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </td>

        {/* Başlık Sütunu */}
        <td className="px-6 py-4">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  onBlur={handleSaveEdit}
                  className={`w-full input-field text-sm py-1 px-2 pr-8 ${isSaving ? 'border-blue-500' : ''}`}
                  disabled={isUpdating || isSaving}
                />
                {isSaving && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div 
              className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-200 ${
                task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
              onClick={handleStartEdit}
              title="Düzenlemek için tıklayın"
            >
              <div className="flex items-center space-x-2">
                <span>{task.title}</span>
                {isSaving && (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                )}
              </div>
            </div>
          )}
        </td>

        {/* Bitiş Tarihi Sütunu */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {isEditingDate ? (
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={dateInputRef}
                  type="date"
                  value={editDateValue}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setEditDateValue(newDate);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveDateEdit();
                    } else if (e.key === 'Escape') {
                      handleCancelDateEdit();
                    }
                  }}
                  onBlur={handleSaveDateEdit}
                  className={`w-full text-sm border border-gray-300 rounded px-2 py-1 ${isSavingDate ? 'border-blue-500' : ''}`}
                  disabled={isUpdating || isSavingDate}
                />
                {isSavingDate && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div 
              className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-200"
              onClick={handleStartDateEdit}
              title="Bitiş tarihini düzenlemek için tıklayın"
            >
              {task.dueDate ? (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className={isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}>
                    {formatDate(task.dueDate)}
                  </span>
                  {isOverdue(task.dueDate) && !task.isCompleted && (
                    <span className="text-xs text-red-500">(Gecikmiş)</span>
                  )}
                </div>
              ) : (
                <span className="text-gray-400">Tarih ekle</span>
              )}
            </div>
          )}
        </td>

        {/* İşlemler Sütunu */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center space-x-2">

            {/* 3-Nokta Menü Butonu */}
            <button
              onClick={handleThreeDotMenu}
              className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
              title="Durum güncelleme menüsü"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* Silme Butonu - Tablet ve daha küçük ekranlarda görünür */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 disabled:opacity-50 lg:hidden"
              title="Görevi sil"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {/* Sağ Tık Bağlam Menüsü - Sadece Silme */}
      {showContextMenu && (
        <div 
          ref={contextMenuRef}
          className="fixed bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 min-w-48"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {/* Silme Butonu */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {isDeleting ? 'Siliniyor...' : 'Görevi Sil'}
          </button>
        </div>
      )}

      {/* Üç Nokta Menüsü - Sadece Durum Değiştirme */}
      {showThreeDotMenu && (
        <div 
          ref={threeDotMenuRef}
          className="fixed bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 min-w-48"
          style={{
            left: threeDotMenuPosition.x,
            top: threeDotMenuPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {/* Durum Değiştirme Butonu */}
          <button
            onClick={() => {
              setShowThreeDotMenu(false);
              handleToggleCompletion();
            }}
            disabled={isUpdating}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 flex items-center"
          >
            {task.isCompleted ? (
              <svg className="w-4 h-4 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {isUpdating ? 'Güncelleniyor...' : (task.isCompleted ? 'Bekliyor olarak işaretle' : 'Tamamlandı olarak işaretle')}
          </button>
        </div>
      )}

    </>
  );
});

export default TaskRow; 