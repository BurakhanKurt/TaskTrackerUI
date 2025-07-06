# TaskTrackerUI

## Kullanılan Teknolojiler

### Frontend Framework
- **React**: Kullanıcı arayüzü için modern JavaScript kütüphanesi
- **React Router**: Sayfa yönlendirmeleri için kullanılan routing sistemi

### State Management
- **Redux Toolkit**: Uygulama genelinde veri yönetimi için kullanılan state management kütüphanesi
- **React Redux**: React bileşenlerini Redux store'a bağlamak için kullanılan kütüphane

### Styling
- **Tailwind CSS**: Hızlı ve modern CSS framework'ü
- **PostCSS**: CSS işleme ve optimizasyon için kullanılan araç

### Form Validation
- **Custom Validation**: Kendi yazdığımız validasyon fonksiyonları
- **Real-time Validation**: Kullanıcı yazarken anlık doğrulama

### HTTP Requests
- **Axios**: Backend API ile iletişim için kullanılan HTTP client

### Local Storage
- **Browser Local Storage**: Kullanıcı oturum bilgilerini tarayıcıda saklamak için

## Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── auth/           # Kimlik doğrulama bileşenleri
│   ├── dashboard/      # Dashboard bileşenleri
│   └── layout/         # Sayfa düzeni bileşenleri
├── store/              # Redux store ve slice'lar
├── services/           # API servisleri
├── utils/              # Yardımcı fonksiyonlar
└── config/             # Konfigürasyon dosyaları
```

## Özellikler

### Kullanıcı Yönetimi
- Kullanıcı kaydı ve girişi
- Güvenli şifre doğrulama
- Oturum yönetimi

### Görev Yönetimi
- Görev oluşturma ve düzenleme
- Görev listesi görüntüleme
- Görev durumu takibi
- Görev istatistikleri

### Kullanıcı Deneyimi
- Responsive tasarım
- Kullanıcı dostu hata mesajları

## Kurulum

1. Bağımlılıkları yükleyin: `npm install`
2. Geliştirme sunucusunu başlatın: `npm start`
