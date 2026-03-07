export const categories = [
  {
    id: "stroitelstvo",
    name: "Строителство и ремонти",
    nameEn: "Construction",
    description: "Майстори, ВиК, електро, бояджии",
    icon: "🏗️",
    color: "#FF6B6B",
    subcategories: [
      { id: "obshti-remonti", name: "Общи ремонти", icon: "🔨" },
      { id: "elektrotehnik", name: "Електротехник", icon: "⚡" },
      { id: "vik", name: "ВиК", icon: "🔧" },
      { id: "plochki-bani", name: "Плочки и бани", icon: "🚿" },
      { id: "boqdji", name: "Боядисване", icon: "🎨" },
      { id: "gipsokarton", name: "Гипсокартон", icon: "🧱" },
      { id: "pokrivi", name: "Покриви", icon: "🏠" },
      { id: "izolacii", name: "Изолации", icon: "🧰" },
      { id: "dograma", name: "Дограма", icon: "🪟" },
      { id: "drebni-remonti", name: "Дребни ремонти", icon: "🔨" },
      { id: "zidariya", name: "Зидария", icon: "🧱" },
      { id: "kofraj", name: "Кофраж", icon: "🏗️" }
    ]
  },
  {
    id: "auto-transport",
    name: "Авто услуги и транспорт",
    nameEn: "Auto Services",
    description: "Автосервизи, транспорт, хамали",
    icon: "🚗",
    color: "#E67E22",
    subcategories: [
      { id: "avtoserviz", name: "Автосервиз", icon: "🔧" },
      { id: "smyana-na-gumi", name: "Смяна на гуми", icon: "🔄" },
      { id: "patna-pomosht", name: "Пътна помощ", icon: "🚨" },
      { id: "tenekedjia", name: "Автотенекеджия", icon: "🔨" },
      { id: "avtobojadji", name: "Автобояджия", icon: "🎨" },
      { id: "gtp", name: "ГТП", icon: "📋" },
      { id: "repatrak", name: "Репатрак", icon: "🚛" },
      { id: "prevoz-tovari", name: "Превоз на товари", icon: "🚚" },
      { id: "hamali", name: "Хамали", icon: "📦" },
      { id: "premestване", name: "Преместване", icon: "🏠" }
    ]
  },
  {
    id: "krasota",
    name: "Красота и грижа",
    nameEn: "Beauty & Care",
    description: "Фризьори, маникюр, козметика, масаж",
    icon: "💅",
    color: "#FFA07A",
    subcategories: [
      { id: "frizior", name: "Фризьор", icon: "✂️" },
      { id: "manikyur", name: "Маникюр", icon: "💅" },
      { id: "pedikyur", name: "Педикюр", icon: "🦶" },
      { id: "kozmetik", name: "Козметик", icon: "✨" },
      { id: "masaj", name: "Масаж", icon: "💆" },
      { id: "migli-vezdi", name: "Мигли и вежди", icon: "👁️" },
      { id: "brusnar", name: "Бръснар", icon: "💈" },
      { id: "grim", name: "Грим", icon: "💄" }
    ]
  },
  {
    id: "mebeli",
    name: "Мебели и сглобяване",
    nameEn: "Furniture",
    description: "Сглобяване и ремонт на мебели",
    icon: "🛋️",
    color: "#8E44AD",
    subcategories: [
      { id: "sglobqvane", name: "Сглобяване на мебели", icon: "🔨" },
      { id: "remont-mebeli", name: "Ремонт на мебели", icon: "🛠️" },
      { id: "vgradeni-mebeli", name: "Вградени мебели", icon: "🪚" }
    ]
  },
  {
    id: "pochistvane",
    name: "Почистване",
    nameEn: "Cleaning",
    description: "Домашно и професионално почистване",
    icon: "🧹",
    color: "#27AE60",
    subcategories: [
      { id: "domashno-pochistvane", name: "Домашно почистване", icon: "🏠" },
      { id: "ofis-pochistvane", name: "Офис почистване", icon: "🏢" },
      { id: "sled-remont", name: "След ремонт", icon: "🧹" },
      { id: "peralne", name: "Пералня/химическо", icon: "👕" }
    ]
  },
  {
    id: "gradina",
    name: "Градина и двор",
    nameEn: "Garden",
    description: "Поддръжка на двор и озеленяване",
    icon: "🌿",
    color: "#2ECC71",
    subcategories: [
      { id: "kosene-treva", name: "Косене на трева", icon: "🌱" },
      { id: "ozelenqvane", name: "Озеленяване", icon: "🌳" },
      { id: "podrqzane", name: "Подрязване на храсти", icon: "✂️" }
    ]
  },
  {
    id: "klimatici",
    name: "Климатична техника",
    nameEn: "HVAC",
    description: "Монтаж и ремонт на климатици",
    icon: "❄️",
    color: "#3498DB",
    subcategories: [
      { id: "montaj-klimatik", name: "Монтаж на климатик", icon: "❄️" },
      { id: "remont-klimatik", name: "Ремонт на климатик", icon: "🔧" },
      { id: "demontaj-klimatik", name: "Демонтаж на климатик", icon: "🔩" }
    ]
  },
  {
    id: "uroci",
    name: "Уроци и обучения",
    nameEn: "Lessons",
    description: "Частни уроци и професионални обучения",
    icon: "📚",
    color: "#E74C3C",
    subcategories: [
      { id: "matematika", name: "Математика", icon: "📐" },
      { id: "ezici", name: "Езици", icon: "🌍" },
      { id: "muzika", name: "Музика", icon: "🎵" },
      { id: "it-uroci", name: "ИТ и програмиране", icon: "💻" }
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
  "Видин",
  "Велико Търново",
  "Благоевград",
  "Перник",
  "Хасково",
  "Ямбол",
  "Пазарджик",
  "Добрич",
  "Шумен",
  "Сливен",
  "Враца",
  "Габрово",
  "Кърджали"
]