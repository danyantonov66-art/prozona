'use client'

import { useState } from 'react'

const SERVICES = [
  {
    id: 'remont-apartment',
    name: 'Ремонт на апартамент',
    icon: '🏠',
    fields: [
      { id: 'size', label: 'Площ (кв.м)', type: 'range', min: 20, max: 150, step: 5, default: 60, unit: 'кв.м' },
      { id: 'quality', label: 'Качество на материалите', type: 'select', options: [
        { value: 'budget', label: 'Бюджетни' },
        { value: 'standard', label: 'Стандартни' },
        { value: 'premium', label: 'Премиум' },
      ], default: 'standard' },
      { id: 'rooms', label: 'Брой стаи', type: 'select', options: [
        { value: '1', label: '1 стая' },
        { value: '2', label: '2 стаи' },
        { value: '3', label: '3 стаи' },
        { value: '4', label: '4+ стаи' },
      ], default: '2' },
    ],
    calculate: (fields: Record<string, any>) => {
      const size = Number(fields.size)
      const pricePerSqm = fields.quality === 'budget' ? 200 : fields.quality === 'standard' ? 350 : 550
      const base = size * pricePerSqm
      return { min: Math.round(base * 0.85), max: Math.round(base * 1.25) }
    },
  },
  {
    id: 'remont-banya',
    name: 'Ремонт на баня',
    icon: '🚿',
    fields: [
      { id: 'size', label: 'Площ на банята (кв.м)', type: 'range', min: 3, max: 15, step: 1, default: 6, unit: 'кв.м' },
      { id: 'quality', label: 'Качество', type: 'select', options: [
        { value: 'budget', label: 'Бюджетно' },
        { value: 'standard', label: 'Стандартно' },
        { value: 'premium', label: 'Премиум' },
      ], default: 'standard' },
      { id: 'vik', label: 'Смяна на ВиК инсталация', type: 'select', options: [
        { value: 'no', label: 'Не' },
        { value: 'yes', label: 'Да' },
      ], default: 'no' },
    ],
    calculate: (fields: Record<string, any>) => {
      const size = Number(fields.size)
      const base = fields.quality === 'budget' ? size * 500 : fields.quality === 'standard' ? size * 750 : size * 1200
      const vikExtra = fields.vik === 'yes' ? 1500 : 0
      return { min: Math.round((base + vikExtra) * 0.85), max: Math.round((base + vikExtra) * 1.3) }
    },
  },
  {
    id: 'boyadisvane',
    name: 'Боядисване / Шпакловка',
    icon: '🎨',
    fields: [
      { id: 'area', label: 'Площ стени (кв.м)', type: 'range', min: 20, max: 300, step: 10, default: 80, unit: 'кв.м' },
      { id: 'type', label: 'Вид работа', type: 'select', options: [
        { value: 'paint', label: 'Само боядисване' },
        { value: 'shpaklovka', label: 'Шпакловка + боя' },
        { value: 'full', label: 'Пълна подготовка + шпакловка + боя' },
      ], default: 'shpaklovka' },
    ],
    calculate: (fields: Record<string, any>) => {
      const area = Number(fields.area)
      const pricePerSqm = fields.type === 'paint' ? 8 : fields.type === 'shpaklovka' ? 18 : 28
      const base = area * pricePerSqm
      return { min: Math.round(base * 0.85), max: Math.round(base * 1.2) }
    },
  },
  {
    id: 'klimatik',
    name: 'Монтаж на климатик',
    icon: '❄️',
    fields: [
      { id: 'units', label: 'Брой климатици', type: 'range', min: 1, max: 5, step: 1, default: 1, unit: 'бр.' },
      { id: 'power', label: 'Мощност', type: 'select', options: [
        { value: 'small', label: 'До 12000 BTU' },
        { value: 'medium', label: '12000-18000 BTU' },
        { value: 'large', label: 'Над 18000 BTU' },
      ], default: 'medium' },
    ],
    calculate: (fields: Record<string, any>) => {
      const units = Number(fields.units)
      const base = fields.power === 'small' ? 200 : fields.power === 'medium' ? 280 : 380
      const total = base * units
      return { min: Math.round(total * 0.85), max: Math.round(total * 1.2) }
    },
  },
  {
    id: 'pochistvane',
    name: 'Почистване',
    icon: '🧹',
    fields: [
      { id: 'size', label: 'Площ (кв.м)', type: 'range', min: 30, max: 200, step: 10, default: 70, unit: 'кв.м' },
      { id: 'type', label: 'Вид почистване', type: 'select', options: [
        { value: 'regular', label: 'Редовно почистване' },
        { value: 'general', label: 'Генерално почистване' },
        { value: 'after-remont', label: 'След ремонт' },
      ], default: 'general' },
    ],
    calculate: (fields: Record<string, any>) => {
      const size = Number(fields.size)
      const pricePerSqm = fields.type === 'regular' ? 2.5 : fields.type === 'general' ? 4 : 6
      const base = size * pricePerSqm
      return { min: Math.round(base * 0.85), max: Math.round(base * 1.25) }
    },
  },
  {
    id: 'hamali',
    name: 'Хамали / Преместване',
    icon: '📦',
    fields: [
      { id: 'rooms', label: 'Брой стаи', type: 'select', options: [
        { value: '1', label: '1 стая' },
        { value: '2', label: '2 стаи' },
        { value: '3', label: '3 стаи' },
        { value: '4', label: '4+ стаи' },
      ], default: '2' },
      { id: 'floor', label: 'Етаж (без асансьор)', type: 'select', options: [
        { value: '1', label: '1-2 етаж / асансьор' },
        { value: '3', label: '3-4 етаж' },
        { value: '5', label: '5+ етаж' },
      ], default: '1' },
      { id: 'distance', label: 'Разстояние', type: 'select', options: [
        { value: 'local', label: 'В същия квартал' },
        { value: 'city', label: 'В същия град' },
        { value: 'other', label: 'Друг град' },
      ], default: 'city' },
    ],
    calculate: (fields: Record<string, any>) => {
      const roomsMap: Record<string, number> = { '1': 150, '2': 250, '3': 380, '4': 500 }
      const floorExtra: Record<string, number> = { '1': 0, '3': 50, '5': 100 }
      const distExtra: Record<string, number> = { 'local': 0, 'city': 80, 'other': 250 }
      const base = (roomsMap[fields.rooms] || 250) + (floorExtra[fields.floor] || 0) + (distExtra[fields.distance] || 0)
      return { min: Math.round(base * 0.85), max: Math.round(base * 1.3) }
    },
  },
  {
    id: 'vik',
    name: 'ВиК ремонт',
    icon: '🔧',
    fields: [
      { id: 'type', label: 'Вид работа', type: 'select', options: [
        { value: 'repair', label: 'Ремонт / смяна на батерия' },
        { value: 'installation', label: 'Монтаж на санитария' },
        { value: 'full', label: 'Цялостна ВиК инсталация' },
      ], default: 'repair' },
      { id: 'rooms', label: 'Брой помещения', type: 'range', min: 1, max: 5, step: 1, default: 1, unit: 'бр.' },
    ],
    calculate: (fields: Record<string, any>) => {
      const rooms = Number(fields.rooms)
      const base = fields.type === 'repair' ? 80 : fields.type === 'installation' ? 300 : 800
      const total = base * rooms
      return { min: Math.round(total * 0.8), max: Math.round(total * 1.4) }
    },
  },
  {
    id: 'gradina',
    name: 'Градинарство',
    icon: '🌿',
    fields: [
      { id: 'size', label: 'Площ на двора (кв.м)', type: 'range', min: 20, max: 500, step: 20, default: 100, unit: 'кв.м' },
      { id: 'type', label: 'Вид работа', type: 'select', options: [
        { value: 'mowing', label: 'Само косене' },
        { value: 'maintenance', label: 'Поддръжка' },
        { value: 'landscaping', label: 'Озеленяване' },
      ], default: 'maintenance' },
    ],
    calculate: (fields: Record<string, any>) => {
      const size = Number(fields.size)
      const pricePerSqm = fields.type === 'mowing' ? 0.8 : fields.type === 'maintenance' ? 2 : 15
      const base = size * pricePerSqm
      return { min: Math.round(base * 0.8), max: Math.round(base * 1.3) }
    },
  },
]

export default function PriceCalculator({ locale }: { locale: string }) {
  const [selectedService, setSelectedService] = useState(SERVICES[0])
  const [fields, setFields] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {}
    SERVICES[0].fields.forEach(f => { init[f.id] = f.default })
    return init
  })
  const [result, setResult] = useState<{ min: number; max: number } | null>(null)
  const [calculated, setCalculated] = useState(false)

  const handleServiceChange = (service: typeof SERVICES[0]) => {
    setSelectedService(service)
    const init: Record<string, any> = {}
    service.fields.forEach(f => { init[f.id] = f.default })
    setFields(init)
    setResult(null)
    setCalculated(false)
  }

  const handleCalculate = () => {
    const res = selectedService.calculate(fields)
    setResult(res)
    setCalculated(true)
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-1 text-sm text-[#86efac]">
          💰 Безплатен калкулатор
        </div>
        <h2 className="mb-3 text-3xl font-bold">Колко ще струва твоята услуга?</h2>
        <p className="mx-auto max-w-2xl text-gray-400">
          Получи ориентировъчна цена за секунди. Реалната оферта получаваш безплатно от верифициран специалист.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#151528] overflow-hidden">
        {/* Service tabs */}
        <div className="flex flex-wrap gap-1 border-b border-white/10 bg-[#0D0D1A] p-3">
          {SERVICES.map(s => (
            <button
              key={s.id}
              onClick={() => handleServiceChange(s)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                selectedService.id === s.id
                  ? 'bg-[#1DB954] text-black'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{s.icon}</span>
              <span className="hidden sm:inline">{s.name}</span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Fields */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-white/10">
            <h3 className="mb-5 text-lg font-semibold text-white flex items-center gap-2">
              <span>{selectedService.icon}</span> {selectedService.name}
            </h3>
            <div className="space-y-5">
              {selectedService.fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm text-gray-300 mb-2">
                    {field.label}
                    {field.type === 'range' && (
                      <span className="ml-2 text-[#1DB954] font-semibold">
                        {fields[field.id]} {(field as any).unit}
                      </span>
                    )}
                  </label>
                  {field.type === 'range' ? (
                    <input
                      type="range"
                      min={(field as any).min}
                      max={(field as any).max}
                      step={(field as any).step}
                      value={fields[field.id]}
                      onChange={e => setFields(prev => ({ ...prev, [field.id]: e.target.value }))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: '#1DB954' }}
                    />
                  ) : (
                    <select
                      value={fields[field.id]}
                      onChange={e => setFields(prev => ({ ...prev, [field.id]: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[#0D0D1A] border border-gray-700 rounded-xl text-white focus:border-[#1DB954] outline-none text-sm"
                    >
                      {(field as any).options.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleCalculate}
              className="mt-6 w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black hover:bg-[#1ed760] transition-all active:scale-95"
            >
              💰 Изчисли приблизителна цена
            </button>
          </div>

          {/* Result */}
          <div className="p-6 flex flex-col justify-center">
            {!calculated ? (
              <div className="text-center text-gray-500">
                 <div className="mb-4">
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="56" height="56" rx="12" fill="#1DB954" fillOpacity="0.1"/>
    <rect x="14" y="14" width="28" height="28" rx="4" stroke="#1DB954" strokeWidth="2"/>
    <rect x="18" y="18" width="8" height="5" rx="1.5" fill="#1DB954"/>
    <rect x="30" y="18" width="8" height="5" rx="1.5" fill="#1DB954" fillOpacity="0.5"/>
    <circle cx="19" cy="30" r="2" fill="#1DB954"/>
    <circle cx="28" cy="30" r="2" fill="#1DB954"/>
    <circle cx="37" cy="30" r="2" fill="#1DB954"/>
    <circle cx="19" cy="38" r="2" fill="#1DB954"/>
    <circle cx="28" cy="38" r="2" fill="#1DB954"/>
    <circle cx="37" cy="38" r="2" fill="#1DB954" fillOpacity="0.5"/>
  </svg>
</div>
<p className="text-sm">Попълни параметрите вляво и натисни "Изчисли"</p>
            ) : result ? (
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Приблизителна цена за</p>
                <p className="text-lg font-semibold text-white mb-6">{selectedService.name}</p>

                <div className="rounded-2xl border border-[#1DB954]/30 bg-[#1DB954]/5 p-6 mb-6">
                  <p className="text-sm text-gray-400 mb-1">Очакван диапазон</p>
                  <p className="text-4xl font-bold text-[#1DB954]">
                    {result.min.toLocaleString('bg-BG')} – {result.max.toLocaleString('bg-BG')} лв.
                  </p>
                </div>

                <div className="text-xs text-gray-500 mb-6 text-left space-y-1">
                  <p>⚠️ Цената е ориентировъчна и зависи от конкретните условия.</p>
                  <p>✅ Реалната оферта получаваш безплатно от специалист.</p>
                </div>

                <a
                  href={`/${locale}/request`}
                  className="block w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black hover:bg-[#1ed760] transition text-center"
                >
                  📩 Получи реална оферта безплатно
                </a>
                <a
                  href={`/${locale}/search`}
                  className="block w-full mt-2 rounded-xl border border-white/20 py-3 font-semibold text-gray-300 hover:bg-white/5 transition text-center text-sm"
                >
                  🔍 Намери специалист сега
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}