import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Keyword mapping към subcategory ID
const KEYWORD_MAP: { keywords: string[]; categoryId: number; subcategoryId: number }[] = [
  // Ремонти и строителство (cat 9)
  { keywords: ["електротехник", "електро", "ел инсталация", "табло", "контакти", "осветление", "токов удар"], categoryId: 9, subcategoryId: 30 },
  { keywords: ["вик", "водопровод", "канализация", "тръби", "батерия", "мивка", "тоалетна", "душ"], categoryId: 9, subcategoryId: 29 },
  { keywords: ["боядисване", "боя", "бояджия", "латекс", "фасада"], categoryId: 9, subcategoryId: 31 },
  { keywords: ["шпакловка", "шпакловане", "зидария", "мазилка", "гипс"], categoryId: 9, subcategoryId: 32 },
  { keywords: ["ремонт на баня", "баня", "теракот", "фаянс", "санитария"], categoryId: 9, subcategoryId: 53 },
  { keywords: ["гипсокартон", "окачен таван", "преграда"], categoryId: 9, subcategoryId: 34 },
  { keywords: ["довършителни", "довършване", "ламинат", "паркет", "врати"], categoryId: 9, subcategoryId: 35 },
  { keywords: ["покрив", "керемиди", "улуци", "хидроизолация"], categoryId: 9, subcategoryId: 181 },
  { keywords: ["климатик", "климатизация", "хладилен"], categoryId: 9, subcategoryId: 64 },
  { keywords: ["ключар", "брава", "патрон", "сейф"], categoryId: 9, subcategoryId: 60 },
  { keywords: ["подово отопление", "парно", "радиатор"], categoryId: 9, subcategoryId: 187 },
  { keywords: ["декоративни мазилки", "декоративна мазилка", "венецианска"], categoryId: 9, subcategoryId: 185 },

  // Почистване (cat 11)
  { keywords: ["домашно почистване", "почистване на дом", "почистване апартамент"], categoryId: 11, subcategoryId: 36 },
  { keywords: ["основно почистване", "генерално почистване"], categoryId: 11, subcategoryId: 37 },
  { keywords: ["почистване след ремонт", "след ремонт"], categoryId: 11, subcategoryId: 38 },
  { keywords: ["офис почистване", "почистване офис"], categoryId: 11, subcategoryId: 39 },
  { keywords: ["почистване при наем", "наем почистване"], categoryId: 11, subcategoryId: 40 },
  { keywords: ["прозорци", "витрини", "фасада почистване"], categoryId: 11, subcategoryId: 68 },
  { keywords: ["тапицерия", "килими", "мокет"], categoryId: 11, subcategoryId: 69 },
  { keywords: ["генерално", "дълбоко почистване"], categoryId: 11, subcategoryId: 70 },

  // Монтаж и инсталации (cat 12)
  { keywords: ["мебели монтаж", "сглобяване мебели", "монтаж на мебели", "ikea"], categoryId: 12, subcategoryId: 41 },
  { keywords: ["монтаж климатик", "инсталация климатик"], categoryId: 12, subcategoryId: 42 },
  { keywords: ["монтаж осветление", "полилей", "лампи"], categoryId: 12, subcategoryId: 43 },
  { keywords: ["електроуреди", "пералня", "съдомиялна", "фурна"], categoryId: 12, subcategoryId: 44 },
  { keywords: ["дребни ремонти", "дребни", "домашни услуги"], categoryId: 12, subcategoryId: 45 },
  { keywords: ["хамали", "преместване", "транспорт мебели", "местене"], categoryId: 12, subcategoryId: 76 },
  { keywords: ["врати прозорци", "щори", "монтаж врати"], categoryId: 12, subcategoryId: 54 },

  // Градина и двор (cat 8)
  { keywords: ["косене", "трева", "косачка", "мораво"], categoryId: 8, subcategoryId: 20 },
  { keywords: ["поддръжка двор", "градина поддръжка"], categoryId: 8, subcategoryId: 49 },
  { keywords: ["подрязване", "дървета", "храсти", "кастрене"], categoryId: 8, subcategoryId: 50 },
  { keywords: ["озеленяване", "засаждане", "цветя", "растения"], categoryId: 8, subcategoryId: 51 },
  { keywords: ["почистване двор", "двор почистване", "листа"], categoryId: 8, subcategoryId: 52 },
  { keywords: ["поливна система", "напояване", "спринклери"], categoryId: 8, subcategoryId: 51 },
  { keywords: ["басейн", "поддръжка басейн"], categoryId: 8, subcategoryId: 85 },

  // Мебели и обзавеждане (cat 6)
  { keywords: ["мебели по поръчка", "изработка мебели", "дърводелец"], categoryId: 6, subcategoryId: 25 },
  { keywords: ["кухня по поръчка", "кухненско обзавеждане"], categoryId: 6, subcategoryId: 26 },
  { keywords: ["гардероби", "гардероб по поръчка"], categoryId: 6, subcategoryId: 27 },
  { keywords: ["ремонт мебели", "реставрация мебели"], categoryId: 6, subcategoryId: 24 },

  // Красота и грижа (cat 5)
  { keywords: ["фризьор", "подстригване", "прическа", "коса"], categoryId: 5, subcategoryId: 13 },
  { keywords: ["козметик", "козметика", "почистване лице", "масаж лице"], categoryId: 5, subcategoryId: 14 },
  { keywords: ["маникюр", "педикюр", "нокти"], categoryId: 5, subcategoryId: 15 },
  { keywords: ["масаж", "масажист", "релакс масаж"], categoryId: 5, subcategoryId: 16 },
  { keywords: ["грим", "гримьор", "сватбен грим"], categoryId: 5, subcategoryId: 17 },
  { keywords: ["лазер", "лазерна епилация", "лазерни процедури"], categoryId: 5, subcategoryId: 18 },

  // Авто услуги (cat 4)
  { keywords: ["автосервиз", "сервиз", "ремонт кола", "автомобил"], categoryId: 4, subcategoryId: 7 },
  { keywords: ["гуми", "смяна гуми", "баланс гуми"], categoryId: 4, subcategoryId: 8 },
  { keywords: ["тенекеджия", "тенекеджийски", "каросерия"], categoryId: 4, subcategoryId: 9 },
  { keywords: ["автоелектрик", "авто електрик", "диагностика"], categoryId: 4, subcategoryId: 10 },
  { keywords: ["транспорт", "превоз", "такси", "куриер"], categoryId: 4, subcategoryId: 11 },
  { keywords: ["авто почистване", "детайлинг", "полиране"], categoryId: 4, subcategoryId: 72 },
  { keywords: ["гтп", "технически преглед"], categoryId: 4, subcategoryId: 182 },

  // Компютри и IT (cat 14)
  { keywords: ["компютър", "компютърни услуги", "ремонт компютър", "лаптоп"], categoryId: 14, subcategoryId: 180 },
  { keywords: ["it услуги", "мрежи", "сървър", "програмиране"], categoryId: 14, subcategoryId: 183 },
]

function detectCategory(description: string): { categoryId: number; subcategoryId: number } | null {
  const lower = description.toLowerCase()
  
  for (const mapping of KEYWORD_MAP) {
    for (const keyword of mapping.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return { categoryId: mapping.categoryId, subcategoryId: mapping.subcategoryId }
      }
    }
  }
  return null
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    select: { id: true, description: true, businessName: true },
  })

  if (!specialist) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const text = `${specialist.businessName || ""} ${specialist.description || ""}`.trim()
  
  if (!text) {
    return NextResponse.json({ error: "Няма описание за анализ" }, { status: 400 })
  }

  const detected = detectCategory(text)

  if (!detected) {
    return NextResponse.json({ error: "Не може да се определи категория автоматично" }, { status: 404 })
  }

  // Провери дали вече има тази категория
  const existing = await prisma.specialistCategory.findFirst({
    where: { specialistId: id, subcategoryId: detected.subcategoryId },
  })

  if (existing) {
    return NextResponse.json({ message: "Категорията вече е зададена", alreadySet: true })
  }

  // Добави категорията
  await prisma.specialistCategory.create({
    data: {
      specialistId: id,
      categoryId: detected.categoryId,
      subcategoryId: detected.subcategoryId,
    },
  })

  return NextResponse.json({ 
    success: true, 
    categoryId: detected.categoryId,
    subcategoryId: detected.subcategoryId,
  })
}