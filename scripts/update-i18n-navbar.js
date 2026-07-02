const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const files = ['en.json', 'es.json', 'de.json', 'hi.json', 'bn.json'];

const additions = {
  en: { deals: 'Deals', newArrivals: 'New Arrivals' },
  es: { deals: 'Ofertas', newArrivals: 'Novedades' },
  de: { deals: 'Angebote', newArrivals: 'Neuheiten' },
  hi: { deals: 'सौदा', newArrivals: 'नये आगमन' },
  bn: { deals: 'অফার', newArrivals: 'নতুন আগমন' }
};

files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  if (fs.existsSync(filePath)) {
    const locale = path.basename(file, '.json');
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!content.Navbar) {
      content.Navbar = {};
    }
    
    // Add the missing keys
    content.Navbar.deals = additions[locale].deals;
    content.Navbar.newArrivals = additions[locale].newArrivals;
    
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Updated ${file} with Navbar deals/newArrivals keys.`);
  }
});
