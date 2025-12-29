
import { Language } from './translations';

interface BundleContent {
  title: string;
  description: string;
  usageFlow: string;
}

export const BUNDLE_TRANSLATIONS: Record<Language, Record<string, BundleContent>> = {
  en: {
    'homebuyer-pack': {
      title: 'The Homebuyer Pack',
      description: 'Everything you need to plan your home purchase, from affordability to closing.',
      usageFlow: 'Start with **Home Affordability** to see what you can borrow. Use **Rent vs Buy** to decide if now is the right time. Finally, calculate your monthly commitment with the **Mortgage Payment** tool.'
    },
    'debt-destroyer': {
      title: 'Debt Destroyer Kit',
      description: 'Strategic tools to analyze debt, plan payoffs, and regain financial freedom.',
      usageFlow: 'Check your health with **Debt-to-Income**. Use **Credit Card Payoff** to plan your attack strategy. Reallocate funds with **Budget Allocation** to speed up the process.'
    },
    'retirement-ready': {
      title: 'Retirement Ready',
      description: 'Long-term planning tools to ensure your golden years are funded.',
      usageFlow: 'Project your total needs with **Retirement Projection**. Add pension details with **Pension Value**. Use **Compound Interest** to see how extra savings grow over time.'
    },
    'investor-toolkit': {
      title: 'The Investor Toolkit',
      description: 'Analyze potential returns and tax implications of your portfolio.',
      usageFlow: 'Calculate potential **Investment ROI**. Check **Capital Gains** to estimate taxes on profits. Use **After-Tax Return** to see your real bottom line.'
    },
    'freelance-financer': {
      title: 'Freelance Financer',
      description: 'Manage variable income, taxes, and pricing as a solo professional.',
      usageFlow: 'Determine your **Freelance Rate** based on goals. Estimate **Self-Employment Tax** to save appropriately. Check **Invoice Due** dates to manage cash flow.'
    },
    'weight-loss-warrior': {
      title: 'Weight Loss Warrior',
      description: 'Data-driven tools to understand your body\'s energy needs and composition.',
      usageFlow: 'Find your baseline with **TDEE**. Estimate **Body Fat** for a better metric than weight. Plan your diet with **Macro Split**.'
    },
    'muscle-builder': {
      title: 'Muscle Builder Pack',
      description: 'Optimize nutrition and training intensity for hypertrophy.',
      usageFlow: 'Calculate **BMR** to know your minimums. Use **Macro Split** (high protein) for diet. Analyze your meal preps with **Recipe Macro**.'
    },
    'keto-kickstart': {
      title: 'Keto Kickstart',
      description: 'Essential calculators for maintaining a ketogenic lifestyle.',
      usageFlow: 'Set your **Keto Macros**. Ensure you drink enough with **Water Intake**. Monitor your base burn with **BMR**.'
    },
    'startup-launcher': {
      title: 'Startup Launcher',
      description: 'Key metrics for early-stage companies to track viability and growth.',
      usageFlow: 'Calculate your **Burn Rate** runway. Determine your **Break-Even** point. Ensure **CLV** (Customer Lifetime Value) is higher than **CAC** (Acquisition Cost).'
    },
    'ecommerce-pro': {
      title: 'E-commerce Pro',
      description: 'Optimize pricing, margins, and inventory for your online store.',
      usageFlow: 'Set prices with **Markup**. Check your actual **Profit Margin**. Use **Reorder Point** to manage inventory stock.'
    },
    'digital-marketer': {
      title: 'Digital Marketer',
      description: 'Analyze campaign performance and social media growth.',
      usageFlow: 'Track ad spend efficiency with **ROAS**. Convert metrics with **CPM to RPM**. Monitor audience health with **Engagement Rate**.'
    },
    'student-survival': {
      title: 'Student Survival',
      description: 'Academic planning and budgeting tools for university life.',
      usageFlow: 'Track performance with **GPA Calculator**. Find out what you need on the exam with **Final Grade Needed**. Manage limited funds with **Budget Allocation**.'
    },
    'diy-renovator': {
      title: 'DIY Renovator',
      description: 'Material estimation tools for home improvement projects.',
      usageFlow: 'Measure rooms for **Flooring** and **Paint Needs**. Estimate exterior work with **Roof Area** or **Concrete Vol**.'
    },
    'travel-planner': {
      title: 'Travel Planner',
      description: 'Logistics and budgeting for your next international trip.',
      usageFlow: 'Set a **Daily Budget**. Use **Currency** conversion for prices. Plan driving with **Trip Cost** and recovery with **Jet Lag**.'
    },
    'car-buyer': {
      title: 'Car Buyer Suite',
      description: 'Analyze the total cost of auto ownership.',
      usageFlow: 'Compare **Car Loan** vs **Lease Cost**. Check future **Car Value** (depreciation). Estimate ongoing **Trip Cost** (fuel).'
    },
    'event-planner': {
      title: 'Event Planner',
      description: 'Logistics for weddings, parties, and corporate events.',
      usageFlow: 'Start with **Event Budget**. Plan food and drink with **Catering** and **Drinks**. Determine space needs with **Seating**.'
    },
    'content-creator': {
      title: 'Content Creator',
      description: 'Revenue estimation and technical tools for video/audio.',
      usageFlow: 'Estimate earnings with **YouTube RPM** or **TikTok Est**. Plan upload quality with **Bitrate Calc**.'
    },
    'eco-warrior': {
      title: 'Eco Warrior',
      description: 'Tools to measure and reduce your environmental impact.',
      usageFlow: 'Check travel impact with **Flight CO2**. Estimate home improvement with **Solar Est** or **EV Charge** savings.'
    },
    'gardener-guru': {
      title: 'Gardening Guru',
      description: 'Soil, water, and planting calculations for a thriving garden.',
      usageFlow: 'Calculate **Garden Soil** volume. Determine **Fertilizer** needs. Check **Water Req** based on rainfall.'
    },
    'teacher-aide': {
      title: 'Teacher\'s Aide',
      description: 'Quick grading and aggregate calculation tools.',
      usageFlow: 'Combine scores with **Grade Aggregator**. Check text difficulty with **Read Level**. Manage grading time with **Pomodoro Planner**.'
    }
  },
  es: {
    'homebuyer-pack': {
      title: 'Paquete para Compradores de Vivienda',
      description: 'Todo lo que necesita para planificar la compra de su casa, desde la asequibilidad hasta el cierre.',
      usageFlow: 'Comience con **Asequibilidad de Vivienda** para ver cuánto puede pedir prestado. Use **Alquilar vs Comprar** para decidir. Finalmente, calcule su compromiso mensual con la herramienta de **Pago de Hipoteca**.'
    },
    'debt-destroyer': {
      title: 'Kit Destructor de Deudas',
      description: 'Herramientas estratégicas para analizar deudas, planificar pagos y recuperar la libertad financiera.',
      usageFlow: 'Verifique su salud con **Deuda a Ingresos**. Use **Pago de Tarjeta** para planificar su estrategia. Reasigne fondos con **Presupuesto** para acelerar el proceso.'
    },
    'retirement-ready': {
      title: 'Listo para el Retiro',
      description: 'Herramientas de planificación a largo plazo para asegurar que sus años dorados estén financiados.',
      usageFlow: 'Proyecte sus necesidades con **Proyección de Jubilación**. Agregue detalles con **Valor de Pensión**. Use **Interés Compuesto** para ver el crecimiento.'
    },
    'investor-toolkit': {
      title: 'Kit del Inversor',
      description: 'Analice rendimientos potenciales e implicaciones fiscales de su cartera.',
      usageFlow: 'Calcule el **ROI de Inversión**. Verifique **Ganancias de Capital**. Use **Retorno Neto** para ver su beneficio real.'
    },
    'freelance-financer': {
      title: 'Finanzas Freelance',
      description: 'Gestione ingresos variables, impuestos y precios como profesional independiente.',
      usageFlow: 'Determine su **Tarifa Freelance**. Estime **Impuesto de Autoempleo**. Verifique fechas de **Vencimiento de Factura**.'
    },
    'weight-loss-warrior': {
      title: 'Guerrero de Pérdida de Peso',
      description: 'Herramientas basadas en datos para entender las necesidades energéticas de su cuerpo.',
      usageFlow: 'Encuentre su base con **TDEE**. Estime **Grasa Corporal**. Planifique su dieta con **Macros**.'
    },
    'muscle-builder': {
      title: 'Paquete Muscular',
      description: 'Optimice la nutrición y la intensidad del entrenamiento para la hipertrofia.',
      usageFlow: 'Calcule **BMR** para mínimos. Use **Macros** (alto en proteínas). Analice sus comidas con **Macros de Receta**.'
    },
    'keto-kickstart': {
      title: 'Inicio Keto',
      description: 'Calculadoras esenciales para mantener un estilo de vida cetogénico.',
      usageFlow: 'Configure sus **Macros Keto**. Asegure suficiente agua con **Ingesta de Agua**. Monitoree su quema base con **BMR**.'
    },
    'startup-launcher': {
      title: 'Lanzador de Startups',
      description: 'Métricas clave para rastrear la viabilidad y el crecimiento de empresas en etapa temprana.',
      usageFlow: 'Calcule su **Tasa de Gasto**. Determine su **Punto de Equilibrio**. Asegure que **CLV** sea mayor que **CAC**.'
    },
    'ecommerce-pro': {
      title: 'Profesional de E-commerce',
      description: 'Optimice precios, márgenes e inventario para su tienda en línea.',
      usageFlow: 'Fije precios con **Margen Comercial**. Verifique su **Margen de Beneficio**. Use **Punto de Pedido** para gestionar stock.'
    },
    'digital-marketer': {
      title: 'Marketer Digital',
      description: 'Analice el rendimiento de campañas y el crecimiento en redes sociales.',
      usageFlow: 'Rastree eficiencia con **ROAS**. Convierta métricas con **CPM a RPM**. Monitoree la salud de la audiencia con **Tasa de Interacción**.'
    },
    'student-survival': {
      title: 'Supervivencia Estudiantil',
      description: 'Herramientas de planificación académica y presupuesto para la vida universitaria.',
      usageFlow: 'Rastree rendimiento con **Calculadora de GPA**. Averigüe qué necesita en el examen con **Nota Final Necesaria**. Gestione fondos con **Presupuesto**.'
    },
    'diy-renovator': {
      title: 'Renovador DIY',
      description: 'Herramientas de estimación de materiales para proyectos de mejoras del hogar.',
      usageFlow: 'Mida habitaciones para **Suelo** y **Pintura Necesaria**. Estime trabajo exterior con **Área de Techo** o **Volumen Hormigón**.'
    },
    'travel-planner': {
      title: 'Planificador de Viajes',
      description: 'Logística y presupuesto para su próximo viaje internacional.',
      usageFlow: 'Fije un **Presupuesto Diario**. Use **Divisa** para precios. Planifique conducción con **Costo de Viaje** y recuperación con **Jet Lag**.'
    },
    'car-buyer': {
      title: 'Suite Comprador de Auto',
      description: 'Analice el costo total de propiedad del automóvil.',
      usageFlow: 'Compare **Préstamo de Auto** vs **Costo de Leasing**. Verifique futuro **Valor del Auto**. Estime **Costo de Viaje**.'
    },
    'event-planner': {
      title: 'Planificador de Eventos',
      description: 'Logística para bodas, fiestas y eventos corporativos.',
      usageFlow: 'Comience con **Presupuesto Evento**. Planifique comida y bebida con **Catering** y **Bebidas**. Determine espacio con **Asientos**.'
    },
    'content-creator': {
      title: 'Creador de Contenido',
      description: 'Estimación de ingresos y herramientas técnicas para video/audio.',
      usageFlow: 'Estime ganancias con **RPM YouTube** o **Est. TikTok**. Planifique calidad con **Calc. Bitrate**.'
    },
    'eco-warrior': {
      title: 'Guerrero Ecológico',
      description: 'Herramientas para medir y reducir su impacto ambiental.',
      usageFlow: 'Verifique impacto de viaje con **CO2 Vuelo**. Estime mejoras con **Est. Solar** o ahorros de **Carga VE**.'
    },
    'gardener-guru': {
      title: 'Gurú de la Jardinería',
      description: 'Cálculos de suelo, agua y plantación para un jardín próspero.',
      usageFlow: 'Calcule volumen de **Tierra Jardín**. Determine necesidades de **Fertilizante**. Verifique **Req. Agua**.'
    },
    'teacher-aide': {
      title: 'Ayudante del Maestro',
      description: 'Herramientas rápidas de calificación y cálculo agregado.',
      usageFlow: 'Combine puntajes con **Agregador de Notas**. Verifique dificultad con **Nivel Lectura**. Gestione tiempo con **Planificador Pomodoro**.'
    }
  },
  fr: {
    'homebuyer-pack': {
      title: 'Pack Acheteur Immobilier',
      description: 'Tout pour planifier votre achat immobilier, de la capacité d\'emprunt à la clôture.',
      usageFlow: 'Commencez par **Capacité d\'Emprunt**. Utilisez **Louer vs Acheter** pour décider. Calculez votre engagement mensuel avec **Paiement Hypothécaire**.'
    },
    'debt-destroyer': {
      title: 'Kit Destructeur de Dettes',
      description: 'Outils stratégiques pour analyser la dette et planifier les remboursements.',
      usageFlow: 'Vérifiez votre santé avec **Dette/Revenu**. Utilisez **Remboursement Carte de Crédit**. Réallouez des fonds avec **Budget**.'
    },
    'retirement-ready': {
      title: 'Prêt pour la Retraite',
      description: 'Outils de planification à long terme pour financer vos années dorées.',
      usageFlow: 'Projetez vos besoins avec **Projection de Retraite**. Ajoutez les détails de pension avec **Valeur Pension**. Utilisez **Intérêts Composés**.'
    },
    'investor-toolkit': {
      title: 'Boîte à Outils Investisseur',
      description: 'Analysez les rendements potentiels et les implications fiscales.',
      usageFlow: 'Calculez le **ROI**. Vérifiez **Plus-values**. Utilisez **Rendement Après Impôt**.'
    },
    'freelance-financer': {
      title: 'Finances Freelance',
      description: 'Gérez revenus variables, impôts et tarification.',
      usageFlow: 'Déterminez votre **Tarif Freelance**. Estimez **Impôt Auto-entrepreneur**. Vérifiez **Échéance Facture**.'
    },
    'weight-loss-warrior': {
      title: 'Guerrier Perte de Poids',
      description: 'Outils basés sur les données pour comprendre les besoins énergétiques.',
      usageFlow: 'Trouvez votre base avec **TDEE**. Estimez **Masse Grasse**. Planifiez votre régime avec **Répartition Macro**.'
    },
    'muscle-builder': {
      title: 'Pack Musculation',
      description: 'Optimisez nutrition et intensité d\'entraînement.',
      usageFlow: 'Calculez **BMR**. Utilisez **Répartition Macro** (protéines élevées). Analysez vos repas avec **Macro Recette**.'
    },
    'keto-kickstart': {
      title: 'Démarrage Keto',
      description: 'Calculatrices essentielles pour le mode de vie cétogène.',
      usageFlow: 'Définissez vos **Macros Keto**. Assurez l\'hydratation avec **Consommation d\'Eau**. Surveillez votre base avec **BMR**.'
    },
    'startup-launcher': {
      title: 'Lanceur de Startup',
      description: 'Métriques clés pour suivre la viabilité et la croissance.',
      usageFlow: 'Calculez votre **Taux de Combustion**. Déterminez le **Seuil de Rentabilité**. Assurez que **CLV** > **CAC**.'
    },
    'ecommerce-pro': {
      title: 'Pro E-commerce',
      description: 'Optimisez prix, marges et inventaire pour votre boutique.',
      usageFlow: 'Fixez les prix avec **Marge Commerciale**. Vérifiez la **Marge Bénéficiaire**. Utilisez **Point de Recommande**.'
    },
    'digital-marketer': {
      title: 'Marketeur Numérique',
      description: 'Analysez la performance des campagnes et la croissance sociale.',
      usageFlow: 'Suivez l\'efficacité avec **ROAS**. Convertissez avec **CPM vers RPM**. Surveillez l\'**Taux d\'Engagement**.'
    },
    'student-survival': {
      title: 'Survie Étudiante',
      description: 'Planification académique et outils budgétaires.',
      usageFlow: 'Suivez les notes avec **Calculateur Moyenne**. Trouvez le besoin avec **Note Finale Requise**. Gérez les fonds avec **Budget**.'
    },
    'diy-renovator': {
      title: 'Rénovateur Bricoleur',
      description: 'Estimation des matériaux pour les projets maison.',
      usageFlow: 'Mesurez pour **Revêtement Sol** et **Besoin Peinture**. Estimez l\'extérieur avec **Surface Toit** ou **Vol. Béton**.'
    },
    'travel-planner': {
      title: 'Planificateur de Voyage',
      description: 'Logistique et budget pour votre voyage.',
      usageFlow: 'Fixez un **Budget Quotidien**. Utilisez **Devise**. Planifiez la route avec **Coût Trajet** et récupérez avec **Décalage Horaire**.'
    },
    'car-buyer': {
      title: 'Suite Acheteur Auto',
      description: 'Analysez le coût total de possession automobile.',
      usageFlow: 'Comparez **Prêt Auto** vs **Coût Location**. Vérifiez la **Valeur Auto**. Estimez le **Coût Trajet**.'
    },
    'event-planner': {
      title: 'Planificateur d\'Événements',
      description: 'Logistique pour mariages et fêtes.',
      usageFlow: 'Commencez par **Budget**. Planifiez repas avec **Traiteur** et **Boissons**. Déterminez l\'espace avec **Asientos**.'
    },
    'content-creator': {
      title: 'Créateur de Contenu',
      description: 'Estimation des revenus et outils techniques.',
      usageFlow: 'Estimez les gains avec **RPM YouTube** ou **Est. TikTok**. Planifiez la qualité avec **Calc. Bitrate**.'
    },
    'eco-warrior': {
      title: 'Guerrier Éco',
      description: 'Outils pour mesurer et réduire votre impact.',
      usageFlow: 'Vérifiez **CO2 Vol**. Estimez améliorations avec **Est. Solaire** ou **Charge VE**.'
    },
    'gardener-guru': {
      title: 'Gourou du Jardinage',
      description: 'Calculs de sol, eau et plantation.',
      usageFlow: 'Calculez **Terre Jardin**. Déterminez **Engrais**. Vérifiez **Besoin Eau**.'
    },
    'teacher-aide': {
      title: 'Aide-Enseignant',
      description: 'Outils de notation et calcul rapide.',
      usageFlow: 'Combinez notes avec **Agrégateur**. Vérifiez difficulté avec **Niveau Lecture**. Gérez temps avec **Pomodoro**.'
    }
  },
  ru: {
    'homebuyer-pack': {
      title: 'Пакет Покупателя Жилья',
      description: 'Все для планирования покупки дома, от доступности до сделки.',
      usageFlow: 'Начните с **Доступность жилья**. Используйте **Аренда или Покупка**. Рассчитайте платеж с **Ипотека**.'
    },
    'debt-destroyer': {
      title: 'Уничтожитель Долгов',
      description: 'Инструменты для анализа долгов и планирования выплат.',
      usageFlow: 'Проверьте **Долг/Доход**. Используйте **Кредитная карта**. Перераспределите средства с **Бюджет**.'
    },
    'retirement-ready': {
      title: 'Готовность к Пенсии',
      description: 'Инструменты долгосрочного планирования для обеспечения будущего.',
      usageFlow: 'Спрогнозируйте нужды с **Пенсия**. Добавьте детали с **Пенсионная стоимость**. Используйте **Сложный процент**.'
    },
    'investor-toolkit': {
      title: 'Набор Инвестора',
      description: 'Анализ потенциальной доходности и налогов.',
      usageFlow: 'Рассчитайте **ROI**. Проверьте **Прирост капитала**. Используйте **Доход после налогов**.'
    },
    'freelance-financer': {
      title: 'Фриланс-Финансист',
      description: 'Управление переменным доходом, налогами и ценами.',
      usageFlow: 'Определите **Ставка фриланса**. Оцените **Налог самозанятого**. Проверьте **Счет**.'
    },
    'weight-loss-warrior': {
      title: 'Воин Похудения',
      description: 'Инструменты для понимания энергетических потребностей тела.',
      usageFlow: 'Найдите базу с **TDEE**. Оцените **Жир в теле**. Планируйте диету с **Макросы**.'
    },
    'muscle-builder': {
      title: 'Набор Мышц',
      description: 'Оптимизация питания и тренировок для гипертрофии.',
      usageFlow: 'Рассчитайте **БМР**. Используйте **Макросы** (высокий белок). Анализируйте еду с **Макросы рецепта**.'
    },
    'keto-kickstart': {
      title: 'Кето Старт',
      description: 'Важные калькуляторы для кетогенного образа жизни.',
      usageFlow: 'Настройте **Кето**. Обеспечьте питье с **Вода**. Следите за сжиганием с **БМР**.'
    },
    'startup-launcher': {
      title: 'Стартап Лаунчер',
      description: 'Ключевые метрики для отслеживания жизнеспособности стартапа.',
      usageFlow: 'Рассчитайте **Burn Rate**. Определите **Безубыточность**. Убедитесь, что **LTV** выше **CAC**.'
    },
    'ecommerce-pro': {
      title: 'E-commerce Про',
      description: 'Оптимизация цен, маржи и запасов для онлайн-магазина.',
      usageFlow: 'Установите цены с **Наценка**. Проверьте **Маржа**. Используйте **Точка заказа**.'
    },
    'digital-marketer': {
      title: 'Цифровой Маркетолог',
      description: 'Анализ эффективности кампаний и роста в соцсетях.',
      usageFlow: 'Отслеживайте **ROAS**. Конвертируйте **CPM в RPM**. Следите за **Вовлеченность**.'
    },
    'student-survival': {
      title: 'Выживание Студента',
      description: 'Планирование учебы и бюджета для университета.',
      usageFlow: 'Отслеживайте **Средний балл**. Узнайте нужное с **Нужная оценка**. Управляйте деньгами с **Бюджет**.'
    },
    'diy-renovator': {
      title: 'DIY Ремонт',
      description: 'Оценка материалов для домашних проектов.',
      usageFlow: 'Измерьте для **Напольное покрытие** и **Краска**. Оцените **Крыша** или **Бетон**.'
    },
    'travel-planner': {
      title: 'Планировщик Путешествий',
      description: 'Логистика и бюджет для поездки.',
      usageFlow: 'Установите **Дневной бюджет**. Используйте **Валюта**. Планируйте путь с **Цена поездки** и **Джетлаг**.'
    },
    'car-buyer': {
      title: 'Покупатель Авто',
      description: 'Анализ полной стоимости владения авто.',
      usageFlow: 'Сравните **Автокредит** и **Лизинг**. Проверьте **Цена авто**. Оцените **Цена поездки**.'
    },
    'event-planner': {
      title: 'Организатор Событий',
      description: 'Логистика для свадеб и вечеринок.',
      usageFlow: 'Начните с **Бюджет**. Планируйте еду с **Кейтеринг** и **Напитки**. Определите место с **Рассадка**.'
    },
    'content-creator': {
      title: 'Контент-Мейкер',
      description: 'Оценка дохода и технические инструменты.',
      usageFlow: 'Оцените доход с **YouTube RPM** или **TikTok доход**. Планируйте качество с **Битрейт**.'
    },
    'eco-warrior': {
      title: 'Эко-Воин',
      description: 'Инструменты для снижения воздействия на среду.',
      usageFlow: 'Проверьте **CO2 полета**. Оцените **Солнечная энергия** или экономию **Зарядка EV**.'
    },
    'gardener-guru': {
      title: 'Гуру Садоводства',
      description: 'Расчеты почвы, воды и посадки.',
      usageFlow: 'Рассчитайте **Грунт**. Определите **Удобрение**. Проверьте **Полив**.'
    },
    'teacher-aide': {
      title: 'Помощник Учителя',
      description: 'Быстрая оценка и расчеты.',
      usageFlow: 'Объедините оценки с **Агрегатор оценок**. Проверьте сложность с **Уровень чтения**. Управляйте временем с **Помодоро**.'
    }
  },
  hi: {
    'homebuyer-pack': {
      title: 'घर खरीदार पैक',
      description: 'घर खरीदने की योजना बनाने के लिए सब कुछ।',
      usageFlow: '**घर की सामर्थ्य** से शुरू करें। निर्णय लेने के लिए **किराया बनाम खरीद** का उपयोग करें। अंत में **बंधक भुगतान** की गणना करें।'
    },
    'debt-destroyer': {
      title: 'ऋण नाशक किट',
      description: 'ऋण का विश्लेषण और भुगतान की योजना बनाने के लिए उपकरण।',
      usageFlow: '**ऋण-आय अनुपात** की जाँच करें। **क्रेडिट कार्ड भुगतान** का उपयोग करें। प्रक्रिया को तेज करने के लिए **बजट** का उपयोग करें।'
    },
    'retirement-ready': {
      title: 'सेवानिवृत्ति के लिए तैयार',
      description: 'भविष्य को सुरक्षित करने के लिए दीर्घकालिक योजना उपकरण।',
      usageFlow: '**सेवानिवृत्ति** के साथ जरूरतों का अनुमान लगाएं। **पेंशन मूल्य** जोड़ें। **चक्रवृद्धि ब्याज** का उपयोग करें।'
    },
    'investor-toolkit': {
      title: 'निवेशक टूलकिट',
      description: 'संभावित रिटर्न और कर प्रभावों का विश्लेषण करें।',
      usageFlow: '**ROI** की गणना करें। मुनाफे पर कर के लिए **पूंजीगत लाभ** की जाँच करें। **कर-पश्चात रिटर्न** का उपयोग करें।'
    },
    'freelance-financer': {
      title: 'फ्रीलांस फाइनेंसर',
      description: 'परिवर्तनीय आय, कर और मूल्य निर्धारण का प्रबंधन करें।',
      usageFlow: 'लक्ष्यों के आधार पर **फ्रीलांस दर** निर्धारित करें। **स्व-रोजगार कर** का अनुमान लगाएं। **चालान देय** तिथियों की जाँच करें।'
    },
    'weight-loss-warrior': {
      title: 'वजन घटाने वाला योद्धा',
      description: 'शरीर की ऊर्जा जरूरतों को समझने के लिए डेटा-संचालित उपकरण।',
      usageFlow: '**TDEE** के साथ अपनी आधार रेखा खोजें। वजन से बेहतर मीट्रिक के लिए **शरीर की वसा** का अनुमान लगाएं। **मैक्रो विभाजन** के साथ आहार की योजना बनाएं।'
    },
    'muscle-builder': {
      title: 'मांसपेशी निर्माता पैक',
      description: 'हाइपरट्रॉफी के लिए पोषण और प्रशिक्षण तीव्रता का अनुकूलन करें।',
      usageFlow: 'न्यूनतम जानने के लिए **बीएमआर** की गणना करें। आहार के लिए **मैक्रो विभाजन** (उच्च प्रोटीन) का उपयोग करें। **रेसिपी मैक्रो** के साथ भोजन का विश्लेषण करें।'
    },
    'keto-kickstart': {
      title: 'कीटो किकस्टार्ट',
      description: 'कीटोजेनिक जीवन शैली बनाए रखने के लिए आवश्यक कैलकुलेटर।',
      usageFlow: 'अपना **कीटो मैक्रोज़** सेट करें। **जल सेवन** के साथ पर्याप्त पानी सुनिश्चित करें। **बीएमआर** के साथ अपने बेस बर्न की निगरानी करें।'
    },
    'startup-launcher': {
      title: 'स्टार्टअप लॉन्चर',
      description: 'प्रारंभिक चरण की कंपनियों की व्यवहार्यता और विकास को ट्रैक करने के लिए प्रमुख मेट्रिक्स।',
      usageFlow: '**बर्न रेट** रनवे की गणना करें। **ब्रेक-ईवन** बिंदु निर्धारित करें। सुनिश्चित करें कि **CLV** **CAC** से अधिक है।'
    },
    'ecommerce-pro': {
      title: 'ई-कॉमर्स प्रो',
      description: 'अपने ऑनलाइन स्टोर के लिए मूल्य निर्धारण, मार्जिन और इन्वेंट्री का अनुकूलन करें।',
      usageFlow: '**मार्कअप** के साथ कीमतें निर्धारित करें। अपने वास्तविक **लाभ मार्जिन** की जाँच करें। स्टॉक का प्रबंधन करने के लिए **रीऑर्डर पॉइंट** का उपयोग करें।'
    },
    'digital-marketer': {
      title: 'डिजिटल मार्केटर',
      description: 'अभियान प्रदर्शन और सोशल मीडिया विकास का विश्लेषण करें।',
      usageFlow: '**ROAS** के साथ विज्ञापन खर्च दक्षता को ट्रैक करें। **CPM से RPM** के साथ मेट्रिक्स बदलें। **सगाई दर** के साथ दर्शकों के स्वास्थ्य की निगरानी करें।'
    },
    'student-survival': {
      title: 'छात्र अस्तित्व',
      description: 'विश्वविद्यालय जीवन के लिए शैक्षणिक योजना और बजट उपकरण।',
      usageFlow: '**जीपीए कैलकुलेटर** के साथ प्रदर्शन को ट्रैक करें। **अंतिम ग्रेड आवश्यक** के साथ परीक्षा में क्या चाहिए, यह पता लगाएं। **बजट** के साथ धन का प्रबंधन करें।'
    },
    'diy-renovator': {
      title: 'DIY रेनोवेटर',
      description: 'गृह सुधार परियोजनाओं के लिए सामग्री अनुमान उपकरण।',
      usageFlow: '**फर्श** और **पेंट आवश्यकता** के लिए कमरों को मापें। **छत क्षेत्रफल** या **कंक्रीट आयतन** के साथ बाहरी काम का अनुमान लगाएं।'
    },
    'travel-planner': {
      title: 'यात्रा योजनाकार',
      description: 'आपकी अगली अंतर्राष्ट्रीय यात्रा के लिए रसद और बजट।',
      usageFlow: 'एक **दैनिक बजट** निर्धारित करें। कीमतों के लिए **मुद्रा** रूपांतरण का उपयोग करें। **यात्रा लागत** और **जेट लैग** के साथ योजना बनाएं।'
    },
    'car-buyer': {
      title: 'कार खरीदार सुइट',
      description: 'ऑटो स्वामित्व की कुल लागत का विश्लेषण करें।',
      usageFlow: '**कार ऋण** बनाम **लीज़ लागत** की तुलना करें। भविष्य के **कार मूल्य** की जाँच करें। चल रही **यात्रा लागत** (ईंधन) का अनुमान लगाएं।'
    },
    'event-planner': {
      title: 'इवेंट प्लानर',
      description: 'शादियों, पार्टियों और कॉर्पोरेट कार्यक्रमों के लिए रसद।',
      usageFlow: '**इवेंट बजट** से शुरू करें। **खानपान** और **पेय** के साथ भोजन और पेय की योजना बनाएं। **बैठने की व्यवस्था** के साथ स्थान की जरूरतों को निर्धारित करें।'
    },
    'content-creator': {
      title: 'सामग्री निर्माता',
      description: 'वीडियो/ऑडियो के लिए राजस्व अनुमान और तकनीकी उपकरण।',
      usageFlow: '**YouTube RPM** या **टिकटॉक कमाई** के साथ कमाई का अनुमान लगाएं। **बिटरेट कैलक** के साथ अपलोड गुणवत्ता की योजना बनाएं।'
    },
    'eco-warrior': {
      title: 'इको योद्धा',
      description: 'अपने पर्यावरणीय प्रभाव को मापने और कम करने के लिए उपकरण।',
      usageFlow: '**उड़ान CO2** के साथ यात्रा प्रभाव की जाँच करें। **सौर अनुमान** या **EV चार्ज** बचत के साथ गृह सुधार का अनुमान लगाएं।'
    },
    'gardener-guru': {
      title: 'माली गुरु',
      description: 'एक संपन्न बगीचे के लिए मिट्टी, पानी और रोपण गणना।',
      usageFlow: '**बगीचे की मिट्टी** की मात्रा की गणना करें। **उर्वरक** की जरूरतों को निर्धारित करें। वर्षा के आधार पर **जल आवश्यकता** की जाँच करें।'
    },
    'teacher-aide': {
      title: 'शिक्षक सहायक',
      description: 'त्वरित ग्रेडिंग और कुल गणना उपकरण।',
      usageFlow: '**ग्रेड एग्रीगेटर** के साथ स्कोर को मिलाएं। **पठन स्तर** के साथ पाठ कठिनाई की जाँच करें। **पोमोडोरो योजना** के साथ ग्रेडिंग समय का प्रबंधन करें।'
    }
  },
  ar: {
    'homebuyer-pack': {
      title: 'حزمة مشتري المنزل',
      description: 'كل ما تحتاجه لتخطيط شراء منزلك، من القدرة على تحمل التكاليف إلى الإغلاق.',
      usageFlow: 'ابدأ بـ **شراء منزل** لمعرفة ما يمكنك اقتراضه. استخدم **إيجار أم شراء** لاتخاذ القرار. أخيراً، احسب التزامك الشهري باستخدام **الرهن العقاري**.'
    },
    'debt-destroyer': {
      title: 'مجموعة تدمير الديون',
      description: 'أدوات استراتيجية لتحليل الديون وتخطيط السداد واستعادة الحرية المالية.',
      usageFlow: 'تحقق من صحتك المالية بـ **الدين للدخل**. استخدم **سداد البطاقة** لتخطيط استراتيجيتك. أعد تخصيص الأموال بـ **الميزانية** لتسريع العملية.'
    },
    'retirement-ready': {
      title: 'جاهز للتقاعد',
      description: 'أدوات تخطيط طويلة الأجل لضمان تمويل سنواتك الذهبية.',
      usageFlow: 'توقع احتياجاتك بـ **التقاعد**. أضف تفاصيل المعاش بـ **قيمة المعاش**. استخدم **فائدة مركبة** لرؤية النمو.'
    },
    'investor-toolkit': {
      title: 'أدوات المستثمر',
      description: 'تحليل العوائد المحتملة والآثار الضريبية لمحفظتك.',
      usageFlow: 'احسب **عائد الاستثمار**. تحقق من **أرباح رأس المال** لتقدير الضرائب. استخدم **عائد بعد الضريبة** لرؤية الربح الحقيقي.'
    },
    'freelance-financer': {
      title: 'مالية العمل الحر',
      description: 'إدارة الدخل المتغير والضرائب والتسعير كمحترف مستقل.',
      usageFlow: 'حدد **سعر العمل الحر** بناءً على الأهداف. قدر **ضريبة العمل الحر** للادخار. تحقق من تواريخ **استحقاق الفاتورة** لإدارة التدفق النقدي.'
    },
    'weight-loss-warrior': {
      title: 'محارب إنقاص الوزن',
      description: 'أدوات تعتمد على البيانات لفهم احتياجات جسمك من الطاقة وتكوينه.',
      usageFlow: 'اعرف أساسك بـ **TDEE**. قدر **دهون الجسم** لمقياس أفضل من الوزن. خطط لنظامك الغذائي بـ **المغذيات**.'
    },
    'muscle-builder': {
      title: 'حزمة بناء العضلات',
      description: 'تحسين التغذية وكثافة التدريب للتضخيم.',
      usageFlow: 'احسب **معدل الأيض** لمعرفة الحد الأدنى. استخدم **المغذيات** (بروتين عالي). حلل وجباتك بـ **مغذيات الوصفة**.'
    },
    'keto-kickstart': {
      title: 'بداية الكيتو',
      description: 'حاسبات أساسية للحفاظ على نمط حياة كيتوني.',
      usageFlow: 'حدد **كيتو**. تأكد من شرب كمية كافية بـ **شرب الماء**. راقب الحرق الأساسي بـ **معدل الأيض**.'
    },
    'startup-launcher': {
      title: 'مطلق الشركات الناشئة',
      description: 'مقاييس رئيسية للشركات في مراحلها الأولى لتتبع الجدوى والنمو.',
      usageFlow: 'احسب مدرج **معدل الحرق**. حدد **نقطة التعادل**. تأكد من أن **قيمة العميل** أعلى من **تكلفة العميل**.'
    },
    'ecommerce-pro': {
      title: 'محترف التجارة الإلكترونية',
      description: 'تحسين الأسعار والهوامش والمخزون لمتجرك عبر الإنترنت.',
      usageFlow: 'حدد الأسعار بـ **الربح الإضافي**. تحقق من **هامش الربح** الفعلي. استخدم **نقطة الطلب** لإدارة المخزون.'
    },
    'digital-marketer': {
      title: 'المسوق الرقمي',
      description: 'تحليل أداء الحملات ونمو وسائل التواصل الاجتماعي.',
      usageFlow: 'تتبع كفاءة الإنفاق بـ **عائد الإعلان**. حول المقاييس بـ **تحويل CPM**. راقب صحة الجمهور بـ **معدل التفاعل**.'
    },
    'student-survival': {
      title: 'بقاء الطالب',
      description: 'أدوات التخطيط الأكاديمي والميزانية للحياة الجامعية.',
      usageFlow: 'تتبع الأداء بـ **حاسبة المعدل**. اعرف ما تحتاجه في الامتحان بـ **الدرجة المطلوبة**. أدر الأموال المحدودة بـ **الميزانية**.'
    },
    'diy-renovator': {
      title: 'المجدد اليدوي',
      description: 'أدوات تقدير المواد لمشاريع تحسين المنزل.',
      usageFlow: 'قس الغرف لـ **الأرضيات** و **احتياج الطلاء**. قدر العمل الخارجي بـ **مساحة السقف** أو **حجم الخرسانة**.'
    },
    'travel-planner': {
      title: 'مخطط السفر',
      description: 'اللوجستيات والميزانية لرحلتك الدولية القادمة.',
      usageFlow: 'حدد **ميزانية يومية**. استخدم **العملة** للأسعار. خطط للقيادة بـ **تكلفة الرحلة** والتعافي بـ **إرهاق السفر**.'
    },
    'car-buyer': {
      title: 'جناح مشتري السيارات',
      description: 'تحليل التكلفة الإجمالية لملكية السيارة.',
      usageFlow: 'قارن **قرض السيارة** مقابل **تكلفة الإيجار**. تحقق من **قيمة السيارة** المستقبلية. قدر **تكلفة الرحلة** المستمرة.'
    },
    'event-planner': {
      title: 'مخطط الفعاليات',
      description: 'اللوجستيات لحفلات الزفاف والحفلات والفعاليات الشركات.',
      usageFlow: 'ابدأ بـ **ميزانية الحفل**. خطط للطعام والشراب بـ **تموين** و **مشروبات**. حدد احتياجات المساحة بـ **مقاعد**.'
    },
    'content-creator': {
      title: 'صانع المحتوى',
      description: 'تقدير الإيرادات والأدوات الفنية للفيديو/الصوت.',
      usageFlow: 'قدر الأرباح بـ **أرباح يوتيوب** أو **أرباح تيك توك**. خطط لجودة التحميل بـ **معدل البت**.'
    },
    'eco-warrior': {
      title: 'المحارب البيئي',
      description: 'أدوات لقياس وتقليل تأثيرك البيئي.',
      usageFlow: 'تحقق من تأثير السفر بـ **انبعاثات الطيران**. قدر تحسين المنزل بـ **الطاقة الشمسية** أو توفير **شحن السيارة**.'
    },
    'gardener-guru': {
      title: 'خبير البستنة',
      description: 'حسابات التربة والماء والزراعة لحديقة مزدهرة.',
      usageFlow: 'احسب حجم **تربة الحديقة**. حدد احتياجات **سماد**. تحقق من **احتياج الماء** بناءً على هطول الأمطار.'
    },
    'teacher-aide': {
      title: 'مساعد المعلم',
      description: 'أدوات الدرجات السريعة والحسابات الإجمالية.',
      usageFlow: 'اجمع الدرجات بـ **جامع الدرجات**. تحقق من صعوبة النص بـ **مستوى القراءة**. أدر وقت التصحيح بـ **مخطط بومودورو**.'
    }
  }
};

export const getBundleTranslation = (id: string, language: Language): BundleContent | null => {
  const langData = BUNDLE_TRANSLATIONS[language];
  if (!langData) return BUNDLE_TRANSLATIONS['en'][id] || null;
  return langData[id] || BUNDLE_TRANSLATIONS['en'][id] || null;
};
