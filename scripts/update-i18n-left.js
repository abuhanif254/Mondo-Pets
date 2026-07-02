const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const files = ['en.json', 'es.json', 'de.json', 'hi.json', 'bn.json'];

const additions = {
  en: {
    LeftSidebar: {
      home: "Home",
      categories: "Categories",
      deals: "Deals",
      hot: "Hot",
      newArrivals: "New Arrivals",
      brands: "Brands",
      collections: "Collections",
      myOrders: "My Orders",
      wishlist: "Wishlist",
      coupons: "Coupons",
      addresses: "Addresses",
      accountSettings: "Account Settings",
      specialOffer: "Special Offer",
      summerSale: "Summer Sale",
      upTo50Off: "Up to 50% Off",
      shopNow: "Shop Now",
      needHelp: "Need Help?",
      supportCenter: "24/7 Support Center",
      darkMode: "Dark Mode",
      lightMode: "Light Mode"
    }
  },
  es: {
    LeftSidebar: {
      home: "Inicio",
      categories: "Categorías",
      deals: "Ofertas",
      hot: "Top",
      newArrivals: "Novedades",
      brands: "Marcas",
      collections: "Colecciones",
      myOrders: "Mis Pedidos",
      wishlist: "Favoritos",
      coupons: "Cupones",
      addresses: "Direcciones",
      accountSettings: "Ajustes",
      specialOffer: "Oferta Especial",
      summerSale: "Rebajas de Verano",
      upTo50Off: "Hasta 50% Dcto",
      shopNow: "Comprar Ahora",
      needHelp: "¿Ayuda?",
      supportCenter: "Soporte 24/7",
      darkMode: "Modo Oscuro",
      lightMode: "Modo Claro"
    }
  },
  de: {
    LeftSidebar: {
      home: "Startseite",
      categories: "Kategorien",
      deals: "Angebote",
      hot: "Heiß",
      newArrivals: "Neuheiten",
      brands: "Marken",
      collections: "Kollektionen",
      myOrders: "Meine Bestellungen",
      wishlist: "Wunschzettel",
      coupons: "Gutscheine",
      addresses: "Adressen",
      accountSettings: "Kontoeinstellungen",
      specialOffer: "Sonderangebot",
      summerSale: "Sommerschlussverkauf",
      upTo50Off: "Bis zu 50% Rabatt",
      shopNow: "Jetzt Kaufen",
      needHelp: "Brauchen Sie Hilfe?",
      supportCenter: "24/7 Support-Center",
      darkMode: "Dunkler Modus",
      lightMode: "Heller Modus"
    }
  },
  hi: {
    LeftSidebar: {
      home: "होम",
      categories: "श्रेणियाँ",
      deals: "डील्स",
      hot: "हॉट",
      newArrivals: "नए आगमन",
      brands: "ब्रांड्स",
      collections: "संग्रह",
      myOrders: "मेरे ऑर्डर",
      wishlist: "इच्छा-सूची",
      coupons: "कूपन",
      addresses: "पते",
      accountSettings: "खाता सेटिंग्स",
      specialOffer: "विशेष प्रस्ताव",
      summerSale: "ग्रीष्मकालीन बिक्री",
      upTo50Off: "50% तक की छूट",
      shopNow: "अभी खरीदारी करें",
      needHelp: "क्या आपको मदद चाहिए?",
      supportCenter: "24/7 सहायता केंद्र",
      darkMode: "डार्क मोड",
      lightMode: "लाइट मोड"
    }
  },
  bn: {
    LeftSidebar: {
      home: "হোম",
      categories: "বিভাগ",
      deals: "অফার",
      hot: "হট",
      newArrivals: "নতুন আগমন",
      brands: "ব্র্যান্ডস",
      collections: "সংগ্রহ",
      myOrders: "আমার অর্ডার",
      wishlist: "ইচ্ছেতালিকা",
      coupons: "কুপন",
      addresses: "ঠিকানা",
      accountSettings: "অ্যাকাউন্ট সেটিংস",
      specialOffer: "বিশেষ অফার",
      summerSale: "গ্রীষ্মকালীন সেল",
      upTo50Off: "৫০% পর্যন্ত ছাড়",
      shopNow: "এখনই কিনুন",
      needHelp: "সাহায্য প্রয়োজন?",
      supportCenter: "২৪/৭ সাপোর্ট সেন্টার",
      darkMode: "ডার্ক মোড",
      lightMode: "লাইট মোড"
    }
  }
};

for (const file of files) {
  const lang = file.split('.')[0];
  const filePath = path.join(messagesDir, file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.LeftSidebar = additions[lang].LeftSidebar;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`Updated ${file} with LeftSidebar translations.`);
  }
}
