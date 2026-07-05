import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { toast, Toaster } from "sonner";
import {
  Phone, MessageCircle, Menu, X, Moon, Sun, Globe,
  Star, Check, ChevronDown, ChevronLeft, ChevronRight,
  Shield, Zap, Users, Leaf, MapPin, Mail,
  Home, Building2, Wind, Layers, Clock, Award, ArrowRight, Sparkles, Play
} from "lucide-react";

type Lang = "uz" | "ru" | "en";

// ─── Translations ───────────────────────────────────────────────────────────
const T = {
  uz: {
    nav: { home: "Bosh sahifa", about: "Biz haqimizda", services: "Xizmatlar", gallery: "Galereya", pricing: "Narxlar", reviews: "Sharhlar", faq: "Savol-javob", contact: "Aloqa" },
    hero: {
      badge: "Toshkentdagi №1 Tozalash Xizmati",
      title: "Uyingizni",
      titleHL: "Mukammal Toza",
      title2: "Saqlang",
      sub: "Professional gilam, divan, parda, matras va uy tozalash xizmatlari. 500+ mamnun mijozlar, kafolatlangan natija.",
      cta1: "Bepul maslahat",
      cta2: "Xizmatlarni ko'rish",
    },
    about: {
      label: "Biz haqimizda",
      title: "SOF CLEAN — Sifat va Ishonch",
      p1: "2019-yildan buyon SOF CLEAN professional tozalash xizmatlarini ko'rsatib kelmoqda. Zamonaviy uskunalar va ekologik toza mahsulotlar yordamida biz sizning uyingizni chinakam toza va xavfsiz qilamiz.",
      p2: "Bizning jamoamiz 50+ malakali mutaxassislardan iborat bo'lib, har bir mijozga individual yondashuv qo'llaniladi.",
    },
    services: {
      label: "Xizmatlarimiz",
      title: "Barcha Tozalash Ehtiyojlaringiz",
      sub: "Professional uskunalar va ekologik toza mahsulotlar bilan",
      items: [
        { title: "Gilam Tozalash", desc: "Chuqur tozalash texnologiyasi bilan gilamlaringizni yangiday qilishga tayyormiz.", price: "150 000 so'm dan" },
        { title: "Divan Tozalash", desc: "Har qanday mato va divan turlarini xavfsiz va samarali tozalaymiz.", price: "200 000 so'm dan" },
        { title: "Parda Tozalash", desc: "Nozik pardalarni maxsus usul bilan tozalab, rangini saqlaymiz.", price: "80 000 so'm dan" },
        { title: "Matras Tozalash", desc: "Bakteriyalar va allergenlardan tozalash, uyqu sifatingizni oshiradi.", price: "120 000 so'm dan" },
        { title: "Uy Tozalash", desc: "To'liq uy tozalash xizmati, hamma burchaklar qamrab olinadi.", price: "250 000 so'm dan" },
        { title: "Ofis Tozalash", desc: "Korporativ mijozlar uchun muntazam va bir martalik tozalash.", price: "300 000 so'm dan" },
      ],
    },
    why: {
      label: "Nima uchun biz?",
      title: "SOF CLEAN'ni Tanlashning Sabablari",
      items: [
        { title: "Ekologik Toza", desc: "Bolalar va hayvonlar uchun xavfsiz, ekologik sertifikatlangan mahsulotlar." },
        { title: "Tez Xizmat", desc: "Buyurtma berishdan 2 soat ichida siznikida bo'lamiz." },
        { title: "Kafolat", desc: "Natija qoniqarsiz bo'lsa, bepul qayta tozalaymiz." },
        { title: "Sertifikatlangan Jamoa", desc: "50+ malakali mutaxassis, doimiy treningdan o'tgan." },
        { title: "Zamonaviy Uskunalar", desc: "Evropa standartidagi professional tozalash mashinalari." },
        { title: "24/7 Qo'llab-quvvatlash", desc: "Istalgan vaqt bog'laning, biz doim tayyormiz." },
      ],
    },
    beforeAfter: { label: "Natijalar", title: "Oldin va Keyin", before: "Oldin", after: "Keyin" },
    process: {
      label: "Ish jarayoni",
      title: "Qanday Ishlashimiz",
      steps: [
        { num: "01", title: "Murojaat", desc: "Telefon yoki Telegram orqali bog'laning." },
        { num: "02", title: "Bepul Baholash", desc: "Mutaxassisimiz narx va vaqtni belgilaydi." },
        { num: "03", title: "Tozalash", desc: "Professional jamoa tozalash ishlarini bajaradi." },
        { num: "04", title: "Nazorat", desc: "Sifat tekshiruvi va mijoz tasdiqi." },
      ],
    },
    stats: { clients: "Mamnun Mijozlar", experience: "Yil Tajriba", projects: "Bajarilgan Loyihalar", satisfaction: "Mamnuniyat" },
    reviews: { label: "Mijoz Fikrlari", title: "Ular Nima Deydi" },
    gallery: { label: "Galereya", title: "Ishlarimiz Natijasi" },
    pricing: {
      label: "Narxlar", title: "Shaffof Narxlar", sub: "Yashirin to'lovlar yo'q",
      plans: [
        { name: "Boshlang'ich", price: "150 000", desc: "Kichik xonalar uchun", features: ["1 xona gilami", "Standart tozalash", "1 soatda qurib ketish", "7 kunlik kafolat"], popular: false },
        { name: "Premium", price: "350 000", desc: "Eng mashhur tarif", features: ["3 xona gilami", "Chuqur tozalash", "Divan tozalash", "14 kunlik kafolat", "Bepul tashish"], popular: true },
        { name: "VIP", price: "700 000", desc: "To'liq xizmat paketi", features: ["Butun uy gilamlari", "Barcha mebel", "Parda va matraslar", "30 kunlik kafolat", "Bepul tashish", "Ustuvor xizmat"], popular: false },
      ],
      currency: "so'm dan",
      book: "Buyurtma berish",
    },
    faq: {
      label: "Savol-javob", title: "Ko'p So'raladigan Savollar",
      items: [
        { q: "Tozalash qancha vaqt oladi?", a: "Xona hajmiga qarab 1-4 soat. Gilamlar odatda 30-60 daqiqada qurib ketadi." },
        { q: "Mahsulotlaringiz xavfsizmi?", a: "Ha, biz faqat ekologik sertifikatlangan, bolalar va hayvonlar uchun xavfsiz mahsulotlar ishlatamiz." },
        { q: "Buyurtmani qanday berish mumkin?", a: "Telefon, Telegram yoki saytdagi forma orqali buyurtma berishingiz mumkin." },
        { q: "Kafolat qanday ishlaydi?", a: "Natija qoniqarsiz bo'lsa, 24 soat ichida bepul qayta tozalaymiz." },
        { q: "Korporativ xizmat bormi?", a: "Ha, ofislar va korporativ mijozlar uchun maxsus shartnomalar tuzamiz." },
        { q: "Minimal buyurtma summasi qancha?", a: "Minimal buyurtma summasi 150 000 so'mdan boshlanadi." },
      ],
    },
    contact: {
      label: "Aloqa", title: "Biz Bilan Bog'laning",
      name: "Ismingiz", phone: "Telefon raqamingiz", service: "Xizmat tanlang", message: "Xabaringiz", send: "Yuborish",
      address: "Manzil", addressVal: "Toshkent, Yunusobod tumani, Amir Temur shoh ko'chasi",
      phoneVal: "+998 90 123 45 67", email: "info@sofclean.uz", hours: "Ish vaqti: 8:00 – 22:00",
      success: "Xabaringiz yuborildi! Tez orada siz bilan bog'lanamiz.",
    },
    footer: { desc: "Toshkentdagi professional tozalash xizmati. Sifat, tezlik va ishonch.", links: "Tezkor havolalar", contact: "Aloqa", rights: "Barcha huquqlar himoyalangan" },
  },
  ru: {
    nav: { home: "Главная", about: "О нас", services: "Услуги", gallery: "Галерея", pricing: "Цены", reviews: "Отзывы", faq: "FAQ", contact: "Контакты" },
    hero: {
      badge: "Клининг №1 в Ташкенте",
      title: "Содержите дом в",
      titleHL: "Идеальной Чистоте",
      title2: "",
      sub: "Профессиональная чистка ковров, диванов, штор, матрасов и уборка дома. Более 500 довольных клиентов, гарантированный результат.",
      cta1: "Бесплатная консультация",
      cta2: "Наши услуги",
    },
    about: {
      label: "О компании",
      title: "SOF CLEAN — Качество и Доверие",
      p1: "С 2019 года SOF CLEAN предоставляет профессиональные клининговые услуги в Ташкенте. Используем современное оборудование и экологически чистые средства.",
      p2: "Наша команда — 50+ сертифицированных специалистов с индивидуальным подходом к каждому клиенту.",
    },
    services: {
      label: "Наши услуги",
      title: "Все виды чистки",
      sub: "Профессиональное оборудование и экологически чистые средства",
      items: [
        { title: "Чистка ковров", desc: "Глубокая чистка с современными технологиями. Ваш ковер будет как новый.", price: "от 150 000 сум" },
        { title: "Чистка диванов", desc: "Безопасная и эффективная чистка любых тканей и конструкций.", price: "от 200 000 сум" },
        { title: "Чистка штор", desc: "Деликатная чистка с сохранением цвета и структуры ткани.", price: "от 80 000 сум" },
        { title: "Чистка матрасов", desc: "Устранение бактерий и аллергенов для качественного сна.", price: "от 120 000 сум" },
        { title: "Уборка дома", desc: "Полная уборка дома и офиса, каждый уголок под контролем.", price: "от 250 000 сум" },
        { title: "Уборка офиса", desc: "Регулярная и разовая уборка для корпоративных клиентов.", price: "от 300 000 сум" },
      ],
    },
    why: {
      label: "Почему мы?",
      title: "Преимущества SOF CLEAN",
      items: [
        { title: "Экологично", desc: "Безопасные для детей и животных экосертифицированные средства." },
        { title: "Быстрый выезд", desc: "Приедем в течение 2 часов после заявки." },
        { title: "Гарантия", desc: "Не устраивает результат — перечистим бесплатно." },
        { title: "Сертифицированная команда", desc: "50+ сертифицированных специалистов с постоянным обучением." },
        { title: "Современная техника", desc: "Профессиональные машины европейского стандарта." },
        { title: "Поддержка 24/7", desc: "Свяжитесь с нами в любое время — мы всегда готовы." },
      ],
    },
    beforeAfter: { label: "Результаты", title: "До и После", before: "До", after: "После" },
    process: {
      label: "Как мы работаем",
      title: "Процесс работы",
      steps: [
        { num: "01", title: "Заявка", desc: "Позвоните или напишите в Telegram." },
        { num: "02", title: "Оценка", desc: "Специалист рассчитает стоимость и время." },
        { num: "03", title: "Чистка", desc: "Профессиональная команда выполняет работу." },
        { num: "04", title: "Контроль", desc: "Проверка качества и подтверждение клиента." },
      ],
    },
    stats: { clients: "Довольных клиентов", experience: "Лет опыта", projects: "Выполненных проектов", satisfaction: "Удовлетворённость" },
    reviews: { label: "Отзывы клиентов", title: "Что говорят клиенты" },
    gallery: { label: "Галерея", title: "Результаты наших работ" },
    pricing: {
      label: "Цены", title: "Прозрачные цены", sub: "Без скрытых платежей",
      plans: [
        { name: "Базовый", price: "150 000", desc: "Для небольших помещений", features: ["1 комната", "Стандартная чистка", "Сушка за 1 час", "Гарантия 7 дней"], popular: false },
        { name: "Премиум", price: "350 000", desc: "Самый популярный", features: ["3 комнаты", "Глубокая чистка", "Чистка дивана", "Гарантия 14 дней", "Бесплатный выезд"], popular: true },
        { name: "VIP", price: "700 000", desc: "Полный пакет услуг", features: ["Все ковры", "Вся мебель", "Шторы и матрасы", "Гарантия 30 дней", "Бесплатный выезд", "Приоритетный сервис"], popular: false },
      ],
      currency: "сум от",
      book: "Заказать",
    },
    faq: {
      label: "FAQ", title: "Часто задаваемые вопросы",
      items: [
        { q: "Сколько времени занимает чистка?", a: "В зависимости от площади — 1-4 часа. Ковры сохнут 30-60 минут." },
        { q: "Безопасны ли ваши средства?", a: "Да, используем только экосертифицированные средства, безопасные для детей и животных." },
        { q: "Как сделать заказ?", a: "По телефону, через Telegram или через форму на сайте." },
        { q: "Как работает гарантия?", a: "Если результат не устроит — в течение 24 часов перечистим бесплатно." },
        { q: "Есть ли корпоративное обслуживание?", a: "Да, заключаем договоры на регулярную уборку для офисов и бизнеса." },
        { q: "Какая минимальная сумма заказа?", a: "Минимальная сумма заказа от 150 000 сум." },
      ],
    },
    contact: {
      label: "Контакты", title: "Свяжитесь с нами",
      name: "Ваше имя", phone: "Номер телефона", service: "Выберите услугу", message: "Ваше сообщение", send: "Отправить",
      address: "Адрес", addressVal: "Ташкент, Юнусабадский район, пр. Амира Темура",
      phoneVal: "+998 90 123 45 67", email: "info@sofclean.uz", hours: "Режим работы: 8:00 – 22:00",
      success: "Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.",
    },
    footer: { desc: "Профессиональный клининг в Ташкенте. Качество, скорость и доверие.", links: "Быстрые ссылки", contact: "Контакты", rights: "Все права защищены" },
  },
  en: {
    nav: { home: "Home", about: "About", services: "Services", gallery: "Gallery", pricing: "Pricing", reviews: "Reviews", faq: "FAQ", contact: "Contact" },
    hero: {
      badge: "Tashkent's #1 Cleaning Service",
      title: "Keep Your Home",
      titleHL: "Spotlessly Clean",
      title2: "",
      sub: "Professional carpet, sofa, curtain, mattress and home cleaning services. 500+ satisfied customers, guaranteed results.",
      cta1: "Free Consultation",
      cta2: "Our Services",
    },
    about: {
      label: "About Us",
      title: "SOF CLEAN — Quality & Trust",
      p1: "Since 2019, SOF CLEAN has been providing professional cleaning services in Tashkent. We use modern equipment and eco-certified products to make your home truly clean and safe.",
      p2: "Our team of 50+ certified specialists applies an individual approach to every client.",
    },
    services: {
      label: "Our Services",
      title: "All Your Cleaning Needs",
      sub: "Professional equipment and eco-friendly products",
      items: [
        { title: "Carpet Cleaning", desc: "Deep cleaning technology to make your carpets look brand new.", price: "from 150,000 UZS" },
        { title: "Sofa Cleaning", desc: "Safe and effective cleaning for all fabric types and structures.", price: "from 200,000 UZS" },
        { title: "Curtain Cleaning", desc: "Delicate cleaning that preserves color and fabric integrity.", price: "from 80,000 UZS" },
        { title: "Mattress Cleaning", desc: "Eliminate bacteria and allergens for a quality night's sleep.", price: "from 120,000 UZS" },
        { title: "Home Cleaning", desc: "Full home and office cleaning service, every corner covered.", price: "from 250,000 UZS" },
        { title: "Office Cleaning", desc: "Regular and one-time cleaning for corporate clients.", price: "from 300,000 UZS" },
      ],
    },
    why: {
      label: "Why Choose Us",
      title: "The SOF CLEAN Difference",
      items: [
        { title: "Eco-Friendly", desc: "Eco-certified products safe for children and pets." },
        { title: "Fast Response", desc: "We arrive within 2 hours of your booking." },
        { title: "Guaranteed", desc: "Not satisfied? We'll re-clean for free." },
        { title: "Certified Team", desc: "50+ certified specialists with ongoing training." },
        { title: "Modern Equipment", desc: "European-standard professional cleaning machines." },
        { title: "24/7 Support", desc: "Contact us anytime — we're always ready to help." },
      ],
    },
    beforeAfter: { label: "Results", title: "Before & After", before: "Before", after: "After" },
    process: {
      label: "How It Works",
      title: "Our Process",
      steps: [
        { num: "01", title: "Inquiry", desc: "Call us or message on Telegram." },
        { num: "02", title: "Free Quote", desc: "Our specialist calculates cost and time." },
        { num: "03", title: "Cleaning", desc: "Professional team performs the cleaning." },
        { num: "04", title: "Quality Check", desc: "Quality inspection and client confirmation." },
      ],
    },
    stats: { clients: "Happy Clients", experience: "Years Experience", projects: "Completed Projects", satisfaction: "Satisfaction Rate" },
    reviews: { label: "Customer Reviews", title: "What They Say" },
    gallery: { label: "Gallery", title: "Our Work Results" },
    pricing: {
      label: "Pricing", title: "Transparent Pricing", sub: "No hidden fees",
      plans: [
        { name: "Starter", price: "150,000", desc: "For small spaces", features: ["1 room carpet", "Standard cleaning", "Dries in 1 hour", "7-day guarantee"], popular: false },
        { name: "Premium", price: "350,000", desc: "Most popular", features: ["3 room carpets", "Deep cleaning", "Sofa cleaning", "14-day guarantee", "Free transport"], popular: true },
        { name: "VIP", price: "700,000", desc: "Full service package", features: ["All carpets", "All furniture", "Curtains & mattresses", "30-day guarantee", "Free transport", "Priority service"], popular: false },
      ],
      currency: "UZS from",
      book: "Book Now",
    },
    faq: {
      label: "FAQ", title: "Frequently Asked Questions",
      items: [
        { q: "How long does cleaning take?", a: "Depending on size, 1-4 hours. Carpets dry in 30-60 minutes." },
        { q: "Are your products safe?", a: "Yes, we only use eco-certified products safe for children and pets." },
        { q: "How do I book?", a: "By phone, Telegram, or through the form on our website." },
        { q: "How does the guarantee work?", a: "If not satisfied, we'll re-clean within 24 hours at no charge." },
        { q: "Do you offer corporate services?", a: "Yes, we offer contracts for regular cleaning of offices and businesses." },
        { q: "What is the minimum order?", a: "Minimum order starts from 150,000 UZS." },
      ],
    },
    contact: {
      label: "Contact", title: "Get in Touch",
      name: "Your Name", phone: "Phone Number", service: "Select Service", message: "Your Message", send: "Send Message",
      address: "Address", addressVal: "Tashkent, Yunusabad District, Amir Temur Avenue",
      phoneVal: "+998 90 123 45 67", email: "info@sofclean.uz", hours: "Working hours: 8:00 – 22:00",
      success: "Message sent! We'll get back to you shortly.",
    },
    footer: { desc: "Professional cleaning service in Tashkent. Quality, speed, and trust.", links: "Quick Links", contact: "Contact", rights: "All rights reserved" },
  },
} as const;

// ─── Data ────────────────────────────────────────────────────────────────────
const REVIEWS = [
  { name: "Nodira Yusupova", role: "Uy bekasi", text: "SOF CLEAN xizmatidan juda mamnunman! Gilam va divanimiz yangiday bo'lib ketdi. Narxi ham qulay, xodimlar juda muloyim.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=80&h=80&fit=crop&auto=format" },
  { name: "Алексей Иванов", role: "Предприниматель", text: "Заказывал чистку офиса. Приехали вовремя, всё сделали аккуратно и профессионально. Рекомендую всем!", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" },
  { name: "Malika Karimova", role: "Dizayner", text: "Pardalarimni tozalab berishdi, rang va ko'rinishi saqlanib qoldi. Kafolat ham berishdi. Rahmat!", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format" },
  { name: "Doniyor Toshmatov", role: "Muhandis", text: "Matrasimni tozalashdi, bolalarim allergiyadan qiynalmasdi. Ekologik mahsulotlar ishlatishlari juda muhim.", rating: 5, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format" },
  { name: "Елена Петрова", role: "Домохозяйка", text: "Очень довольна! Ковры стали как новые, запах свежести в доме. Буду заказывать регулярно.", rating: 5, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format" },
  { name: "Sarah Johnson", role: "Expat, Teacher", text: "Excellent service! They cleaned our apartment thoroughly. Very professional and friendly team. Highly recommended!", rating: 5, avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&auto=format" },
];

const GALLERY_IMGS = [
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format", tall: false },
  { src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=800&fit=crop&auto=format", tall: true },
  { src: "https://images.unsplash.com/photo-1527515637462-cff94aca22c7?w=600&h=400&fit=crop&auto=format", tall: false },
  { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&auto=format", tall: false },
  { src: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=800&fit=crop&auto=format", tall: true },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format", tall: false },
];

const SERVICE_ICONS = [Layers, Sparkles, Wind, Clock, Home, Building2];
const WHY_ICONS = [Leaf, Zap, Shield, Users, Award, Clock];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase mb-4"
      style={{ background: "linear-gradient(135deg,rgba(0,174,239,0.12),rgba(0,213,213,0.12))", color: "#00AEEF", border: "1px solid rgba(0,174,239,0.2)" }}>
      <Sparkles size={13} />
      {children}
    </span>
  );
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
    </div>
  );
}

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800;
        const step = end / (dur / 16);
        let cur = 0;
        const timer = setInterval(() => {
          cur += step;
          if (cur >= end) { setCount(end); clearInterval(timer); } else setCount(Math.floor(cur));
        }, 16);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>("uz");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", service: "", message: "" });

  const t = T[lang];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.contact.success, { duration: 4000, style: { background: "#00AEEF", color: "#fff" } });
    setForm({ name: "", phone: "", service: "", message: "" });
  };

  const navLinks = [
    { id: "home", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "services", label: t.nav.services },
    { id: "gallery", label: t.nav.gallery },
    { id: "pricing", label: t.nav.pricing },
    { id: "reviews", label: t.nav.reviews },
    { id: "faq", label: t.nav.faq },
    { id: "contact", label: t.nav.contact },
  ];

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(REVIEWS.length / reviewsPerPage);
  const visibleReviews = REVIEWS.slice(reviewPage * reviewsPerPage, reviewPage * reviewsPerPage + reviewsPerPage);

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-background text-foreground min-h-screen font-sans antialiased overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>

        {/* ── NAVBAR ── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3 shadow-lg" : "py-5"}`}
          style={{ background: scrolled ? (dark ? "rgba(5,13,26,0.9)" : "rgba(248,250,252,0.9)") : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid var(--border)" : "none" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            {/* Logo */}
            <button onClick={() => scrollTo("home")} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tight" style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SOF CLEAN</span>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:text-[#00AEEF]"
                  style={{ color: "var(--muted-foreground)" }}>
                  {l.label}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <div className="relative hidden md:block">
                <button onClick={() => setLangOpen(o => !o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border border-border transition-all hover:border-[#00AEEF]"
                  style={{ color: "var(--foreground)" }}>
                  <Globe size={14} />
                  {lang.toUpperCase()}
                  <ChevronDown size={12} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 py-1 rounded-xl shadow-xl border border-border bg-card min-w-[100px] z-50">
                    {(["uz", "ru", "en"] as Lang[]).map(l => (
                      <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors hover:text-[#00AEEF] ${lang === l ? "text-[#00AEEF]" : ""}`}>
                        {l === "uz" ? "O'zbek" : l === "ru" ? "Русский" : "English"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark mode */}
              <button onClick={() => setDark(d => !d)}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-border transition-all hover:border-[#00AEEF] hover:text-[#00AEEF]"
                style={{ color: "var(--muted-foreground)" }}>
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* CTA */}
              <button onClick={() => scrollTo("contact")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95"
                style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>
                <Phone size={14} />
                {t.contact.label}
              </button>

              {/* Mobile menu */}
              <button onClick={() => setMenuOpen(o => !o)} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-border">
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          {menuOpen && (
            <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map(l => (
                  <button key={l.id} onClick={() => scrollTo(l.id)}
                    className="text-left px-4 py-2.5 rounded-xl font-medium hover:text-[#00AEEF] hover:bg-accent transition-all"
                    style={{ color: "var(--foreground)" }}>
                    {l.label}
                  </button>
                ))}
                <div className="flex gap-2 mt-2">
                  {(["uz", "ru", "en"] as Lang[]).map(l => (
                    <button key={l} onClick={() => { setLang(l); setMenuOpen(false); }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${lang === l ? "border-[#00AEEF] text-[#00AEEF]" : "border-border"}`}>
                      {l === "uz" ? "UZ" : l === "ru" ? "RU" : "EN"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop&auto=format"
              alt="Professional cleaning" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: dark ? "linear-gradient(135deg,rgba(5,13,26,0.92) 0%,rgba(5,13,26,0.7) 60%,rgba(0,174,239,0.15) 100%)" : "linear-gradient(135deg,rgba(248,250,252,0.95) 0%,rgba(248,250,252,0.8) 50%,rgba(0,174,239,0.08) 100%)" }} />
          </div>
          {/* Decorative blobs */}
          <div className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle,#00AEEF,transparent)" }} />
          <div className="absolute bottom-20 left-20 w-[300px] h-[300px] rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle,#00D5D5,transparent)" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
            <div className="max-w-3xl">
              <motion.div {...fadeUp(0)}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
                  style={{ background: "linear-gradient(135deg,rgba(0,174,239,0.15),rgba(0,213,213,0.15))", border: "1px solid rgba(0,174,239,0.3)", color: "#00AEEF" }}>
                  <div className="w-2 h-2 rounded-full bg-[#00AEEF] animate-pulse" />
                  {t.hero.badge}
                </span>
              </motion.div>

              <motion.h1 {...fadeUp(0.1)} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight mb-6">
                {t.hero.title}{" "}
                <span style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {t.hero.titleHL}
                </span>
                {t.hero.title2 && <><br />{t.hero.title2}</>}
              </motion.h1>

              <motion.p {...fadeUp(0.2)} className="text-lg sm:text-xl leading-relaxed mb-8 max-w-xl" style={{ color: "var(--muted-foreground)" }}>
                {t.hero.sub}
              </motion.p>

              <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3 mb-12">
                <button onClick={() => scrollTo("contact")}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-base font-bold text-white shadow-xl transition-all hover:opacity-90 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95"
                  style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)", boxShadow: "0 8px 32px rgba(0,174,239,0.35)" }}>
                  {t.hero.cta1} <ArrowRight size={16} />
                </button>
                <button onClick={() => scrollTo("services")}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold border-2 transition-all hover:border-[#00AEEF] hover:text-[#00AEEF] hover:scale-[1.02] hover:-translate-y-0.5"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
                  <Play size={14} />
                  {t.hero.cta2}
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-6">
                {[["500+", lang === "uz" ? "Mijoz" : lang === "ru" ? "Клиентов" : "Clients"], ["5+", lang === "uz" ? "Yil" : lang === "ru" ? "Лет" : "Years"], ["98%", lang === "uz" ? "Mamnun" : lang === "ru" ? "Довольны" : "Satisfied"]].map(([num, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-2xl font-black" style={{ color: "#00AEEF" }}>{num}</span>
                    <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
            <div className="w-5 h-8 border-2 border-current rounded-full flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-current animate-bounce" />
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div {...fadeUp(0)}>
                <SectionLabel>{t.about.label}</SectionLabel>
                <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">{t.about.title}</h2>
                <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>{t.about.p1}</p>
                <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--muted-foreground)" }}>{t.about.p2}</p>
                <div className="flex flex-wrap gap-4">
                  {[["500+", lang === "uz" ? "Mamnun Mijozlar" : lang === "ru" ? "Довольных клиентов" : "Happy Clients"],
                    ["5+", lang === "uz" ? "Yil Tajriba" : lang === "ru" ? "Лет опыта" : "Years Experience"],
                    ["98%", lang === "uz" ? "Mamnuniyat" : lang === "ru" ? "Удовлетворённость" : "Satisfaction"]].map(([val, lbl]) => (
                    <div key={lbl} className="px-5 py-4 rounded-2xl border border-border bg-card flex-1 min-w-[120px] text-center">
                      <div className="text-3xl font-black mb-1" style={{ color: "#00AEEF" }}>{val}</div>
                      <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div {...fadeUp(0.15)} className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&auto=format"
                    alt="SOF CLEAN professional team" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,174,239,0.3),transparent)" }} />
                </div>
                {/* Float badge */}
                <div className="absolute -bottom-5 -left-5 px-5 py-4 rounded-2xl shadow-xl border border-border bg-card flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>
                    <Shield className="text-white" size={22} />
                  </div>
                  <div>
                    <div className="font-black text-lg">100%</div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{lang === "uz" ? "Kafolat" : lang === "ru" ? "Гарантия" : "Guarantee"}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" className="py-24 lg:py-32" style={{ background: "var(--muted)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp(0)} className="text-center mb-16">
              <SectionLabel>{t.services.label}</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-black mb-4">{t.services.title}</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted-foreground)" }}>{t.services.sub}</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.services.items.map((svc, i) => {
                const Icon = SERVICE_ICONS[i];
                return (
                  <motion.div key={i} {...fadeUp(i * 0.08)}
                    className="group relative p-6 rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-default overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                      style={{ background: "linear-gradient(135deg,rgba(0,174,239,0.05),rgba(0,213,213,0.05))" }} />
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: "linear-gradient(135deg,rgba(0,174,239,0.15),rgba(0,213,213,0.15))" }}>
                      <Icon size={26} style={{ color: "#00AEEF" }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{svc.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>{svc.desc}</p>
                    <span className="inline-block text-sm font-bold" style={{ color: "#00AEEF" }}>{svc.price}</span>
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: "#00AEEF" }}>
                      {lang === "uz" ? "Buyurtma berish" : lang === "ru" ? "Заказать" : "Book Now"} <ArrowRight size={14} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section id="why" className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp(0)} className="text-center mb-16">
              <SectionLabel>{t.why.label}</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-black">{t.why.title}</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.why.items.map((item, i) => {
                const Icon = WHY_ICONS[i];
                return (
                  <motion.div key={i} {...fadeUp(i * 0.08)} className="flex gap-4 p-6 rounded-3xl border border-border bg-card hover:border-[#00AEEF]/30 transition-all duration-300 group">
                    <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1">{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── BEFORE / AFTER ── */}
        <section id="before-after" className="py-24 lg:py-32" style={{ background: "var(--muted)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp(0)} className="text-center mb-12">
              <SectionLabel>{t.beforeAfter.label}</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-black">{t.beforeAfter.title}</h2>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ height: "420px" }}>
              {/* After */}
              <img src="https://images.unsplash.com/photo-1527515637462-cff94aca22c7?w=1200&h=600&fit=crop&auto=format"
                alt="After cleaning" className="absolute inset-0 w-full h-full object-cover" />
              {/* After label */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-white z-10"
                style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>{t.beforeAfter.after}</div>

              {/* Before */}
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <img src="https://images.unsplash.com/photo-1558442074-3c19857bc1dc?w=1200&h=600&fit=crop&auto=format"
                  alt="Before cleaning" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "saturate(0.4) brightness(0.7)" }} />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white z-10 bg-gray-600/80">{t.beforeAfter.before}</div>
              </div>

              {/* Divider */}
              <div className="absolute inset-y-0 z-20 flex items-center" style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}>
                <div className="h-full w-0.5 bg-white shadow-xl" />
                <div className="absolute w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center cursor-ew-resize"
                  style={{ boxShadow: "0 4px 20px rgba(0,174,239,0.4)" }}>
                  <ChevronLeft size={14} className="text-[#00AEEF]" />
                  <ChevronRight size={14} className="text-[#00AEEF]" />
                </div>
              </div>

              {/* Slider input */}
              <input type="range" min={5} max={95} value={sliderPos} onChange={e => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize" />
            </motion.div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section id="process" className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp(0)} className="text-center mb-16">
              <SectionLabel>{t.process.label}</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-black">{t.process.title}</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* connector line */}
              <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px" style={{ background: "linear-gradient(to right,#00AEEF,#00D5D5)" }} />
              {t.process.steps.map((step, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)} className="relative flex flex-col items-center text-center p-6">
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-5 text-white font-black text-xl shadow-xl z-10"
                    style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)", boxShadow: "0 8px 24px rgba(0,174,239,0.4)" }}>
                    {step.num}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl bg-white" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl bg-white" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { end: 500, suffix: "+", label: t.stats.clients },
                { end: 5, suffix: "+", label: t.stats.experience },
                { end: 2000, suffix: "+", label: t.stats.projects },
                { end: 98, suffix: "%", label: t.stats.satisfaction },
              ].map((stat, i) => (
                <motion.div key={i} {...fadeUp(i * 0.08)} className="text-center text-white">
                  <div className="text-5xl lg:text-6xl font-black mb-2 tracking-tight">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section id="reviews" className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp(0)} className="text-center mb-16">
              <SectionLabel>{t.reviews.label}</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-black">{t.reviews.title}</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visibleReviews.map((rev, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)} className="p-6 rounded-3xl border border-border bg-card hover:shadow-xl transition-all duration-300">
                  <Stars n={rev.rating} />
                  <p className="mt-4 mb-6 text-sm leading-relaxed italic" style={{ color: "var(--muted-foreground)" }}>"{rev.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-sm">{rev.name}</div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{rev.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setReviewPage(p => Math.max(0, p - 1))}
                disabled={reviewPage === 0}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center transition-all hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:opacity-30">
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setReviewPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === reviewPage ? "w-6" : "opacity-40"}`}
                  style={{ background: "#00AEEF" }} />
              ))}
              <button onClick={() => setReviewPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={reviewPage === totalPages - 1}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center transition-all hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:opacity-30">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section id="gallery" className="py-24 lg:py-32" style={{ background: "var(--muted)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp(0)} className="text-center mb-12">
              <SectionLabel>{t.gallery.label}</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-black">{t.gallery.title}</h2>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {GALLERY_IMGS.map((img, i) => (
                <motion.div key={i} {...fadeUp(i * 0.07)}
                  className={`relative overflow-hidden rounded-3xl group cursor-pointer ${img.tall ? "row-span-2" : ""}`}
                  style={{ aspectRatio: img.tall ? "3/4" : "4/3" }}>
                  <img src={img.src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top,rgba(0,174,239,0.5),transparent)" }} />
                  <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white font-bold text-sm">{lang === "uz" ? "Natija" : lang === "ru" ? "Результат" : "Result"} {i + 1}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp(0)} className="text-center mb-16">
              <SectionLabel>{t.pricing.label}</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-black mb-3">{t.pricing.title}</h2>
              <p className="text-lg" style={{ color: "var(--muted-foreground)" }}>{t.pricing.sub}</p>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {t.pricing.plans.map((plan, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className={`relative p-7 rounded-3xl border flex flex-col transition-all duration-300 ${plan.popular ? "border-[#00AEEF] shadow-2xl scale-[1.03]" : "border-border bg-card hover:border-[#00AEEF]/40 hover:-translate-y-1 hover:shadow-xl"}`}
                  style={plan.popular ? { background: "linear-gradient(135deg,rgba(0,174,239,0.08),rgba(0,213,213,0.08))", boxShadow: "0 16px 48px rgba(0,174,239,0.2)" } : {}}>
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold"
                      style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>
                      {lang === "uz" ? "Mashhur" : lang === "ru" ? "Популярный" : "Popular"}
                    </div>
                  )}
                  <div className="text-xl font-black mb-1">{plan.name}</div>
                  <div className="text-sm mb-5" style={{ color: "var(--muted-foreground)" }}>{plan.desc}</div>
                  <div className="mb-6">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-sm ml-1" style={{ color: "var(--muted-foreground)" }}>{t.pricing.currency}</span>
                  </div>
                  <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>
                          <Check size={11} className="text-white" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => scrollTo("contact")}
                    className={`w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 ${plan.popular ? "text-white" : "border border-border hover:border-[#00AEEF] hover:text-[#00AEEF]"}`}
                    style={plan.popular ? { background: "linear-gradient(135deg,#00AEEF,#00D5D5)" } : {}}>
                    {t.pricing.book}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-24 lg:py-32" style={{ background: "var(--muted)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp(0)} className="text-center mb-12">
              <SectionLabel>{t.faq.label}</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-black">{t.faq.title}</h2>
            </motion.div>
            <div className="flex flex-col gap-3">
              {t.faq.items.map((item, i) => (
                <motion.div key={i} {...fadeUp(i * 0.06)}
                  className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold hover:text-[#00AEEF] transition-colors">
                    <span>{item.q}</span>
                    <ChevronDown size={18} className={`shrink-0 ml-3 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-[#00AEEF]" : ""}`} />
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${openFaq === i ? "max-h-48" : "max-h-0"}`}>
                    <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{item.a}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp(0)} className="text-center mb-16">
              <SectionLabel>{t.contact.label}</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-black">{t.contact.title}</h2>
            </motion.div>
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <motion.form {...fadeUp(0.1)} onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 rounded-3xl border border-border bg-card shadow-lg">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{t.contact.name}</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder={t.contact.name}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground text-sm focus:outline-none focus:border-[#00AEEF] transition-colors placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{t.contact.phone}</label>
                    <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+998 __ ___ __ __"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground text-sm focus:outline-none focus:border-[#00AEEF] transition-colors placeholder:text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t.contact.service}</label>
                  <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground text-sm focus:outline-none focus:border-[#00AEEF] transition-colors">
                    <option value="">{t.contact.service}</option>
                    {t.services.items.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t.contact.message}</label>
                  <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder={t.contact.message}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground text-sm focus:outline-none focus:border-[#00AEEF] transition-colors resize-none placeholder:text-muted-foreground" />
                </div>
                <button type="submit"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:scale-[1.01] active:scale-95"
                  style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)", boxShadow: "0 8px 24px rgba(0,174,239,0.3)" }}>
                  <ArrowRight size={16} />
                  {t.contact.send}
                </button>
              </motion.form>

              {/* Info + Map */}
              <motion.div {...fadeUp(0.15)} className="flex flex-col gap-6">
                {/* Contact details */}
                <div className="p-6 rounded-3xl border border-border bg-card">
                  {[
                    { icon: MapPin, label: t.contact.address, val: t.contact.addressVal },
                    { icon: Phone, label: lang === "uz" ? "Telefon" : lang === "ru" ? "Телефон" : "Phone", val: t.contact.phoneVal },
                    { icon: Mail, label: "Email", val: t.contact.email },
                    { icon: Clock, label: lang === "uz" ? "Ish vaqti" : lang === "ru" ? "Режим работы" : "Hours", val: t.contact.hours },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-start gap-4 py-3 border-b border-border last:border-0">
                      <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,rgba(0,174,239,0.15),rgba(0,213,213,0.15))" }}>
                        <Icon size={18} style={{ color: "#00AEEF" }} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--muted-foreground)" }}>{label}</div>
                        <div className="text-sm font-medium">{val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map */}
                <div className="rounded-3xl overflow-hidden border border-border flex-1 min-h-[240px]">
                  <iframe
                    title="SOF CLEAN location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191828.64395530956!2d69.14549055!3d41.29950!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C+Uzbekistan!5e0!3m2!1sen!2s!4v1704000000000!5m2!1sen!2s"
                    width="100%" height="100%" style={{ border: 0, minHeight: "240px" }} allowFullScreen loading="lazy" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-16 border-t border-border" style={{ background: dark ? "#030b18" : "#f1f5f9" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
              {/* Brand */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <span className="text-xl font-black" style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SOF CLEAN</span>
                </div>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--muted-foreground)" }}>{t.footer.desc}</p>
                <div className="flex gap-3 mt-5">
                  <a href="https://t.me/sofclean" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110"
                    style={{ background: "#2AABEE" }}>
                    <MessageCircle size={18} />
                  </a>
                  <a href="tel:+998901234567"
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110"
                    style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>
                    <Phone size={18} />
                  </a>
                </div>
              </div>

              {/* Links */}
              <div>
                <div className="font-bold text-sm mb-4">{t.footer.links}</div>
                <div className="flex flex-col gap-2">
                  {navLinks.map(l => (
                    <button key={l.id} onClick={() => scrollTo(l.id)}
                      className="text-left text-sm transition-colors hover:text-[#00AEEF]"
                      style={{ color: "var(--muted-foreground)" }}>{l.label}</button>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="font-bold text-sm mb-4">{t.footer.contact}</div>
                <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                  <span>{t.contact.phoneVal}</span>
                  <span>{t.contact.email}</span>
                  <span>{t.contact.addressVal}</span>
                  <span>{t.contact.hours}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <span>© {new Date().getFullYear()} SOF CLEAN. {t.footer.rights}.</span>
              <span style={{ color: "#00AEEF" }}>Made with ♥ in Tashkent</span>
            </div>
          </div>
        </footer>

        {/* ── FLOATING BUTTONS ── */}
        <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3">
          <a href="https://t.me/sofclean" target="_blank" rel="noopener noreferrer"
            className="group w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 relative"
            style={{ background: "#2AABEE", boxShadow: "0 8px 24px rgba(42,171,238,0.5)" }}>
            <MessageCircle size={24} />
            <span className="absolute right-full mr-3 px-3 py-1 rounded-xl text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: "#2AABEE" }}>Telegram</span>
          </a>
          <a href="tel:+998901234567"
            className="group w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 relative"
            style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)", boxShadow: "0 8px 24px rgba(0,174,239,0.5)" }}>
            <Phone size={24} className="animate-[wiggle_2s_ease-in-out_infinite]" />
            <span className="absolute right-full mr-3 px-3 py-1 rounded-xl text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: "linear-gradient(135deg,#00AEEF,#00D5D5)" }}>
              {t.contact.phoneVal}
            </span>
          </a>
        </div>

      </div>
    </>
  );
}
