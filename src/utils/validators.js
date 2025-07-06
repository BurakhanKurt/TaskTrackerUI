// regex patterns
const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  USERNAME: /^[a-zA-Z][a-zA-Z0-9_]*$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  TURKISH_NAME: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
  TASK_TITLE: /^[a-zA-ZğüşıöçĞÜŞİÖÇ0-9\s\-_.,!?()]+$/,
  PHONE_NUMBER: /^[+]?[0-9\s\-\(\)]+$/
};

// hata mesajları
const ERROR_MESSAGES = {
  REQUIRED: 'Bu alan zorunludur',
  INVALID_FORMAT: 'Geçersiz format',
  TOO_SHORT: 'Çok kısa',
  TOO_LONG: 'Çok uzun',
  INVALID_VALUE: 'Geçersiz değer',
  PASSWORDS_DONT_MATCH: 'Şifreler eşleşmiyor',
  DATE_MUST_BE_FUTURE: 'Tarih gelecekte olmalıdır',
  START_DATE_AFTER_END_DATE: 'Başlangıç tarihi bitiş tarihinden sonra olamaz',
  END_DATE_BEFORE_START_DATE: 'Bitiş tarihi başlangıç tarihinden önce olamaz'
};

// pagination
export const validatePaginationQuery = (page, pageSize) => {
  const errors = {};

  // page
  if (!page || page < 1) {
    errors.page = 'Sayfa numarası 1\'den büyük olmalıdır';
  } else if (page > Number.MAX_SAFE_INTEGER) {
    errors.page = 'Sayfa numarası çok büyük';
  }

  // page size
  if (!pageSize || pageSize < 1) {
    errors.pageSize = 'Sayfa boyutu 1\'den büyük olmalıdır';
  } else if (pageSize > 100) {
    errors.pageSize = 'Sayfa boyutu en fazla 100 olabilir';
  }

  return errors;
};

// register
export const validateRegisterUser = (userData) => {
  const errors = {};

  // username
  if (!userData.username?.trim()) {
    errors.username = 'Kullanıcı adı zorunludur';
  } else if (userData.username.trim().length < 3) {
    errors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
  } else if (userData.username.trim().length > 50) {
    errors.username = 'Kullanıcı adı en fazla 50 karakter olabilir';
  } else if (!PATTERNS.USERNAME.test(userData.username.trim())) {
    errors.username = 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir ve harf ile başlamalıdır';
  }

  // email
  if (!userData.email?.trim()) {
    errors.email = 'E-posta zorunludur';
  } else if (userData.email.trim().length > 100) {
    errors.email = 'E-posta en fazla 100 karakter olabilir';
  } else if (!PATTERNS.EMAIL.test(userData.email.trim())) {
    errors.email = 'Geçerli bir e-posta adresi giriniz';
  }

  // password
  if (!userData.password?.trim()) {
    errors.password = 'Şifre zorunludur';
  } else if (userData.password.length < 8) {
    errors.password = 'Şifre en az 8 karakter olmalıdır';
  } else if (userData.password.length > 100) {
    errors.password = 'Şifre en fazla 100 karakter olabilir';
  } else if (!PATTERNS.PASSWORD.test(userData.password)) {
    errors.password = 'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir';
  }

  // first name
  if (userData.firstName?.trim()) {
    if (userData.firstName.trim().length > 50) {
      errors.firstName = 'Ad en fazla 50 karakter olabilir';
    } else if (!PATTERNS.TURKISH_NAME.test(userData.firstName.trim())) {
      errors.firstName = 'Ad sadece harf ve boşluk içerebilir';
    }
  }

  // last name
  if (userData.lastName?.trim()) {
    if (userData.lastName.trim().length > 50) {
      errors.lastName = 'Soyad en fazla 50 karakter olabilir';
    } else if (!PATTERNS.TURKISH_NAME.test(userData.lastName.trim())) {
      errors.lastName = 'Soyad sadece harf ve boşluk içerebilir';
    }
  }

  // phone number
  if (userData.phoneNumber?.trim()) {
    const cleanPhone = userData.phoneNumber.replace(/\s/g, '');
    if (cleanPhone.length < 10) {
      errors.phoneNumber = 'Telefon numarası en az 10 karakter olmalıdır';
    } else if (userData.phoneNumber.length > 20) {
      errors.phoneNumber = 'Telefon numarası en fazla 20 karakter olabilir';
    } else if (!PATTERNS.PHONE_NUMBER.test(userData.phoneNumber)) {
      errors.phoneNumber = 'Geçerli bir telefon numarası formatı giriniz';
    }
  }

  return errors;
};

// login
export const validateLoginUser = (userData) => {
  const errors = {};

  // email
  if (!userData.email?.trim()) {
    errors.email = 'E-posta zorunludur';
  } else if (userData.email.trim().length > 100) {
    errors.email = 'E-posta en fazla 100 karakter olabilir';
  } else if (!PATTERNS.EMAIL.test(userData.email.trim())) {
    errors.email = 'Geçerli bir e-posta adresi giriniz';
  }

  // password
  if (!userData.password?.trim()) {
    errors.password = 'Şifre zorunludur';
  } else if (userData.password.length > 100) {
    errors.password = 'Şifre en fazla 100 karakter olabilir';
  }

  return errors;
};

// create task
export const validateCreateTask = (taskData) => {
  const errors = {};

  // title
  if (!taskData.title?.trim()) {
    errors.title = 'Görev başlığı zorunludur';
  } else if (taskData.title.trim().length < 3) {
    errors.title = 'Görev başlığı en az 3 karakter olmalıdır';
  } else if (taskData.title.trim().length > 200) {
    errors.title = 'Görev başlığı en fazla 200 karakter olabilir';
  } else if (!PATTERNS.TASK_TITLE.test(taskData.title.trim())) {
    errors.title = 'Görev başlığı sadece harf, rakam, boşluk ve özel karakterler içerebilir';
  }

  // due date
  if (taskData.dueDate) {
    const dueDate = new Date(taskData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate <= today) {
      errors.dueDate = 'Bitiş tarihi bugünden sonra olmalıdır';
    }
  }

  return errors;
};

// update task title
export const validateUpdateTaskTitle = (taskId, title) => {
  const errors = {};

  // id
  if (!taskId || taskId <= 0) {
    errors.id = 'Geçerli bir görev ID\'si gereklidir';
  }

  // title
  if (!title?.trim()) {
    errors.title = 'Görev başlığı zorunludur';
  } else if (title.trim().length < 3) {
    errors.title = 'Görev başlığı en az 3 karakter olmalıdır';
  } else if (title.trim().length > 200) {
    errors.title = 'Görev başlığı en fazla 200 karakter olabilir';
  } else if (!PATTERNS.TASK_TITLE.test(title.trim())) {
    errors.title = 'Görev başlığı sadece harf, rakam, boşluk ve özel karakterler içerebilir';
  }

  return errors;
};

// update task status
export const validateUpdateTaskStatus = (taskId, isCompleted) => {
  const errors = {};

  // id
  if (!taskId || taskId <= 0) {
    errors.id = 'Geçerli bir görev ID\'si gereklidir';
  }

  // is completed
  if (isCompleted === null || isCompleted === undefined) {
    errors.isCompleted = 'Görev durumu belirtilmelidir';
  }

  return errors;
};

// update task due date
export const validateUpdateTaskDueDate = (taskId, dueDate) => {
  const errors = {};

  // id
  if (!taskId || taskId <= 0) {
    errors.id = 'Geçerli bir görev ID\'si gereklidir';
  }

  // due date (optional, can be null to remove date)
  if (dueDate !== null && dueDate !== undefined && dueDate !== '') {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      errors.dueDate = 'Geçerli bir tarih formatı giriniz (YYYY-MM-DD)';
    }
  }

  return errors;
};

// delete task
export const validateDeleteTask = (taskId) => {
  const errors = {};

  // id
  if (!taskId || taskId <= 0) {
    errors.id = 'Geçerli bir görev ID\'si gereklidir';
  }

  return errors;
};

// get tasks
export const validateGetTasksQuery = (query) => {
  const errors = {};

  // page
  if (query.page && (query.page < 1 || query.page > Number.MAX_SAFE_INTEGER)) {
    errors.page = 'Sayfa numarası 1\'den büyük olmalıdır';
  }

  // page size
  if (query.pageSize && (query.pageSize < 1 || query.pageSize > 100)) {
    errors.pageSize = 'Sayfa boyutu 1 ile 100 arasında olmalıdır';
  }

  // search term
  if (query.searchTerm && query.searchTerm.length > 100) {
    errors.searchTerm = 'Arama terimi en fazla 100 karakter olabilir';
  }

  // date range
  if (query.startDate && query.endDate) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    
    if (startDate > endDate) {
      errors.startDate = 'Başlangıç tarihi bitiş tarihinden sonra olamaz';
      errors.endDate = 'Bitiş tarihi başlangıç tarihinden önce olamaz';
    }
  }

  return errors;
};

// confirm password
export const validateConfirmPassword = (password, confirmPassword) => {
  const errors = {};

  if (!confirmPassword?.trim()) {
    errors.confirmPassword = 'Şifre onayı zorunludur';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Şifreler eşleşmiyor';
  }

  return errors;
};

// generic field validation
export const validateField = {
  required: (value, fieldName) => {
    if (!value?.trim()) {
      return `${fieldName} zorunludur`;
    }
    return null;
  },

  minLength: (value, minLength, fieldName) => {
    if (value && value.trim().length < minLength) {
      return `${fieldName} en az ${minLength} karakter olmalıdır`;
    }
    return null;
  },

  maxLength: (value, maxLength, fieldName) => {
    if (value && value.trim().length > maxLength) {
      return `${fieldName} en fazla ${maxLength} karakter olabilir`;
    }
    return null;
  },

  pattern: (value, pattern, fieldName, errorMessage) => {
    if (value && !pattern.test(value.trim())) {
      return errorMessage || `${fieldName} geçersiz formatta`;
    }
    return null;
  },

  email: (value) => {
    if (value && !PATTERNS.EMAIL.test(value.trim())) {
      return 'Geçerli bir e-posta adresi giriniz';
    }
    return null;
  },

  futureDate: (value) => {
    if (value) {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date <= today) {
        return 'Tarih gelecekte olmalıdır';
      }
    }
    return null;
  }
};

export default {
  validatePaginationQuery,
  validateRegisterUser,
  validateLoginUser,
  validateCreateTask,
  validateUpdateTaskTitle,
  validateUpdateTaskStatus,
  validateDeleteTask,
  validateGetTasksQuery,
  validateConfirmPassword,
  validateField,
  PATTERNS,
  ERROR_MESSAGES
}; 