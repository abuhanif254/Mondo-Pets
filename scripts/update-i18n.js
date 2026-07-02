const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const files = ['en.json', 'es.json', 'de.json', 'hi.json', 'bn.json'];

const additions = {
  en: {
    RightSidebar: {
      trendingDeals: "Trending Deals",
      highlyClicked: "Highly Clicked",
      joinClubTitle: "Join MondoPets Club",
      joinClubDesc: "Get exclusive deals, early access and more sent directly to your inbox.",
      emailPlaceholder: "Enter your email...",
      joinBtn: "Join"
    },
    ProductDetail: {
      backTo: "Back to",
      buyNow: "Buy Now on Retailer",
      affiliateDisclaimer: "Proceeds to external retailer. We may earn an affiliate commission.",
      secureCheckout: "Secure Checkout",
      fastShipping: "Fast Shipping",
      easyReturns: "Easy Returns"
    },
    SearchOverlay: {
      placeholder: "Search products, blogs, and more...",
      searching: "Searching...",
      noResults: "No results found for",
      typeMore: "Type at least 2 characters to search.",
      products: "Products",
      articles: "Articles"
    }
  },
  es: {
    RightSidebar: {
      trendingDeals: "Ofertas de Tendencia",
      highlyClicked: "Muy Clickeado",
      joinClubTitle: "Únete al Club MondoPets",
      joinClubDesc: "Obtén ofertas exclusivas, acceso anticipado y más en tu bandeja de entrada.",
      emailPlaceholder: "Ingresa tu correo...",
      joinBtn: "Unirse"
    },
    ProductDetail: {
      backTo: "Volver a",
      buyNow: "Comprar ahora en el minorista",
      affiliateDisclaimer: "Las ganancias van al minorista externo. Podemos ganar una comisión de afiliado.",
      secureCheckout: "Pago Seguro",
      fastShipping: "Envío Rápido",
      easyReturns: "Devoluciones Fáciles"
    },
    SearchOverlay: {
      placeholder: "Busca productos, blogs, y más...",
      searching: "Buscando...",
      noResults: "No se encontraron resultados para",
      typeMore: "Escribe al menos 2 caracteres para buscar.",
      products: "Productos",
      articles: "Artículos"
    }
  },
  de: {
    RightSidebar: {
      trendingDeals: "Trend-Angebote",
      highlyClicked: "Häufig Geklickt",
      joinClubTitle: "MondoPets Club Beitreten",
      joinClubDesc: "Erhalten Sie exklusive Angebote, Vorabzugang und mehr direkt in Ihren Posteingang.",
      emailPlaceholder: "Geben Sie Ihre E-Mail ein...",
      joinBtn: "Beitreten"
    },
    ProductDetail: {
      backTo: "Zurück zu",
      buyNow: "Jetzt beim Händler kaufen",
      affiliateDisclaimer: "Der Erlös geht an den externen Händler. Wir können eine Affiliate-Provision verdienen.",
      secureCheckout: "Sichere Kasse",
      fastShipping: "Schneller Versand",
      easyReturns: "Einfache Rückgabe"
    },
    SearchOverlay: {
      placeholder: "Suche nach Produkten, Blogs und mehr...",
      searching: "Suchen...",
      noResults: "Keine Ergebnisse gefunden für",
      typeMore: "Tippen Sie mindestens 2 Zeichen, um zu suchen.",
      products: "Produkte",
      articles: "Artikel"
    }
  },
  hi: {
    RightSidebar: {
      trendingDeals: "ट्रेंडिंग डील्स",
      highlyClicked: "अत्यधिक क्लिक किया गया",
      joinClubTitle: "मोंडोपेट्स क्लब से जुड़ें",
      joinClubDesc: "सीधे अपने इनबॉक्स में विशेष ऑफ़र, शीघ्र पहुंच और बहुत कुछ प्राप्त करें।",
      emailPlaceholder: "अपना ईमेल दर्ज करें...",
      joinBtn: "जुड़ें"
    },
    ProductDetail: {
      backTo: "वापस जाएँ",
      buyNow: "रिटेलर पर अभी खरीदें",
      affiliateDisclaimer: "आय बाहरी रिटेलर को जाती है। हम सहबद्ध कमीशन कमा सकते हैं।",
      secureCheckout: "सुरक्षित चेकआउट",
      fastShipping: "तेज शिपिंग",
      easyReturns: "आसान वापसी"
    },
    SearchOverlay: {
      placeholder: "उत्पाद, ब्लॉग और बहुत कुछ खोजें...",
      searching: "खोज रहा है...",
      noResults: "के लिए कोई परिणाम नहीं मिला",
      typeMore: "खोजने के लिए कम से कम 2 अक्षर टाइप करें।",
      products: "उत्पाद",
      articles: "लेख"
    }
  },
  bn: {
    RightSidebar: {
      trendingDeals: "ট্রেন্ডিং ডিলস",
      highlyClicked: "অত্যধিক ক্লিক করা হয়েছে",
      joinClubTitle: "মন্ডোপেটস ক্লাবে যোগ দিন",
      joinClubDesc: "আপনার ইনবক্সে সরাসরি একচেটিয়া ডিল, প্রাথমিক অ্যাক্সেস এবং আরও অনেক কিছু পান।",
      emailPlaceholder: "আপনার ইমেল লিখুন...",
      joinBtn: "যোগ দিন"
    },
    ProductDetail: {
      backTo: "ফিরে যান",
      buyNow: "খুচরা বিক্রেতার কাছে এখনই কিনুন",
      affiliateDisclaimer: "আয় বহিরাগত খুচরা বিক্রেতার কাছে যায়। আমরা অ্যাফিলিয়েট কমিশন উপার্জন করতে পারি।",
      secureCheckout: "নিরাপদ চেকআউট",
      fastShipping: "দ্রুত শিপিং",
      easyReturns: "সহজ রিটার্ন"
    },
    SearchOverlay: {
      placeholder: "পণ্য, ব্লগ এবং আরও অনেক কিছু খুঁজুন...",
      searching: "খুঁজছি...",
      noResults: "এর জন্য কোন ফলাফল পাওয়া যায়নি",
      typeMore: "খুঁজতে অন্তত ২টি অক্ষর টাইপ করুন।",
      products: "পণ্য",
      articles: "প্রবন্ধ"
    }
  }
};

for (const file of files) {
  const lang = file.split('.')[0];
  const filePath = path.join(messagesDir, file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.RightSidebar = additions[lang].RightSidebar;
    data.ProductDetail = additions[lang].ProductDetail;
    data.SearchOverlay = additions[lang].SearchOverlay;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`Updated ${file}`);
  }
}
