import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic, keywords } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, message: 'Topic is required' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      const prompt = `You are an expert affiliate content writer for Mondo Pets, a premium pet products review platform.
Write a comprehensive, SEO-optimized blog article about the topic: "${topic}".
Use these search keywords for optimization: ${keywords || 'pet care, pet reviews'}.

The article should be written as a listicle or buying guide to maximize affiliate conversions.
Include clean HTML headings (<h2> and <h3>), paragraphs (<p>), and bullet points (<ul>/<li>).
Crucially, insert 1 or 2 affiliate product placeholder tags directly in the content where a product recommendation card should render, using this exact format:
[AFFILIATE_PRODUCT_CARD_HERE: Product Name Suggestion]

Return the response STRICTLY as a JSON object matching this schema:
{
  "title": "Compelling, SEO-optimized Article Title",
  "slug": "url-friendly-slug-lowercase",
  "excerpt": "A short, engaging 2-sentence summary to entice readers to click",
  "content": "Full blog article HTML content containing headings, paragraphs, lists, and embedded [AFFILIATE_PRODUCT_CARD_HERE: ...] placeholders",
  "tags": ["keyword1", "keyword2", "keyword3"],
  "isFeatured": false
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
          const blogData = JSON.parse(generatedText);
          return NextResponse.json({ success: true, data: blogData });
        }
      }
    }

    // Fallback: Smart local mock generator if no key is configured or API fails
    const slug = `best-products-for-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;
    const tags = keywords ? keywords.split(',').map((k: string) => k.trim().toLowerCase()) : ['pet-care', 'buyer-guides', 'reviews'];

    const mockBlog = {
      title: `The Ultimate Buyer's Guide: Best Products for ${topic}`,
      slug,
      excerpt: `Uncover the top products for ${topic} as recommended by pet nutritionists and veterinary experts. Build a healthier lifestyle for your pet.`,
      content: `<h2>The Ultimate Buyer's Guide for ${topic}</h2>
      <p>Providing the best care for your pet requires choosing the right tools. In this expert-curated guide, we review the top-rated items, analyzing quality of materials, veterinarian feedback, and customer reviews.</p>
      
      <h3>1. Selecting the Right Formula</h3>
      <p>Always inspect ingredient panels. True high-quality formulas contain real animal protein as the primary ingredient rather than fillers like corn, wheat, or soy.</p>
      
      [AFFILIATE_PRODUCT_CARD_HERE: High Protein Dry Pet Kibble]
      
      <h3>2. Quality Material & Mental Play</h3>
      <p>Interactive feeders and toys help stimulate cognitive development, reduce anxiety, and stop destructive behavior when you are away.</p>
      
      [AFFILIATE_PRODUCT_CARD_HERE: Interactive Pet Activity Toy]
      
      <h3>Summary Checklist</h3>
      <ul>
        <li>Choose real animal protein sources over grain fillers.</li>
        <li>Consult with a vet for pets with gastrointestinal issues.</li>
        <li>Test a small sample size to ensure digestibility.</li>
      </ul>`,
      tags,
      isFeatured: false
    };

    return NextResponse.json({ success: true, data: mockBlog, isMock: true });
  } catch (error: any) {
    console.error('Error generating blog:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
