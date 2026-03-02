"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { categories, cities } from "@/lib/constants";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Комбиниран списък за търсене (категории + услуги + градове)
  const searchableItems = [
    ...categories.map(c => ({ type: 'category', name: c.name, slug: c.slug, icon: '📁' })),
    ...categories.flatMap(c => 
      c.subcategories.map(s => ({ 
        type: 'service', 
        name: s, 
        categorySlug: c.slug,
        categoryName: c.name,
        icon: '🔧' 
      }))
    ),
    ...cities.map(c => ({ type: 'city', name: c, icon: '📍' }))
  ];

  useEffect(() => {
    // Филтриране на предложенията
    if (searchQuery.trim().length > 1) {
      const filtered = searchableItems
        .filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8); // Показваме до 8 резултата
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Затваряне на предложенията при клик извън
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
    
    if (item.type === 'category') {
      router.push(`/categories/${item.slug}`);
    } else if (item.type === 'service') {
      router.push(`/categories/${item.categorySlug}?service=${encodeURIComponent(item.name)}`);
    } else if (item.type === 'city') {
      router.push(`/search?city=${encodeURIComponent(item.name)}`);
    }
  };

  return (
    <section className="py-16 bg-[#0D0D1A]">
      <div className="container mx-auto px-4 text-center">
       <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4">
          Намери надежден специалист
        </h1>
        <p className="text-xl text-gray-400 mb-8">          Верифицирани професионалисти за всички услуги в твоя град
        </p>
        
        {/* Търсачка с autocomplete */}
        <div className="max-w-2xl mx-auto relative" ref={wrapperRef}>
          <form onSubmit={searchHandler}>
            <div className="flex bg-[#1A1A2E] rounded-lg overflow-hidden">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                placeholder="Търси услуга, категория или град..."
                className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
              <button 
                type="submit"
                className="px-8 py-4 bg-[#1DB954] text-white font-medium hover:bg-[#169b43] transition-colors"
              >
                Търси
              </button>
            </div>
          </form>

          {/* Падащо меню с предложения */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-[#1A1A2E] border border-gray-700 rounded-lg shadow-xl">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full text-left px-4 py-3 hover:bg-[#25253a] transition-colors flex items-center gap-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <span className="text-white">{item.name}</span>
                    {item.type === 'service' && (
                      <span className="text-gray-400 text-xs ml-2">
                        в {item.categoryName}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs">
                    {item.type === 'category' && 'категория'}
                    {item.type === 'service' && 'услуга'}
                    {item.type === 'city' && 'град'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}