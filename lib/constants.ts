export const categories = [
  {
    id: 'stroitelstvo',
    name: 'Строителство и ремонти',
    nameEn: 'Construction',
    description: 'Майстори, ВиК, електро, бояджии',
    icon: '🔨',
    color: '#FF6B6B',
    subcategories: [
      { id: 'maistori', name: 'Майстори', icon: '🔨' },
      { id: 'remont-banya', name: 'Ремонт на баня', icon: '🚿' },
      { id: 'elektrotehnik', name: 'Електротехник', icon: '⚡' },
      { id: 'vik', name: 'ВиК', icon: '🔧' },
      { id: 'boqdji', name: 'Бояджии', icon: '🎨' },
      { id: 'gipsokarton', name: 'Гипсокартон', icon: '🧱' }
    ]
  },
  {
    id: 'auto-transport',
    name: 'Авто услуги и транспорт',
    nameEn: 'Auto Services',
    description: 'Автосервизи, тенекеджии, смяна на гуми',
    icon: '🚗',
    color: '#E67E22',
    subcategories: [
      { id: 'avtoserviz', name: 'Автосервиз', icon: '🔧' },
      { id: 'tenekedjia', name: 'Тенекеджия', icon: '🔨' },
      { id: 'smyana-na-gumi', name: 'Смяна на гуми', icon: '🛞' },
      { id: 'gtp', name: 'ГТП', icon: '📋' },
      { id: 'repatrak', name: 'Репатрак', icon: '🆘' },
      { id: 'transport', name: 'Транспорт', icon: '🚛' }
    ]
  },
  {
    id: 'domashni-uslugi',
    name: 'Домашни услуги',
    nameEn: 'Home Services',
    description: 'Почистване, хамали, градинари',
    icon: '🏠',
    color: '#4ECDC4',
    subcategories: [
      { id: 'pochistvane', name: 'Почистване', icon: '🧹' },
      { id: 'hamali', name: 'Хамали', icon: '📦' },
      { id: 'gradinar', name: 'Градинар', icon: '🌿' },
      { id: 'montaji', name: 'Монтажи', icon: '🪑' },
      { id: 'drebni-remonti', name: 'Дребни ремонти', icon: '🔨' }
    ]
  },
  {
    id: 'krasota',
    name: 'Красота и грижа за тялото',
    nameEn: 'Beauty & Care',
    description: 'Фризьори, маникюр, масажи, козметика',
    icon: '💅',
    color: '#FFA07A',
    subcategories: [
      { 
        id: 'friziorski-uslugi', 
        name: 'Фризьорски услуги', 
        icon: '💇',
        subcategories: [
          { id: 'dampsko-podstrigvane', name: 'Дамско подстригване', icon: '💇‍♀️' },
          { id: 'mazhko-podstrigvane', name: 'Мъжко подстригване', icon: '💇‍♂️' },
          { id: 'boqdisvane', name: 'Боядисване', icon: '🎨' },
          { id: 'stilizirane', name: 'Стилизиране', icon: '✨' }
        ]
      },
      { 
        id: 'manikyur', 
        name: 'Маникюр', 
        icon: '💅',
        subcategories: [
          { id: 'klasicheski-manikyur', name: 'Класически маникюр', icon: '💅' },
          { id: 'gel-lak', name: 'Гел лак', icon: '💅' },
          { id: 'noktoplastika', name: 'Ноктопластика', icon: '💅' }
        ]
      },
      { 
        id: 'pedikyur', 
        name: 'Педикюр', 
        icon: '🦶',
        subcategories: [
          { id: 'klasicheski-pedikyur', name: 'Класически педикюр', icon: '🦶' },
          { id: 'medicinski-pedikyur', name: 'Медицински педикюр', icon: '🦶' }
        ]
      },
      { 
        id: 'masaji', 
        name: 'Масажи', 
        icon: '💆',
        subcategories: [
          { id: 'relaksirasht-masaj', name: 'Релаксиращ масаж', icon: '💆' },
          { id: 'sporten-masaj', name: 'Спортен масаж', icon: '💪' },
          { id: 'lecheben-masaj', name: 'Лечебен масаж', icon: '🏥' }
        ]
      },
      { 
        id: 'kozmetichni-uslugi', 
        name: 'Козметични услуги', 
        icon: '✨',
        subcategories: [
          { id: 'pochistvane-na-lice', name: 'Почистване на лице', icon: '🧼' },
          { id: 'mikroblading', name: 'Микроблейдинг', icon: '✏️' },
          { id: 'migli', name: 'Мигли', icon: '👁️' }
        ]
      },
      { 
        id: 'epilacia', 
        name: 'Епилация', 
        icon: '🪒',
        subcategories: [
          { id: 'kola-maska', name: 'Кола маска', icon: '🍬' },
          { id: 'laserna-epilacia', name: 'Лазерна епилация', icon: '⚡' }
        ]
      }
    ]
  }
]

export const cities = [
  "София",
  "Пловдив",
  "Варна",
  "Бургас",
  "Русе",
  "Стара Загора",
  "Плевен",
  "Видин"
]