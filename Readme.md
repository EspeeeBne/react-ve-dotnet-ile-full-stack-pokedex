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
- **Pokémon Skilleri**: Pokémon'un kullanabildiği skill'ler ve bu skill'lere tıklayarak detaylı anlatımıyla bu skill'i kullanan başka pokémonlara bakabilme.
- **Pokémon Karşılaştırma**: İki Pokémon'un istatistiklerini **radar grafik** üzerinden karşılaştırarak analiz yapabilirsiniz, ek olarak Pokémon'lara da erişebiliyorsunuz o menüden.
- **Pokémon Türünü Filtreleyerek Arama**: Pokémon'ları filtreleyerek aramanızı sağlayan bir özellik; ateş türündeki Pokémon mu yoksa elektrik mi, seçip hepsini görebilme.
- **GrowthRate ve Cinsiyet Oranları**: Pokémon detay sayfasında **growthRate (yetişme hızı)** bilgisi ve **cinsiyet oranları (% Erkek / % Dişi)** görüntülenebilir. Dil seçeneğine göre % ambleminin yeri değişir. Cinsiyet oranları renkli ikonlarla gösterilir (Mavi: Erkek, Pembe: Dişi).
- **404 Sayfası**: Eğer kullanıcı hatalı bir yere giderse 404 sayfasına yönlendiriliyor otomatik.
- **Suspense Fallback**: Back-end tabanlı yavaş yüklenmelerde **Yükleniyor** tekeri döndüren sistem.

---

## 🔧 Teknolojiler

### Front-end:
- **React.js**: Kullanıcı arayüzü oluşturmak için.
- **Material-UI (MUI)**: Uygulamanın stil ve tasarım bileşenleri için.
- **Axios**: API isteklerini yönetmek için.
- **React Router**: Sayfalar arası gezinme işlevselliği için.
- **Framer Motion**: Dinamik animasyonlar ve geçiş efektleri için.
- **i18next**: Çoklu dil desteğini entegre etmek için.
- **Chart.js**: Pokemon istatistiklerini görselleştirmek için bar grafik desteği.
- **dotenv**: Api portu farklı olursa kullanıcı mağdur olmasın.

### Back-end:
- **.NET 9.0**: Back-end.
- **Swagger**: API'yi test etmek için.
- **PokeAPI**: Pokémon verilerini almak için bir API.

---

## 🛠️ Kurulum

### **Back-end Kurulumu (.NET 9.0)**

1. **.NET 9.0'ı yükleyin**: [Resmi .NET 9.0 İndirme Sayfası](https://dotnet.microsoft.com/download/dotnet/9.0) üzerinden **.NET 9.0**'ı indirin ve kurun.


2. **Projeyi Klonlayın**:

   ```
   git clone https://github.com/EspeeeBne/react-ve-dotnet-ile-full-stack-pokedex.git
   ```

Back-end'i çalıştırın:

PokedexBackend klasörüne gidin

Projeyi derleyin ve çalıştırın:

   ```
dotnet build
   ```

   ```
dotnet run
   ```

back-end şu URL'den çalışacaktır: http://localhost:5145

Front-end Kurulumu (React)
Node.js'i yükleyin: Eğer yüklü değilse, [Resmi Node.js İndirme Sayfası](https://nodejs.org/en/download/current) üzerinden Node.js'i indirip yükleyin. Bence LTS indirin ileride de kullanırsınız rahatça.

Front-end'i çalıştırın:

Front-end klasörüne gidin

Gerekli bağımlılıkları yükleyin:

    ```
 npm install --legacy-peer-deps
    ```

**--legacy-peer-deps** deme sebebimiz react 19 almamış paketler hâlâ react 18'i kabul gördüğünden hata verdirtiyor.

**.env Dosyasını Ayarlayın:**

    ```
cp .env.example .env
    ```
**Not:** REACT_APP_API_BASE_URL ortam değişkenini backend URL'inize göre ayarlayın (varsayılan: http://localhost:5145).

Front-end'i başlatın:

    ```
npm start
    ```

React Uygulaması şu URL'den çalışacaktır (muhtemelen): http://localhost:3000


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

1. Pokémon Skillerini Görme
GET /api/pokemon/ability/{abilityId}
Açıklama: Pokémon'ların Skillerini görüp veriyi çekipo skill'e özel sayfa için kullanılan bir çağrı.

1. Pokémon seriye göre filtreleme
GET /filter/generation/{generationId}
Açıklama: Pokémon'ları serilerine göre filtreleyebiliyorsunuz.

1. Pokémon Bölgesine göre filtreleme
GET /filter/region/{regionId}
Açıklama: Pokémon'ları bulundukları bölgelere göre filtreleme.

1. Pokémon'ları türlerine göre filtreleme
GET /filter/type/{type}
Açıklama: Pokémon'ları türlerine göre filtreleme.

---

## 🏆 Öne Çıkan Özellikler

- **Zengin Görsel İçerik**: Pokémon'ların resimleri ve detayları özenle yerleştirildi.
- **Karmaşık Bilgiler**: Pokémon türlerine ve istatistiklerine göre detaylı görseller ve bilgi sunuyor.
- **Kapsamlı API**: API'den gelen veriler ile her Pokémon için tüm bilgileri dinamik olarak alıyoruz.
- **Kolay Kullanım**: Basit ve anlaşılır arayüz, kullanıcı dostu özelliklerle kullanıcıların kolayca gezinebileceği şekilde tasarlandı.
- **Dinamik Evrim Zinciri**: Pokémon'un evrim zincirinde bulunan Pokémon'lar kutular içinde görüntülenir ve tıklanabilir.
- **Görsel Uyum**: Pokémon türlerine göre değişen arka plan ve stil renkleri.
- **Kullanıcı Dostu**: Basit, şık ve dinamik arayüz ile kolay gezinme.
- **Türe Göre Arama**: Pokémon'ların türlerine göre filtreleme ile o türde hangi Pokémon var öğrenme.
- **Skill Sayfası ve Skill'ler**: Skill'lere basıp Skill'in açıklamasını ve Skill'in hangi Pokémon'larda olduğunu görebilme ve olan Pokémon'ları listeleme.
- **Pokémon Evrim Ağacı**: Pokémon'ların neye evrimleşebildiğini görebilme.
- **Pokémon'ları Karşılaştırma**: Pokémonları örümcek grafik ve normal görünüm ile karşılaştırma.
- **Bulundukları Bölgeye Göre Filtreleme**: Pokémon'ları bulundukları bölgelere göre filtreleyebilme.
- **Seriye Göre Filtreleme**: Pokémon'ları seriye göre filtreleme.
- **Cinsiyet Oranı Görüntüleme**: Her Pokémon'un cinsiyet oranlarını (♂ %50 / ♀ %50) emoji ve renk kodlarıyla görüntüleme.
- **Büyüme Oranı Görüntüleme**: Her Pokémon'un büyüme hızını ("Yavaş", "Orta," "Hızlı", vb.) detay sayfasında görebilme.
- **Responsive Tasarım**: Gerek Mui gerek framer-motion gerek mobile göre Navbar'ın farklı gözükmesi olsun aşırı responsive bir proje.



---

## 📄 Lisans
Bu proje **MIT** lisansı ile lisanslanmıştır. Daha fazla bilgi için [LİSANS](./LICENSE) dosyasını inceleyebilirsiniz.

---

## 🎨 Görseller
Proje tasarımında kullanılan görseller, PokeAPI ve Pokémon SVG tarafından sağlanmıştır.

"Pokémon" tüm haklarıyla Pokémon Company ve Game Freak'in mülküdür. Bu proje tamamen eğitim ve kendini geliştirme amaçlıdır sizde lütfen kullanırsanız ona göre kullanın.





