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
      { id: "drebni-remonti", name: "Майстор за дребни ремонти", icon: "🔨" },
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
      { id: "brusnar", name: "Бръснар (Barber)", icon: "💈" },
      { id: "grim", name: "Грим", icon: "💄" }
    ]
  }
]

export const cities = [
  "София", "Пловдив", "Варна", "Бургас", "Русе",
  "Стара Загора", "Плевен", "Видин", "Велико Търново",
  "Благоевград", "Перник", "Хасково", "Ямбол", "Пазарджик",
  "Добрич", "Шумен", "Сливен", "Враца", "Габрово", "Кърджали"
]
