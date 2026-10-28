// Domain data for the beauty marketplace (client + master modes)

export type VenueType = 'salon' | 'barbershop' | 'private'

export const venueTypeLabel: Record<VenueType, string> = {
  salon: 'Салон',
  barbershop: 'Барбершоп',
  private: 'Частный мастер',
}

export type Category = {
  id: string
  name: string
  tagline: string
  // tuned for a slightly cooler / less-pink treatment on "male-leaning" categories
  tone: 'warm' | 'neutral'
  image: string
}

export const categories: Category[] = [
  {
    id: 'salons',
    name: 'Салоны красоты',
    tagline: 'Все услуги под одной крышей',
    tone: 'warm',
    image:
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 'barbershops',
    name: 'Барбершопы',
    tagline: 'Мужские стрижки, бритьё',
    tone: 'neutral',
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 'nails',
    name: 'Ногтевой сервис',
    tagline: 'Маникюр и педикюр',
    tone: 'warm',
    image:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 'hair',
    name: 'Парикмахерские',
    tagline: 'Стрижки и окрашивание',
    tone: 'warm',
    image:
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 'brows',
    name: 'Брови и ресницы',
    tagline: 'Оформление и наращивание',
    tone: 'warm',
    image:
      'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 'cosmetology',
    name: 'Косметология',
    tagline: 'Уход и аппаратные процедуры',
    tone: 'neutral',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 'massage',
    name: 'Массаж и SPA',
    tagline: 'Расслабление и восстановление',
    tone: 'neutral',
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 'dental',
    name: 'Стоматология',
    tagline: 'Здоровье и эстетика улыбки',
    tone: 'neutral',
    image:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 'tattoo',
    name: 'Тату и пирсинг',
    tagline: 'Авторские работы',
    tone: 'neutral',
    image:
      'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 'other',
    name: 'Другие услуги',
    tagline: 'Депиляция, визаж и не только',
    tone: 'warm',
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=600&fit=crop&auto=format',
  },
]

export type Service = { name: string; price: number; duration: number }

export type Master = {
  id: string
  name: string
  venueType: VenueType
  categoryId: string
  specialty: string
  district: string
  city: string
  rating: number
  reviews: number
  priceFrom: number
  photo: string
  cover: string
  bio: string
  services: Service[]
  gallery: string[]
}

export const masters: Master[] = [
  {
    id: 'm1',
    name: 'Айгерим Салон «Луна»',
    venueType: 'salon',
    categoryId: 'salons',
    specialty: 'Комплекс услуг красоты',
    district: 'Бостандыкский',
    city: 'Алматы',
    rating: 4.9,
    reviews: 342,
    priceFrom: 6000,
    photo:
      'https://images.unsplash.com/photo-1626383137804-ff908d2753a2?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&h=500&fit=crop&auto=format',
    bio: 'Полноформатный салон красоты в центре Алматы: волосы, ногти, брови и уходовые процедуры под одной крышей.',
    services: [
      { name: 'Женская стрижка', price: 8000, duration: 60 },
      { name: 'Окрашивание в один тон', price: 18000, duration: 120 },
      { name: 'Маникюр с покрытием', price: 6000, duration: 90 },
      { name: 'Оформление бровей', price: 5000, duration: 40 },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1634449862841-8c6e970117e5?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1706629503650-cade709d15e3?w=400&h=400&fit=crop&auto=format',
    ],
  },
  {
    id: 'm2',
    name: 'BOSS Barbershop',
    venueType: 'barbershop',
    categoryId: 'barbershops',
    specialty: 'Мужские стрижки и бритьё',
    district: 'Медеуский',
    city: 'Алматы',
    rating: 4.8,
    reviews: 521,
    priceFrom: 5000,
    photo:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&h=500&fit=crop&auto=format',
    bio: 'Классический барбершоп: точные фейды, оформление бороды и опасное бритьё. Кофе и атмосфера в комплекте.',
    services: [
      { name: 'Мужская стрижка', price: 6000, duration: 45 },
      { name: 'Стрижка + борода', price: 9000, duration: 70 },
      { name: 'Королевское бритьё', price: 7000, duration: 50 },
      { name: 'Камуфляж седины', price: 8000, duration: 40 },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1647140655214-e4a2d914971f?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1657105052497-f996284ffff8?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop&auto=format',
    ],
  },
  {
    id: 'm3',
    name: 'Динара — мастер маникюра',
    venueType: 'private',
    categoryId: 'nails',
    specialty: 'Маникюр, педикюр, дизайн',
    district: 'Алмалинский',
    city: 'Алматы',
    rating: 5.0,
    reviews: 187,
    priceFrom: 5500,
    photo:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&h=500&fit=crop&auto=format',
    bio: 'Частный мастер с домашней студией. Аккуратный аппаратный маникюр, стойкое покрытие и авторский дизайн.',
    services: [
      { name: 'Маникюр + гель-лак', price: 6500, duration: 90 },
      { name: 'Педикюр + покрытие', price: 9000, duration: 100 },
      { name: 'Дизайн (за 2 ногтя)', price: 1500, duration: 20 },
      { name: 'Снятие покрытия', price: 1500, duration: 20 },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop&auto=format',
    ],
  },
  {
    id: 'm4',
    name: 'Studio Brow & Lash',
    venueType: 'salon',
    categoryId: 'brows',
    specialty: 'Брови, ресницы, ламинирование',
    district: 'Ауэзовский',
    city: 'Алматы',
    rating: 4.9,
    reviews: 264,
    priceFrom: 4500,
    photo:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=900&h=500&fit=crop&auto=format',
    bio: 'Студия взгляда: архитектура бровей, ламинирование и наращивание ресниц любой сложности.',
    services: [
      { name: 'Оформление бровей', price: 5000, duration: 45 },
      { name: 'Ламинирование бровей', price: 8000, duration: 60 },
      { name: 'Наращивание ресниц 2D', price: 12000, duration: 120 },
      { name: 'Ламинирование ресниц', price: 9000, duration: 90 },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&auto=format',
    ],
  },
  {
    id: 'm5',
    name: 'Клиника «Дерма+»',
    venueType: 'salon',
    categoryId: 'cosmetology',
    specialty: 'Косметология, уход за кожей',
    district: 'Бостандыкский',
    city: 'Алматы',
    rating: 4.7,
    reviews: 156,
    priceFrom: 12000,
    photo:
      'https://images.unsplash.com/photo-1607503873903-c5e95f80d7b9?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&h=500&fit=crop&auto=format',
    bio: 'Косметология с медицинским подходом: чистки, пилинги и аппаратные процедуры по протоколам.',
    services: [
      { name: 'Комбинированная чистка', price: 15000, duration: 90 },
      { name: 'Пилинг', price: 18000, duration: 60 },
      { name: 'Уходовая процедура', price: 12000, duration: 75 },
      { name: 'Консультация', price: 5000, duration: 30 },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=400&fit=crop&auto=format',
    ],
  },
  {
    id: 'm6',
    name: 'SPA «Тишина»',
    venueType: 'salon',
    categoryId: 'massage',
    specialty: 'Массаж и SPA-ритуалы',
    district: 'Медеуский',
    city: 'Алматы',
    rating: 4.9,
    reviews: 298,
    priceFrom: 10000,
    photo:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&h=500&fit=crop&auto=format',
    bio: 'Уютное SPA с профессиональными массажистами. Расслабляющие, спортивные и авторские ритуалы.',
    services: [
      { name: 'Классический массаж 60 мин', price: 12000, duration: 60 },
      { name: 'Спортивный массаж', price: 14000, duration: 60 },
      { name: 'SPA-ритуал для двоих', price: 30000, duration: 120 },
      { name: 'Стоун-терапия', price: 16000, duration: 90 },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=400&fit=crop&auto=format',
    ],
  },
  {
    id: 'm7',
    name: 'Ерлан — барбер',
    venueType: 'private',
    categoryId: 'barbershops',
    specialty: 'Мужские стрижки, фейды',
    district: 'Наурызбайский',
    city: 'Алматы',
    rating: 4.8,
    reviews: 96,
    priceFrom: 4000,
    photo:
      'https://images.unsplash.com/photo-1647140655214-e4a2d914971f?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1657105052497-f996284ffff8?w=900&h=500&fit=crop&auto=format',
    bio: 'Частный барбер, приём по записи. Чистые фейды и оформление бороды без спешки.',
    services: [
      { name: 'Мужская стрижка', price: 5000, duration: 45 },
      { name: 'Стрижка + борода', price: 7500, duration: 70 },
      { name: 'Детская стрижка', price: 4000, duration: 40 },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1657105052497-f996284ffff8?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop&auto=format',
    ],
  },
  {
    id: 'm8',
    name: 'Парикмахерская «Локон»',
    venueType: 'salon',
    categoryId: 'hair',
    specialty: 'Стрижки и окрашивание',
    district: 'Алмалинский',
    city: 'Алматы',
    rating: 4.6,
    reviews: 211,
    priceFrom: 5000,
    photo:
      'https://images.unsplash.com/photo-1699899657680-421c2c2d5064?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=900&h=500&fit=crop&auto=format',
    bio: 'Классическая парикмахерская для всей семьи. Стрижки, укладки и сложное окрашивание.',
    services: [
      { name: 'Женская стрижка', price: 7000, duration: 60 },
      { name: 'Мужская стрижка', price: 5000, duration: 40 },
      { name: 'Airtouch', price: 35000, duration: 240 },
      { name: 'Укладка', price: 6000, duration: 45 },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1706629503650-cade709d15e3?w=400&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1634449862841-8c6e970117e5?w=400&h=400&fit=crop&auto=format',
    ],
  },
]

// ---------- Master (job-search) mode ----------

export type Employment = 'full' | 'part' | 'rent'
export const employmentLabel: Record<Employment, string> = {
  full: 'Полная занятость',
  part: 'Частичная занятость',
  rent: 'Аренда места',
}

export type Payment = 'percent' | 'fixed' | 'chair'
export const paymentLabel: Record<Payment, string> = {
  percent: '% от чека',
  fixed: 'Фикс. оклад',
  chair: 'Аренда кресла',
}

export const specialties = [
  'Мастер маникюра',
  'Парикмахер',
  'Барбер',
  'Бровист/Лешмейкер',
  'Косметолог',
  'Массажист',
  'Визажист',
  'Администратор',
] as const

export type Specialty = (typeof specialties)[number]

export type Vacancy = {
  id: string
  salon: string
  venueType: VenueType
  logo: string
  cover: string
  specialty: Specialty
  employment: Employment
  payment: Payment
  payDetail: string
  schedule: string
  district: string
  city: string
  postedDaysAgo: number
  description: string
  requirements: string[]
  reviews: { author: string; text: string; rating: number }[]
}

export const vacancies: Vacancy[] = [
  {
    id: 'v1',
    salon: 'Салон «Луна»',
    venueType: 'salon',
    logo: 'https://images.unsplash.com/photo-1626383137804-ff908d2753a2?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&h=500&fit=crop&auto=format',
    specialty: 'Мастер маникюра',
    employment: 'full',
    payment: 'percent',
    payDetail: '50–60% от чека',
    schedule: '2/2, с 10:00 до 20:00',
    district: 'Бостандыкский',
    city: 'Алматы',
    postedDaysAgo: 2,
    description:
      'Ищем мастера маникюра в дружную команду салона в центре Алматы. Стабильный поток клиентов, все материалы предоставляем.',
    requirements: [
      'Опыт работы от 1 года',
      'Аппаратный и комбинированный маникюр',
      'Аккуратность и пунктуальность',
      'Портфолио работ',
    ],
    reviews: [
      { author: 'Асель', text: 'Работала полгода — руководство адекватное, клиентов много.', rating: 5 },
      { author: 'Гульнара', text: 'Хорошая атмосфера, но график плотный.', rating: 4 },
    ],
  },
  {
    id: 'v2',
    salon: 'BOSS Barbershop',
    venueType: 'barbershop',
    logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&h=500&fit=crop&auto=format',
    specialty: 'Барбер',
    employment: 'full',
    payment: 'percent',
    payDetail: '40–50% + чаевые',
    schedule: '5/2, сменный',
    district: 'Медеуский',
    city: 'Алматы',
    postedDaysAgo: 1,
    description:
      'В барбершоп в центре требуется опытный барбер. Раскрученное место, лояльная база клиентов, обучение фейдам за счёт заведения.',
    requirements: [
      'Опыт от 2 лет',
      'Классические и современные стрижки',
      'Работа с бородой, опасное бритьё',
      'Английский приветствуется',
    ],
    reviews: [
      { author: 'Данияр', text: 'Топовое место, поток клиентов огромный.', rating: 5 },
    ],
  },
  {
    id: 'v3',
    salon: 'Studio Brow & Lash',
    venueType: 'salon',
    logo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=900&h=500&fit=crop&auto=format',
    specialty: 'Бровист/Лешмейкер',
    employment: 'part',
    payment: 'percent',
    payDetail: '55% от чека',
    schedule: 'Гибкий график, 3–4 дня',
    district: 'Ауэзовский',
    city: 'Алматы',
    postedDaysAgo: 4,
    description:
      'Студия взгляда ищет лешмейкера на частичную занятость. Возможность совмещать, удобное расположение у метро.',
    requirements: [
      'Наращивание 2D–4D',
      'Ламинирование ресниц и бровей',
      'Свои клиенты приветствуются',
    ],
    reviews: [
      { author: 'Мадина', text: 'Хозяйка помогает с обучением, приятный коллектив.', rating: 5 },
      { author: 'Айнур', text: 'Всё честно по оплате.', rating: 5 },
    ],
  },
  {
    id: 'v4',
    salon: 'Парикмахерская «Локон»',
    venueType: 'salon',
    logo: 'https://images.unsplash.com/photo-1699899657680-421c2c2d5064?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=900&h=500&fit=crop&auto=format',
    specialty: 'Парикмахер',
    employment: 'rent',
    payment: 'chair',
    payDetail: '90 000 ₸ / месяц',
    schedule: 'Свободный',
    district: 'Алмалинский',
    city: 'Алматы',
    postedDaysAgo: 6,
    description:
      'Сдаём кресло парикмахеру со своей базой клиентов. Всё оборудование, ресепшн и уборка включены.',
    requirements: [
      'Своя клиентская база',
      'Опыт от 3 лет',
      'Ответственное отношение к рабочему месту',
    ],
    reviews: [
      { author: 'Ольга', text: 'Арендую кресло год — всё устраивает.', rating: 4 },
    ],
  },
  {
    id: 'v5',
    salon: 'SPA «Тишина»',
    venueType: 'salon',
    logo: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&h=500&fit=crop&auto=format',
    specialty: 'Массажист',
    employment: 'full',
    payment: 'fixed',
    payDetail: '250 000 ₸ + %',
    schedule: '2/2',
    district: 'Медеуский',
    city: 'Алматы',
    postedDaysAgo: 3,
    description:
      'SPA-центр премиум-класса ищет массажиста. Оклад + процент, обучение авторским ритуалам, комфортные кабинеты.',
    requirements: [
      'Медицинское образование приветствуется',
      'Классический и спортивный массаж',
      'Опыт от 2 лет',
    ],
    reviews: [
      { author: 'Тимур', text: 'Стабильная зарплата, хорошие условия.', rating: 5 },
    ],
  },
  {
    id: 'v6',
    salon: 'Частная студия Динары',
    venueType: 'private',
    logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&h=500&fit=crop&auto=format',
    specialty: 'Мастер маникюра',
    employment: 'rent',
    payment: 'chair',
    payDetail: '60 000 ₸ / месяц',
    schedule: 'Свободный',
    district: 'Алмалинский',
    city: 'Алматы',
    postedDaysAgo: 8,
    description:
      'Частный мастер сдаёт второе место в уютной домашней студии. Тихий район, парковка, приятная обстановка.',
    requirements: ['Своя база клиентов', 'Соблюдение стерильности', 'Дружелюбность'],
    reviews: [],
  },
  {
    id: 'v7',
    salon: 'Клиника «Дерма+»',
    venueType: 'salon',
    logo: 'https://images.unsplash.com/photo-1607503873903-c5e95f80d7b9?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&h=500&fit=crop&auto=format',
    specialty: 'Косметолог',
    employment: 'full',
    payment: 'fixed',
    payDetail: '300 000 ₸ + %',
    schedule: '5/2',
    district: 'Бостандыкский',
    city: 'Алматы',
    postedDaysAgo: 5,
    description:
      'Косметологическая клиника ищет косметолога-эстетиста. Современное оборудование, поток клиентов, соцпакет.',
    requirements: [
      'Медицинское образование',
      'Действующий сертификат',
      'Опыт аппаратных процедур',
    ],
    reviews: [
      { author: 'Жанна', text: 'Официальное трудоустройство, всё по-белому.', rating: 5 },
    ],
  },
  {
    id: 'v8',
    salon: 'Салон «Луна»',
    venueType: 'salon',
    logo: 'https://images.unsplash.com/photo-1626383137804-ff908d2753a2?w=200&h=200&fit=crop&auto=format',
    cover:
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&h=500&fit=crop&auto=format',
    specialty: 'Администратор',
    employment: 'full',
    payment: 'fixed',
    payDetail: '200 000 ₸',
    schedule: '2/2, с 9:00 до 21:00',
    district: 'Бостандыкский',
    city: 'Алматы',
    postedDaysAgo: 2,
    description:
      'Требуется администратор салона красоты. Работа с записью, встреча гостей, ведение соцсетей.',
    requirements: [
      'Грамотная речь',
      'Опыт в сфере услуг',
      'Уверенный ПК и CRM',
      'Приятный внешний вид',
    ],
    reviews: [
      { author: 'Камила', text: 'Хороший коллектив, всему научат.', rating: 4 },
    ],
  },
]

// ---------- Promo / salon ads (home banner) ----------

export type Promo = {
  id: string
  salon: string
  title: string
  subtitle: string
  cta: string
  image: string
}

export const promos: Promo[] = [
  {
    id: 'p1',
    salon: 'Салон «Луна»',
    title: '−30% на окрашивание',
    subtitle: 'Весь май для новых клиентов',
    cta: 'Записаться',
    image:
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=900&h=500&fit=crop&auto=format',
  },
  {
    id: 'p2',
    salon: 'BOSS Barbershop',
    title: 'Стрижка + борода 8 000 ₸',
    subtitle: 'Комплекс со скидкой до конца недели',
    cta: 'Забронировать',
    image:
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&h=500&fit=crop&auto=format',
  },
  {
    id: 'p3',
    salon: 'SPA «Тишина»',
    title: 'SPA-ритуал для двоих',
    subtitle: 'Дарим 500 бонусов за первый визит',
    cta: 'Открыть',
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&h=500&fit=crop&auto=format',
  },
]

// ---------- Bonuses / wallet ----------

export type BonusEntry = {
  id: string
  label: string
  amount: number // positive = earned, negative = spent
}

export const initialBonusBalance = 12600

export const initialBonusHistory: BonusEntry[] = [
  { id: 'b1', label: 'За запись к мастеру', amount: 150 },
  { id: 'b2', label: 'За отзыв', amount: 300 },
  { id: 'b3', label: 'Оплата услуги', amount: -700 },
  { id: 'b4', label: 'Приветственный бонус', amount: 500 },
]

// ---------- Beauty Feed ----------

export type FeedPost = {
  id: string
  image: string
  author: string
  authorPhoto: string
  caption: string
  tag: string
  likes: number
}

export const feedPosts: FeedPost[] = [
  {
    id: 'f1',
    image:
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=800&fit=crop&auto=format',
    author: 'Айжан Н.',
    authorPhoto:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&auto=format',
    caption: 'Тёплый балаяж на осень',
    tag: 'Окрашивание',
    likes: 1234,
  },
  {
    id: 'f2',
    image:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=800&fit=crop&auto=format',
    author: 'Динара Т.',
    authorPhoto:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
    caption: 'Минимализм в маникюре',
    tag: 'Маникюр',
    likes: 876,
  },
  {
    id: 'f3',
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=800&fit=crop&auto=format',
    author: 'BOSS Barbershop',
    authorPhoto:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100&h=100&fit=crop&auto=format',
    caption: 'Классический фейд',
    tag: 'Барбер',
    likes: 542,
  },
  {
    id: 'f4',
    image:
      'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&h=800&fit=crop&auto=format',
    author: 'Studio Brow & Lash',
    authorPhoto:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&auto=format',
    caption: 'Ламинирование бровей',
    tag: 'Брови',
    likes: 690,
  },
  {
    id: 'f5',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=800&fit=crop&auto=format',
    author: 'Клиника «Дерма+»',
    authorPhoto:
      'https://images.unsplash.com/photo-1607503873903-c5e95f80d7b9?w=100&h=100&fit=crop&auto=format',
    caption: 'Сияющая кожа после ухода',
    tag: 'Косметология',
    likes: 415,
  },
  {
    id: 'f6',
    image:
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&h=800&fit=crop&auto=format',
    author: 'Парикмахерская «Локон»',
    authorPhoto:
      'https://images.unsplash.com/photo-1699899657680-421c2c2d5064?w=100&h=100&fit=crop&auto=format',
    caption: 'Свежая укладка на каждый день',
    tag: 'Волосы',
    likes: 328,
  },
]

// ---------- Shop ----------

export const shopCategories = ['Для тебя', 'Косметика', 'Парфюм', 'Уход'] as const
export type ShopCategory = (typeof shopCategories)[number]

export type Product = {
  id: string
  name: string
  brand: string
  price: number
  image: string
  category: Exclude<ShopCategory, 'Для тебя'>
  featured?: boolean
}

export const products: Product[] = [
  {
    id: 's1',
    name: 'Увлажняющий шампунь',
    brand: 'Kerastase',
    price: 8900,
    image:
      'https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=500&h=500&fit=crop&auto=format',
    category: 'Уход',
    featured: true,
  },
  {
    id: 's2',
    name: 'Сыворотка для лица',
    brand: 'The Ordinary',
    price: 5900,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop&auto=format',
    category: 'Уход',
    featured: true,
  },
  {
    id: 's3',
    name: 'Матовая помада',
    brand: 'MAC',
    price: 12500,
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop&auto=format',
    category: 'Косметика',
  },
  {
    id: 's4',
    name: 'Тональный крем',
    brand: 'Estée Lauder',
    price: 24900,
    image:
      'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=500&h=500&fit=crop&auto=format',
    category: 'Косметика',
  },
  {
    id: 's5',
    name: 'Парфюмерная вода',
    brand: 'Chanel',
    price: 68000,
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop&auto=format',
    category: 'Парфюм',
    featured: true,
  },
  {
    id: 's6',
    name: 'Нишевый парфюм',
    brand: 'Le Labo',
    price: 92000,
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=500&fit=crop&auto=format',
    category: 'Парфюм',
  },
  {
    id: 's7',
    name: 'Крем для рук',
    brand: 'L’Occitane',
    price: 6500,
    image:
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop&auto=format',
    category: 'Уход',
  },
  {
    id: 's8',
    name: 'Палетка теней',
    brand: 'Huda Beauty',
    price: 32000,
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop&auto=format',
    category: 'Косметика',
  },
]

// ---------- Bookings ----------

export type Booking = {
  id: string
  masterId: string
  masterName: string
  venueType: VenueType
  photo: string
  serviceName: string
  price: number
  date: string // human label, e.g. "15 мая, сегодня"
  dateISO?: string // YYYY-MM-DD, used for localized display
  time: string
  name: string
  phone: string
  comment: string
  bonusEarned: number
}

export const districts = [
  'Все районы',
  'Алмалинский',
  'Ауэзовский',
  'Бостандыкский',
  'Медеуский',
  'Наурызбайский',
]
