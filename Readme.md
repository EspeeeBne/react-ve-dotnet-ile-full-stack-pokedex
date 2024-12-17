# Pokémon App - Full Stack

**Pokémon App** - Bu proje, **React** tabanlı modern bir kullanıcı arayüzü (front-end) ve **.NET 9.0** tabanlı bir backend API kullanarak Pokémon bilgilerini sunan full stack bir uygulamadır.

---

## 🚀 Proje Özellikleri

- **Pokémon Arama**: Pokémon ismi veya ID'si ile arama yaparak, her Pokémon'un detaylarına ulaşabilirsiniz.
- **Pokémon Detay Sayfası**: Pokémon'un türleri, boyu, ağırlığı, istatistikleri ve daha fazlası hakkında detaylı bilgi görüntülenebilir.
- **Evrim Zinciri**: Pokémon'un evrim zincirini görüp tıklayarak diğer evrimlere geçiş yapabilirsiniz.
- **Tema Desteği**: Kullanıcıların tercihlerine göre **karanlık** ve **aydınlık** tema seçenekleri.
- **Dil Desteği**: Proje, **Türkçe** ve **İngilizce** dillerini desteklemektedir.
- **Backend (API)**: **.NET 9.0** kullanarak geliştirilmiş bir **RESTful API** üzerinden Pokémon verilerini çekiyoruz.
- **Dinamik Arka Plan ve Yazı Renkleri**: Pokémon türlerine göre arka plan renkleri dinamik olarak değişir.
- **Pokémon İstatistikleri**: HP, saldırı, savunma gibi Pokémon'un temel istatistiklerini şık bir şekilde görüntüleyebilirsiniz.
- **pokémon Skilleri**: Pokémon'un kullanabildiği skill'ler ve bu skill'lere tıklayarak detaylı anlatımıyla bu skill'i kullanan başka pokémonlara bakabilme.
---

## 🔧 Teknolojiler

### Front-end:
- **React.js**: Kullanıcı arayüzü için.
- **Material-UI (MUI)**: Uygulamanın stil ve tasarımı için.
- **Axios**: API isteklerini yapmak için.
- **React Router**: Sayfalar arası gezinme için.
- **Framer Motion**: Animasyonlar için.
- **i18next**: Çoklu dil desteği.

### Back-end:
- **.NET 9.0**: Back-end.
- **Swagger**: API'yi test etmek için.
- **PokeAPI**: Pokémon verilerini almak için bir API.

---

## 🛠️ Kurulum

### **Back-end Kurulumu (.NET 9.0)**

1. **.NET 9.0'ı yükleyin**: [Resmi .NET 9.0 İndirme Sayfası](https://dotnet.microsoft.com/download/dotnet/9.0) üzerinden **.NET 9.0**'ı indirin ve kurun.


2. **Projeyi Klonlayın**:

   git clone https://github.com/EspeeeBne/react-ve-dotnet-ile-full-stack-pokedex.git

Back-end'i çalıştırın:

PokedexBackend klasörüne gidin

Projeyi derleyin ve çalıştırın:
dotnet build
dotnet run
back-end şu URL'den çalışacaktır: http://localhost:5145

Front-end Kurulumu (React)
Node.js'i yükleyin: Eğer yüklü değilse, Node.js Resmi Web Sitesi üzerinden Node.js'i indirip yükleyin.

Front-end'i çalıştırın:

Front-end klasörüne gidin

Gerekli bağımlılıkları yükleyin:


npm install


Front-end'i başlatın:

npm start

React Uygulaması şu URL'den çalışacaktır (muhtemelen): http://localhost:3000

---

## 🎮 Kullanım
## Uygulama Açıldıktan Sonra:
Uygulama açıldığında, ana sayfada Pokémon'lar listelenir. Pokémon'a tıklayarak detaylarına ulaşabilirsiniz (internet hızınıza göre yavaş yüklenebilir pokeapi'den alıyor yerel bir yerden almıyor).
Pokémon arama kutusunu kullanarak Pokémon ismi veya ID'si ile arama yapabilirsiniz.
Tema geçişi yapmak için, sağ üstteki tema değişim butonuna tıklayarak karanlık ve aydınlık temalar arasında geçiş yapabilirsiniz.
Dil seçeneğini değiştirmek için, sağ üstteki bayrak ikonlarından birine tıklayarak dil değiştirebilirsiniz.

---

## ⚙️ API Uç Noktaları


1. Tüm Pokémon'ların Bilgileri
GET /api/pokemon/all/details
Tüm Pokémon'ların detaylı bilgilerini döner.

1. Tek Pokémon'un Detayları
GET /api/pokemon/{id}
Belirli bir Pokémon'un detaylarını döner.

1. Pokémon Adı ile Arama
GET /api/pokemon/search/{name}
Pokémon ismi ile arama yaparak ilgili Pokémon'u döner.


1. Evrim Zinciri
GET /api/pokemon/evolution/{id}
Açıklama: Pokémon'un evrim zincirini döner.

---

## 🏆 Öne Çıkan Özellikler
Zengin Görsel İçerik: Pokémon'ların resimleri ve detayları özenle yerleştirildi.
Karmaşık Bilgiler: Pokémon türlerine ve istatistiklerine göre detaylı görseller ve bilgi sunuyor.
Kapsamlı API: API'den gelen veriler ile her Pokémon için tüm bilgileri dinamik olarak alıyoruz.
Kolay Kullanım: Basit ve anlaşılır arayüz, kullanıcı dostu özelliklerle kullanıcıların kolayca gezinebileceği şekilde tasarlandı.
Dinamik Evrim Zinciri: Pokémon'un evrim zincirinde bulunan Pokémon'lar kutular içinde görüntülenir ve tıklanabilir.
Görsel Uyum: Pokémon türlerine göre değişen arka plan ve stil renkleri.
Kullanıcı Dostu: Basit, şık ve dinamik arayüz ile kolay gezinme.

---

## 📄 Lisans
Bu proje, MIT Lisansı altında lisanslanmıştır.

---

## 🎨 Görseller
Proje tasarımında kullanılan görseller, PokeAPI ve Pokémon SVG tarafından sağlanmıştır.

"Pokémon" tüm haklarıyla Pokémon Company ve Game Freak'in mülküdür. Bu proje tamamen eğitim ve kendini geliştirme amaçlıdır sizde lütfen kullanırsanız ona göre kullanın.





