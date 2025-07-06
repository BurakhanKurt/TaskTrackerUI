import { useState, useCallback } from 'react';
import * as validators from './validators';


export const useValidation = (initialData = {}, validationFunction) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // update field
  const updateField = useCallback((field, value, validateImmediately = false) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // set click
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // hataları temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // istenirse hemen doğrula
    if (validateImmediately && validationFunction) {
      const newErrors = validationFunction({ ...formData, [field]: value });
      setErrors(prev => ({
        ...prev,
        [field]: newErrors[field] || ''
      }));
    }
  }, [formData, errors, validationFunction]);

  // validasayon
  const validateForm = useCallback(() => {
    if (!validationFunction) return true;
    
    const newErrors = validationFunction(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validationFunction]);

  // field validasyon
  const validateField = useCallback((field) => {
    if (!validationFunction) return;
    
    const newErrors = validationFunction(formData);
    setErrors(prev => ({
      ...prev,
      [field]: newErrors[field] || ''
    }));
  }, [formData, validationFunction]);

  // set click
  const markFieldTouched = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  // reset
  const resetForm = useCallback((newData = {}) => {
    setFormData(newData);
    setErrors({});
    setTouched({});
  }, []);

  // hata kontrol
  const hasError = useCallback((field) => {
    return touched[field] && errors[field];
  }, [touched, errors]);

  // hata mesajı
  const getFieldError = useCallback((field) => {
    return hasError(field) ? errors[field] : '';
  }, [hasError, errors]);

  // validasyon
  const isValid = useCallback(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    formData,
    errors,
    touched,
    updateField,
    validateForm,
    validateField,
    markFieldTouched,
    resetForm,
    hasError,
    getFieldError,
    isValid
  };
};

// register
export const useRegistrationValidation = (initialData = {}) => {
  return useValidation(initialData, validators.validateRegisterUser);
};

// login
export const useLoginValidation = (initialData = {}) => {
  return useValidation(initialData, validators.validateLoginUser);
};

// create task
export const useTaskCreationValidation = (initialData = {}) => {
  return useValidation(initialData, validators.validateCreateTask);
};

// update task
export const useTaskUpdateValidation = (initialData = {}) => {
  return useValidation(initialData, (data) => {
    // Görev güncellemeleri için başlığı ayrı doğrulamamız gerekiyor
    return validators.validateUpdateTaskTitle(data.id, data.title);
  });
};

export default useValidation; 