"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { categories } from "@/lib/constants";

export default function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/bg/search?q=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#0D0D1A] to-[#1A1A2E] text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Намери надежден специалист
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Верифицирани професионалисти за всички услуги в твоя град
          </p>
          
          <form onSubmit={handleSearch} className="relative" ref={searchRef}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Търси услуга, категория или град..."
                  className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                />
                
                {showSuggestions && filteredCategories.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          router.push(`/bg/categories/${cat.id}`);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-900 flex items-center gap-2"
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-[#1DB954] text-white font-semibold rounded-lg hover:bg-[#169b43] transition-colors"
              >
                Търси
              </button>
            </div>
          </form>

          {/* Популярни категории бутони */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/bg/categories/${cat.id}`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}