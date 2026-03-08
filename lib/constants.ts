export const categories = [
  {
    id: "stroitelstvo",
    slug: "stroitelstvo-i-remonti",
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
    slug: "avto-uslugi-i-transport",
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
      { id: "premestvane", name: "Преместване", icon: "🏠" }
    ]
  },
  {
    id: "krasota",
    slug: "krasota-i-grizha",
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
  slug: "mebeli",
  name: "Мебели и сглобяване",
  nameEn: "Furniture",
  description: "Сглобяване, ремонт и изработка на мебели",
  icon: "🛋️",
  color: "#8E44AD",
  subcategories: [
    { id: "sglobqvane-mebeli", name: "Сглобяване на мебели", icon: "🔨" },
    { id: "remont-mebeli", name: "Ремонт на мебели", icon: "🛠️" },
    { id: "izrabotka-mebeli-po-porachka", name: "Мебели по индивидуална поръчка", icon: "🪚" },
    { id: "kuhni-po-porachka", name: "Кухни по индивидуална поръчка", icon: "🍽️" }
  ]
 },
  {
    id: "pochistvane",
    slug: "pochistvane",
    name: "Почистване",
    nameEn: "Cleaning",
    description: "Домашно и професионално почистване",
    icon: "🧹",
    color: "#27AE60",
    subcategories: [
      { id: "domashno-pochistvane", name: "Домашно почистване", icon: "🏠" },
      { id: "ofis-pochistvane", name: "Офис почистване", icon: "🏢" },
      { id: "sled-remont", name: "След ремонт", icon: "🧹" },
      { id: "peralne", name: "Пране и химическо чистене", icon: "👕" }
    ]
  },
  {
    id: "dom-i-grizhi",
    slug: "dom-i-grizhi",
    name: "Дом и грижи",
    nameEn: "Home Care",
    description: "Грижи за деца, възрастни и домашни любимци",
    icon: "🏡",
    color: "#F39C12",
    subcategories: [
      { id: "gledane-deca", name: "Гледане на деца", icon: "👶" },
      { id: "gledane-vazrastni", name: "Гледане на възрастни хора", icon: "👵" },
      { id: "domashen-pomoshtnik", name: "Домашен помощник", icon: "🧹" },
      { id: "razhojdane-kucheta", name: "Разхождане на кучета", icon: "🐕" },
      { id: "grooming", name: "Груминг за домашни любимци", icon: "✂️" },
      { id: "pet-sitting", name: "Гледане на домашни любимци", icon: "🐾" },
      { id: "dostavki-pazaruvane", name: "Пазаруване и доставки", icon: "🛒" }
    ]
  },
  {
  id: "gradina",
  slug: "gradina",
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
    slug: "klimatichna-tehnika",
    name: "Климатична техника",
    nameEn: "HVAC",
    description: "Монтаж, демонтаж, профилактика и ремонт на климатици",
    icon: "❄️",
    color: "#3498DB",
    subcategories: [
      { id: "montaj-demontaj-klimatik", name: "Монтаж и демонтаж на климатик", icon: "❄️" },
      { id: "profilaktika-klimatik", name: "Профилактика на климатик", icon: "🧼" },
      { id: "remont-klimatik", name: "Ремонт на климатик", icon: "🔧" }
    ]
  },
  {
    id: "uroci",
    slug: "uroci-i-obucheniya",
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