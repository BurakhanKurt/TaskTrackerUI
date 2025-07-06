// validation constants
// regex patterns
export const PATTERNS = {
  // email validation
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // harf ile başlamalı, harf, rakam ve alt çizgi içerebilir
  USERNAME: /^[a-zA-Z][a-zA-Z0-9_]*$/,
  
  // en az bir küçük harf, büyük harf, rakam ve özel karakter içermeli
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  
  // harf ve boşluk türkçe karakterler dahil
  TURKISH_NAME: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
  
  // harf, rakam, boşluk ve yaygın noktalama
  TASK_TITLE: /^[a-zA-ZğüşıöçĞÜŞİÖÇ0-9\s\-_.,!?()]+$/,
  
  // uluslararası format
  PHONE_NUMBER: /^[+]?[0-9\s\-\(\)]+$/
};

// uzunluk sınırları
export const LENGTH_LIMITS = {
  USERNAME: {
    MIN: 3,
    MAX: 50
  },
  EMAIL: {
    MAX: 100
  },
  PASSWORD: {
    MIN: 8,
    MAX: 100
  },
  FIRST_NAME: {
    MAX: 50
  },
  LAST_NAME: {
    MAX: 50
  },
  PHONE_NUMBER: {
    MIN: 10,
    MAX: 20
  },
  TASK_TITLE: {
    MIN: 3,
    MAX: 200
  },
  SEARCH_TERM: {
    MAX: 100
  },
  PAGE_SIZE: {
    MIN: 1,
    MAX: 100
  }
};

// hata mesajları
export const ERROR_MESSAGES = {
  // genel mesajlar
  REQUIRED: 'Bu alan zorunludur',
  INVALID_FORMAT: 'Geçersiz format',
  TOO_SHORT: 'Çok kısa',
  TOO_LONG: 'Çok uzun',
  INVALID_VALUE: 'Geçersiz değer',
  
  // kullanıcı adı doğrulama
  USERNAME_REQUIRED: 'Kullanıcı adı zorunludur',
  USERNAME_TOO_SHORT: `Kullanıcı adı en az ${LENGTH_LIMITS.USERNAME.MIN} karakter olmalıdır`,
  USERNAME_TOO_LONG: `Kullanıcı adı en fazla ${LENGTH_LIMITS.USERNAME.MAX} karakter olabilir`,
  USERNAME_INVALID_FORMAT: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir ve harf ile başlamalıdır',
  
  // email doğrulama
  EMAIL_REQUIRED: 'E-posta zorunludur',
  EMAIL_TOO_LONG: `E-posta en fazla ${LENGTH_LIMITS.EMAIL.MAX} karakter olabilir`,
  EMAIL_INVALID_FORMAT: 'Geçerli bir e-posta adresi giriniz',
  
  // şifre doğrulama
  PASSWORD_REQUIRED: 'Şifre zorunludur',
  PASSWORD_TOO_SHORT: `Şifre en az ${LENGTH_LIMITS.PASSWORD.MIN} karakter olmalıdır`,
  PASSWORD_TOO_LONG: `Şifre en fazla ${LENGTH_LIMITS.PASSWORD.MAX} karakter olabilir`,
  PASSWORD_INVALID_FORMAT: 'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir',
  PASSWORDS_DONT_MATCH: 'Şifreler eşleşmiyor',
  CONFIRM_PASSWORD_REQUIRED: 'Şifre onayı zorunludur',
  
  // isim doğrulama
  FIRST_NAME_TOO_LONG: `Ad en fazla ${LENGTH_LIMITS.FIRST_NAME.MAX} karakter olabilir`,
  FIRST_NAME_INVALID_FORMAT: 'Ad sadece harf ve boşluk içerebilir',
  LAST_NAME_TOO_LONG: `Soyad en fazla ${LENGTH_LIMITS.LAST_NAME.MAX} karakter olabilir`,
  LAST_NAME_INVALID_FORMAT: 'Soyad sadece harf ve boşluk içerebilir',
  
  // telefon numarası doğrulama
  PHONE_NUMBER_TOO_SHORT: `Telefon numarası en az ${LENGTH_LIMITS.PHONE_NUMBER.MIN} karakter olmalıdır`,
  PHONE_NUMBER_TOO_LONG: `Telefon numarası en fazla ${LENGTH_LIMITS.PHONE_NUMBER.MAX} karakter olabilir`,
  PHONE_NUMBER_INVALID_FORMAT: 'Geçerli bir telefon numarası formatı giriniz',
  
  // görev doğrulama
  TASK_TITLE_REQUIRED: 'Görev başlığı zorunludur',
  TASK_TITLE_TOO_SHORT: `Görev başlığı en az ${LENGTH_LIMITS.TASK_TITLE.MIN} karakter olmalıdır`,
  TASK_TITLE_TOO_LONG: `Görev başlığı en fazla ${LENGTH_LIMITS.TASK_TITLE.MAX} karakter olabilir`,
  TASK_TITLE_INVALID_FORMAT: 'Görev başlığı sadece harf, rakam, boşluk ve özel karakterler içerebilir',
  TASK_ID_REQUIRED: 'Geçerli bir görev ID\'si gereklidir',
  TASK_STATUS_REQUIRED: 'Görev durumu belirtilmelidir',
  TASK_DUE_DATE_FUTURE: 'Bitiş tarihi bugünden sonra olmalıdır',
  
  // sayfalama doğrulama
  PAGE_NUMBER_INVALID: 'Sayfa numarası 1\'den büyük olmalıdır',
  PAGE_SIZE_INVALID: `Sayfa boyutu ${LENGTH_LIMITS.PAGE_SIZE.MIN} ile ${LENGTH_LIMITS.PAGE_SIZE.MAX} arasında olmalıdır`,
  
  // arama doğrulama
  SEARCH_TERM_TOO_LONG: `Arama terimi en fazla ${LENGTH_LIMITS.SEARCH_TERM.MAX} karakter olabilir`,
  

};

//formlar
export const VALIDATION_RULES = {
  // register
  REGISTRATION: {
    username: {
      required: true,
      minLength: LENGTH_LIMITS.USERNAME.MIN,
      maxLength: LENGTH_LIMITS.USERNAME.MAX,
      pattern: PATTERNS.USERNAME,
      errorMessages: {
        required: ERROR_MESSAGES.USERNAME_REQUIRED,
        minLength: ERROR_MESSAGES.USERNAME_TOO_SHORT,
        maxLength: ERROR_MESSAGES.USERNAME_TOO_LONG,
        pattern: ERROR_MESSAGES.USERNAME_INVALID_FORMAT
      }
    },
    email: {
      required: true,
      maxLength: LENGTH_LIMITS.EMAIL.MAX,
      pattern: PATTERNS.EMAIL,
      errorMessages: {
        required: ERROR_MESSAGES.EMAIL_REQUIRED,
        maxLength: ERROR_MESSAGES.EMAIL_TOO_LONG,
        pattern: ERROR_MESSAGES.EMAIL_INVALID_FORMAT
      }
    },
    password: {
      required: true,
      minLength: LENGTH_LIMITS.PASSWORD.MIN,
      maxLength: LENGTH_LIMITS.PASSWORD.MAX,
      pattern: PATTERNS.PASSWORD,
      errorMessages: {
        required: ERROR_MESSAGES.PASSWORD_REQUIRED,
        minLength: ERROR_MESSAGES.PASSWORD_TOO_SHORT,
        maxLength: ERROR_MESSAGES.PASSWORD_TOO_LONG,
        pattern: ERROR_MESSAGES.PASSWORD_INVALID_FORMAT
      }
    },
    firstName: {
      required: false,
      maxLength: LENGTH_LIMITS.FIRST_NAME.MAX,
      pattern: PATTERNS.TURKISH_NAME,
      errorMessages: {
        maxLength: ERROR_MESSAGES.FIRST_NAME_TOO_LONG,
        pattern: ERROR_MESSAGES.FIRST_NAME_INVALID_FORMAT
      }
    },
    lastName: {
      required: false,
      maxLength: LENGTH_LIMITS.LAST_NAME.MAX,
      pattern: PATTERNS.TURKISH_NAME,
      errorMessages: {
        maxLength: ERROR_MESSAGES.LAST_NAME_TOO_LONG,
        pattern: ERROR_MESSAGES.LAST_NAME_INVALID_FORMAT
      }
    },
    phoneNumber: {
      required: false,
      minLength: LENGTH_LIMITS.PHONE_NUMBER.MIN,
      maxLength: LENGTH_LIMITS.PHONE_NUMBER.MAX,
      pattern: PATTERNS.PHONE_NUMBER,
      errorMessages: {
        minLength: ERROR_MESSAGES.PHONE_NUMBER_TOO_SHORT,
        maxLength: ERROR_MESSAGES.PHONE_NUMBER_TOO_LONG,
        pattern: ERROR_MESSAGES.PHONE_NUMBER_INVALID_FORMAT
      }
    }
  },
  
  // login
  LOGIN: {
    email: {
      required: true,
      maxLength: LENGTH_LIMITS.EMAIL.MAX,
      pattern: PATTERNS.EMAIL,
      errorMessages: {
        required: ERROR_MESSAGES.EMAIL_REQUIRED,
        maxLength: ERROR_MESSAGES.EMAIL_TOO_LONG,
        pattern: ERROR_MESSAGES.EMAIL_INVALID_FORMAT
      }
    },
    password: {
      required: true,
      maxLength: LENGTH_LIMITS.PASSWORD.MAX,
      errorMessages: {
        required: ERROR_MESSAGES.PASSWORD_REQUIRED,
        maxLength: ERROR_MESSAGES.PASSWORD_TOO_LONG
      }
    }
  },
  
  // create task
  TASK_CREATION: {
    title: {
      required: true,
      minLength: LENGTH_LIMITS.TASK_TITLE.MIN,
      maxLength: LENGTH_LIMITS.TASK_TITLE.MAX,
      pattern: PATTERNS.TASK_TITLE,
      errorMessages: {
        required: ERROR_MESSAGES.TASK_TITLE_REQUIRED,
        minLength: ERROR_MESSAGES.TASK_TITLE_TOO_SHORT,
        maxLength: ERROR_MESSAGES.TASK_TITLE_TOO_LONG,
        pattern: ERROR_MESSAGES.TASK_TITLE_INVALID_FORMAT
      }
    },
    dueDate: {
      required: false,
      futureDate: true,
      errorMessages: {
        futureDate: ERROR_MESSAGES.TASK_DUE_DATE_FUTURE
      }
    }
  },
  
  // update task
  TASK_UPDATE: {
    id: {
      required: true,
      minValue: 1,
      errorMessages: {
        required: ERROR_MESSAGES.TASK_ID_REQUIRED,
        minValue: ERROR_MESSAGES.TASK_ID_REQUIRED
      }
    },
    title: {
      required: true,
      minLength: LENGTH_LIMITS.TASK_TITLE.MIN,
      maxLength: LENGTH_LIMITS.TASK_TITLE.MAX,
      pattern: PATTERNS.TASK_TITLE,
      errorMessages: {
        required: ERROR_MESSAGES.TASK_TITLE_REQUIRED,
        minLength: ERROR_MESSAGES.TASK_TITLE_TOO_SHORT,
        maxLength: ERROR_MESSAGES.TASK_TITLE_TOO_LONG,
        pattern: ERROR_MESSAGES.TASK_TITLE_INVALID_FORMAT
      }
    }
  }
};

export default {
  PATTERNS,
  LENGTH_LIMITS,
  ERROR_MESSAGES,
  VALIDATION_RULES
}; 