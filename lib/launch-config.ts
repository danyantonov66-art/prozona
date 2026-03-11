// FINAL LAUNCH CONFIG FOR PROZONA

export const categories = [
  {
    name: "Ремонти и майстори",
    slug: "remonti",
    image: "/images/categories/remonti.jpg",
    description: "ВиК, електро, боядисване и довършителни ремонти",
    subcategories: [
      { name: "ВиК услуги", slug: "vik" },
      { name: "Електро услуги", slug: "elektro" },
      { name: "Боядисване", slug: "boyadisvane" },
      { name: "Шпакловка и зидария", slug: "shpaklovka-zidariya" },
      { name: "Ремонт на баня", slug: "remont-banya" },
      { name: "Гипсокартон", slug: "gipsokarton" },
      { name: "Довършителни ремонти", slug: "dovarshitelni-remonti" }
    ]
  },
  {
    name: "Почистване",
    slug: "pochistvane",
    image: "/images/categories/pochistvane.jpg",
    description: "Домашно, основно и офис почистване",
    subcategories: [
      { name: "Домашно почистване", slug: "domashno" },
      { name: "Основно почистване", slug: "osnovno" },
      { name: "Почистване след ремонт", slug: "sled-remont" },
      { name: "Офис почистване", slug: "ofis" },
      { name: "Почистване при смяна на наематели", slug: "naem" }
    ]
  },
  {
    name: "Монтаж и дребни услуги",
    slug: "montaj",
    image: "/images/categories/montaj.jpg",
    description: "Мебели, техника, хамали и дребни ремонти",
    subcategories: [
      { name: "Монтаж на мебели", slug: "mebeli" },
      { name: "Монтаж на климатик", slug: "klimatici" },
      { name: "Монтаж на осветление", slug: "osvetlenie" },
      { name: "Монтаж на електроуреди", slug: "elektrouredi" },
      { name: "Дребни домашни ремонти", slug: "drebni-remonti" },
      { name: "Хамалски услуги", slug: "hamali" },
      { name: "Преместване на мебели", slug: "premestvane-mebeli" }
    ]
  },
  {
    name: "Градина и двор",
    slug: "gradina",
    image: "/images/categories/gradina.jpg",
    description: "Косене, поддръжка и озеленяване",
    subcategories: [
      { name: "Косене на трева", slug: "kosene" },
      { name: "Поддръжка на двор", slug: "poddrazhka-dvor" },
      { name: "Подрязване на дървета", slug: "podryazvane" },
      { name: "Озеленяване", slug: "ozelenyavane" },
      { name: "Почистване на двор", slug: "pochistvane-dvor" }
    ]
  }
]


export const homepageBanners = [
  {
    title: "Провери профили на специалисти в твоя район",
    description: "Разгледай верифицирани майстори и услуги близо до теб.",
    cta: "Виж специалисти",
    href: "/bg/specialists",
    image: "/images/banners/specialists.jpg"
  },
  {
    title: "Стани специалист в ProZona",
    description: "Създай профил и получавай заявки от клиенти.",
    cta: "Създай профил",
    href: "/bg/become-specialist",
    image: "/images/banners/become-specialist.jpg"
  }
]


export const homepageHero = {
  title: "Намери верифициран специалист близо до теб",
  subtitle: "Ремонти, почистване, монтаж и градински услуги на едно място.",
  searchPlaceholder: "Каква услуга търсите?",
  cta: "Намери специалист"
}
