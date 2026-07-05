import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url, title } = await req.json();

    if (!url) {
      return NextResponse.json({ success: false, message: 'URL is required' }, { status: 400 });
    }

    // Helper: Parse Amazon ASIN
    const match = url.match(/\/([A-Z0-9]{10})(?:[/?]|$)/i);
    const asin = match ? match[1] : '';

    // Helper: Format Amazon URL with Affiliate Tag
    let formattedAmazonUrl = url;
    if (url.includes('amazon.com')) {
      const tag = 'tag=mondopets-20';
      if (url.includes('?')) {
        formattedAmazonUrl = url.includes('tag=') ? url : `${url}&${tag}`;
      } else {
        formattedAmazonUrl = `${url}?${tag}`;
      }
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      const prompt = `You are an expert affiliate marketer and copywriter for Mondo Pets, a premium pet products review platform.
Analyze the following pet product details:
Product URL: ${url}
Product Name suggestion: ${title || 'Unknown Pet Product'}
Parsed ASIN: ${asin}

Generate a professional, affiliate-optimized product schema in JSON format.
Focus on writing a compelling, high-converting product description in HTML (paragraphs <p>, lists <ul>/<li>, bold <strong>).
Highlight the product's benefits, why pet owners love it, and key sales triggers.
If it is a pet food, provide realistic nutritional details (protein, fat, fiber, moisture percentages) and ingredients. If it's a toy or accessory, set these to null.
Ensure you calculate a realistic price (between $10 and $100), brand name, pet type (Dog, Cat, etc.), and type (food, toy, accessory, medicine).
Suggest a commission rate (typically 3% to 8%) and calculate an estimated margin ($ price * commission %).

Return the result STRICTLY as a JSON object matching this schema:
{
  "title": "Clean, optimized product title suitable for search rankings",
  "slug": "url-friendly-slug-lowercase",
  "description": "HTML formatted description showing features, pros, cons, and highlights",
  "price": 19.99,
  "brand": "Brand Name",
  "lifeStage": "Adult / Puppy / Senior / All Stages",
  "dietaryNeeds": "e.g. Grain-Free, High-Protein, Sensitive Stomach, or null if not food",
  "type": "food" | "toy" | "accessory" | "medicine",
  "petType": "Dog" | "Cat" | "Bird" | "Small Animal",
  "ingredients": "Comma separated ingredients list, or null if not food",
  "proteinPercent": 25.0,
  "fatPercent": 12.0,
  "fiberPercent": 4.5,
  "moisturePercent": 10.0,
  "caloricContent": "e.g. 350 kcal/cup, or null if not food",
  "editorRating": 4.5,
  "amazonASIN": "ASIN value if available",
  "commissionRate": 4.5,
  "estimatedMargin": 0.90
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (res.ok) {
        const result = await res.json();
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          const productData = JSON.parse(generatedText);
          return NextResponse.json({
            success: true,
            data: {
              ...productData,
              amazonUrl: formattedAmazonUrl
            }
          });
        }
      }
    }

    // Fallback: Smart local mock generator if no key is configured or API fails
    const guessedTitle = title || (url.includes('dog') ? 'Premium Natural Dog Food' : 'Interactive Cat Toy');
    const isFood = guessedTitle.toLowerCase().includes('food') || url.includes('food');
    const slug = guessedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const mockData = {
      title: guessedTitle,
      slug,
      description: isFood 
        ? `<p><strong>${guessedTitle}</strong> is a veterinarian-recommended formula designed to support the holistic health of your pets. Packed with premium real proteins and wholesome grains, this recipe satisfies natural cravings while delivering active benefits.</p>
        <ul>
          <li><strong>Real Meat First:</strong> Helps maintain lean, strong muscles.</li>
          <li><strong>Antioxidant-Rich:</strong> Support immune system health.</li>
          <li><strong>Healthy Fats:</strong> Omega fatty acids for skin and coat shine.</li>
        </ul>`
        : `<p><strong>${guessedTitle}</strong> is an interactive product engineered to stimulate your pet's curiosity, play drive, and mental agility. Made from durable, non-toxic materials, it offers hours of safe entertainment.</p>
        <ul>
          <li><strong>Durability:</strong> Built to withstand tough chewers and active scratchers.</li>
          <li><strong>Mental Stimulation:</strong> Promotes natural instincts and chases away boredom.</li>
          <li><strong>Safe Play:</strong> Crafted with BPA-free, eco-friendly compounds.</li>
        </ul>`,
      price: isFood ? 34.99 : 14.99,
      brand: guessedTitle.split(' ')[0] || "Purina",
      lifeStage: "Adult",
      dietaryNeeds: isFood ? "High-Protein, Grain-Free" : null,
      type: isFood ? "food" : "toy",
      petType: guessedTitle.toLowerCase().includes('cat') ? 'Cat' : 'Dog',
      ingredients: isFood ? "Chicken, Chicken Meal, Whole Brown Rice, Oats, Flaxseed, Dried Cranberries, Organic Carrots" : null,
      proteinPercent: isFood ? 26.0 : null,
      fatPercent: isFood ? 14.0 : null,
      fiberPercent: isFood ? 4.0 : null,
      moisturePercent: isFood ? 10.0 : null,
      caloricContent: isFood ? "385 kcal/cup" : null,
      editorRating: 4.6,
      amazonASIN: asin || "B01D81A5S4",
      commissionRate: 4.5,
      estimatedMargin: isFood ? 1.57 : 0.67,
      amazonUrl: formattedAmazonUrl
    };

    return NextResponse.json({ success: true, data: mockData, isMock: true });
  } catch (error: any) {
    console.error('Error enhancing product:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
