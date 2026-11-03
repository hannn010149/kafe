import { ImageSearchResult } from "@/types";

// Curated high-resolution cafe & Japanese culinary image library (Unsplash public license)
const CURATED_CAFE_GALLERY: { tags: string[]; title: string; photographer: string; url: string }[] = [
  // Matcha & Green Tea
  {
    tags: ["matcha", "latte", "green tea", "iced matcha", "uji", "greentea"],
    title: "Iced Ceremonial Matcha Latte with Cream Layer",
    photographer: "Matcha & Co",
    url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["matcha", "whisk", "chasen", "ceremonial", "tea", "traditional"],
    title: "Traditional Kyoto Matcha Whisked in Ceramic Bowl",
    photographer: "Motoki Tonn",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["matcha", "espresso", "fusion", "layer", "layered", "coffee matcha"],
    title: "Artisan Matcha Espresso Triple Layer Fusion",
    photographer: "Nate Dumlao",
    url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["hojicha", "roasted", "tea", "latte", "brown tea", "caramel"],
    title: "Smoky Roasted Hojicha Caramel Latte",
    photographer: "Tea & Spices",
    url: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["matcha", "crepe", "cake", "mille crepe", "dessert"],
    title: "Kyoto Uji Matcha Mille Crepe Cake",
    photographer: "Mae Mu",
    url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=80",
  },
  
  // Coffee & Espresso
  {
    tags: ["coffee", "latte", "cappuccino", "flat white", "latte art", "espresso"],
    title: "Velvety Cafe Latte with Swan Latte Art",
    photographer: "Fahmi Fakhrudin",
    url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["coffee", "pour over", "drip", "manual brew", "v60", "kalita", "tokyo"],
    title: "Artisan Tokyo Hand Pour-Over Coffee Brewing",
    photographer: "Battlecreek Coffee Roasters",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["cold brew", "iced coffee", "tonic", "ice", "glass", "refresh"],
    title: "12-Hour Kyoto Cold Drip Coffee with Ice Sphere",
    photographer: "Demi DeHerrera",
    url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["espresso", "crema", "single shot", "double shot", "black coffee", "americano"],
    title: "Fresh Dark Roast Espresso with Golden Crema",
    photographer: "Gerson Cifuentes",
    url: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["iced latte", "milk", "iced caramel", "vanilla latte"],
    title: "Iced Milk Coffee Glass with Swirling Dairy",
    photographer: "Devin Berko",
    url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=80",
  },

  // Japanese Desserts & Pastries
  {
    tags: ["pancake", "souffle", "fluffy", "japanese pancake", "maple", "butter"],
    title: "Tokyo Cloud Souffle Pancake with Hokkaido Butter",
    photographer: "Mae Mu",
    url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["strawberry", "sando", "fruit sando", "cream", "shokupan", "sandwich"],
    title: "Japanese Fresh Strawberry Cream Fruit Sando",
    photographer: "Kouji Tsuru",
    url: "https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["dorayaki", "red bean", "azuki", "pancake", "japanese sweet"],
    title: "Golden Honey Dorayaki with Sweet Azuki Red Bean",
    photographer: "Ryutaro Tsukata",
    url: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["cheesecake", "basque", "japanese cheesecake", "cotton cheesecake"],
    title: "Burnt Basque Cream Cheese Cake",
    photographer: "Aliona Gumeniuk",
    url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["croissant", "pastry", "bakery", "butter", "french"],
    title: "Flaky Golden Butter Croissant",
    photographer: "Mahmoud Fawzy",
    url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["cinnamon roll", "pastry", "cinnamon", "bun"],
    title: "Fresh Baked Cinnamon Swirl Roll",
    photographer: "Heather Barnes",
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
  },

  // Mains & Sandos
  {
    tags: ["katsu", "chicken katsu", "sando", "sandwich", "panko", "tonkatsu"],
    title: "Crispy Chicken Katsu Shokupan Sando",
    photographer: "Mae Mu",
    url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["tamago", "egg", "egg sando", "tamagoyaki", "sandwich"],
    title: "Tokyo Konbini Tamago Egg Salad Sando",
    photographer: "Eiliv Aceron",
    url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["curry", "japanese curry", "katsu curry", "rice", "donburi"],
    title: "Japanese Golden Curry Rice with Crispy Katsu",
    photographer: "Charles Chen",
    url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["toast", "honey toast", "shibuya", "shokupan", "ice cream"],
    title: "Shibuya Honey Brick Toast with Vanilla Gelato",
    photographer: "Toa Heftiba",
    url: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["ramen", "noodle", "japanese soup", "udon"],
    title: "Rich Tonkotsu Style Ramen Noodle Bowl",
    photographer: "Mae Mu",
    url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80",
  },

  // Tea & Refreshers
  {
    tags: ["sencha", "green tea", "japanese tea", "teapot", "ceramic"],
    title: "Japanese First-Harvest Sencha in Kyusu Teapot",
    photographer: "Masaaki Komori",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["yuzu", "tonic", "soda", "sparkler", "citrus", "mocktail", "lemon"],
    title: "Sparkling Yuzu Citrus Honey Cooler",
    photographer: "Kobby Mendez",
    url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    tags: ["sakura", "tea", "floral", "pink", "rose", "blossom"],
    title: "Delicate Sakura Blossom Floral Tea",
    photographer: "Alison Marras",
    url: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80",
  },
];

export async function searchProductImages(query: string): Promise<ImageSearchResult[]> {
  const cleanQuery = (query || "").trim().toLowerCase();
  if (!cleanQuery) return [];

  // 1. Try Unsplash API if access key is available
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (unsplashKey) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          cleanQuery + " cafe drink food"
        )}&per_page=8&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashKey}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((item: any, i: number) => ({
            id: item.id || `unsplash-${i}`,
            title: item.alt_description || `${query} suggestion ${i + 1}`,
            url: item.urls.regular,
            thumbnail_url: item.urls.small,
            photographer: item.user?.name || "Unsplash Artist",
            source: "Unsplash API",
          }));
        }
      }
    } catch (e) {
      console.warn("Unsplash API fetch failed, using curated gallery:", e);
    }
  }

  // 2. Intelligent Search in Curated Cafe Library
  const queryWords = cleanQuery.split(/\s+/).filter(Boolean);

  const scoredMatches = CURATED_CAFE_GALLERY.map((item) => {
    let score = 0;
    const titleLower = item.title.toLowerCase();

    // Check exact query inclusion
    if (titleLower.includes(cleanQuery)) score += 10;
    
    // Check keyword matches in tags
    for (const word of queryWords) {
      if (item.tags.some((t) => t.includes(word) || word.includes(t))) {
        score += 5;
      }
      if (titleLower.includes(word)) {
        score += 3;
      }
    }

    return { item, score };
  });

  // Sort by highest score
  const matches = scoredMatches
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  // If we found specific matches, pick top results
  let results = matches.slice(0, 8);

  // Fallback: If no direct matches, provide top cafe aesthetic choices
  if (results.length === 0) {
    results = CURATED_CAFE_GALLERY.slice(0, 6);
  }

  return results.map((item, idx) => ({
    id: `curated-${idx}-${Date.now()}`,
    title: item.title,
    url: item.url,
    thumbnail_url: item.url.replace("w=1000", "w=400"),
    photographer: item.photographer,
    source: "Komorebi Curated Cafe Collection",
  }));
}

