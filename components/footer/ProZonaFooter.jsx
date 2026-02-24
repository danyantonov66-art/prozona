// components/footer/ProZonaFooter.jsx
import Link from "next/link";

export default function ProZonaFooter() {
  return (
    <footer className="border-t border-gray-800 bg-[#0D0D1A] mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#1DB954] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PZ</span>
              </div>
              <span className="text-white font-semibold">ProZona</span>
            </div>
            <p className="text-gray-400 text-sm">Намери надежден специалист близо до теб</p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Категории</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/categories/construction" className="hover:text-[#1DB954] transition-colors">Строителство</Link></li>
              <li><Link href="/categories/home" className="hover:text-[#1DB954] transition-colors">Домашни услуги</Link></li>
              <li><Link href="/categories/beauty" className="hover:text-[#1DB954] transition-colors">Красота и здраве</Link></li>
              <li><Link href="/categories/photography" className="hover:text-[#1DB954] transition-colors">Фотография</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">За нас</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-[#1DB954] transition-colors">За ProZona</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#1DB954] transition-colors">Как работи</Link></li>
              <li><Link href="/contact" className="hover:text-[#1DB954] transition-colors">Контакти</Link></li>
              <li><Link href="/faq" className="hover:text-[#1DB954] transition-colors">Често задавани въпроси</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Свържи се</h4>
            <ul className="space-y-2 text-gray-400">
              <li>office@prozona.bg</li>
              <li>+359 888 123 456</li>
              <li>София, България</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} ProZona. Всички права запазени.
        </div>
      </div>
    </footer>
  );
}