export interface MenuItem {
    id: string;
    title: string;
    description: string;
    price: number;
    category: 'entrantes' | 'principales' | 'postres' | 'bebidas' | 'vinos' | 'semana-atun';
    image: string;
    allergens: string[];
    pairing?: string;

    // Traducciones automáticas
    translations?: {
        en?: { title: string; description: string };
        fr?: { title: string; description: string };
        de?: { title: string; description: string };
    };
}

export const CATEGORIES = [
    { id: 'el-trebol', title: 'El Trébol' },
    { id: 'entrantes', title: 'Entrantes' },
    { id: 'principales', title: 'Principales' },
    { id: 'postres', title: 'Postres' },
    { id: 'vinos', title: 'Vinos' },
    { id: 'bebidas', title: 'Bebidas' },
];

export const MENU_ITEMS: MenuItem[] = [
    // --- ENTRANTES (5) ---
    {
        id: 'e1',
        title: 'Croquetas de Jamón Ibérico',
        description: 'Cremosas croquetas caseras elaboradas con bechamel suave y virutas de jamón ibérico de bellota 100%.',
        price: 12.50,
        category: 'entrantes',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop',
        allergens: ['Gluten', 'Lácteos', 'Huevos'],
        pairing: 'v4',
    },
    {
        id: 'e2',
        title: 'Ensalada de Burrata y Pesto',
        description: 'Burrata fresca D.O.P. servida sobre una cama de rúcula, tomates cherry confitados y nuestro pesto genovés casero.',
        price: 14.50,
        category: 'entrantes',
        image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=800&auto=format&fit=crop',
        allergens: ['Lácteos', 'Frutos secos'],
    },
    {
        id: 'e3',
        title: 'Pulpo a la Brasa',
        description: 'Pata de pulpo cocida a baja temperatura y terminada a la brasa, acompañada de puré de patata trufado y pimentón de la Vera.',
        price: 18.00,
        category: 'entrantes',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop',
        allergens: ['Moluscos', 'Lácteos'],
        pairing: 'v2',
    },
    {
        id: 'e4',
        title: 'Tartar de Atún Rojo',
        description: 'Dados de atún rojo fresco marinados en soja y jengibre, con aguacate, sésamo tostado y un toque de wasabi.',
        price: 16.50,
        category: 'entrantes',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
        allergens: ['Pescado', 'Soja', 'Sésamo'],
    },
    {
        id: 'e5',
        title: 'Tabla de Quesos Artesanos',
        description: 'Selección de 5 quesos nacionales e internacionales, acompañados de mermelada de higos, nueces y uvas.',
        price: 15.00,
        category: 'entrantes',
        image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=800&auto=format&fit=crop',
        allergens: ['Lácteos', 'Frutos secos', 'Gluten'],
        pairing: 'v1',
    },

    // --- PRINCIPALES (5) ---
    {
        id: 'p1',
        title: 'Solomillo al Foie',
        description: 'Tierno solomillo de ternera gallega a la parrilla, coronado con escalope de foie fresco y reducción de Pedro Ximénez.',
        price: 26.00,
        category: 'principales',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop',
        allergens: ['Lácteos', 'Sulfitos'],
        pairing: 'v3',
    },
    {
        id: 'p2',
        title: 'Salmón Noruego al Eneldo',
        description: 'Lomo de salmón premium a la plancha, servido con espárragos trigueros, patatas baby y una suave salsa de eneldo y limón.',
        price: 21.50,
        category: 'principales',
        image: 'https://images.unsplash.com/photo-1611250188496-e966043a0629?w=800&q=80',
        allergens: ['Pescado', 'Lácteos'],
        pairing: 'v2',
    },
    {
        id: 'p3',
        title: 'Risotto de Setas y Trufa',
        description: 'Arroz Carnaroli cremoso cocinado con boletus edulis, champiñones silvestres y terminado con aceite de trufa negra y parmesano.',
        price: 18.50,
        category: 'principales',
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop',
        allergens: ['Lácteos', 'Sulfitos'],
        pairing: 'v1',
    },
    {
        id: 'p4',
        title: 'Hamburguesa Gourmet "El Trébol"',
        description: '200g de carne de vaca madurada, queso cheddar fundido, cebolla caramelizada, bacon crujiente y nuestra salsa secreta en pan brioche.',
        price: 16.00,
        category: 'principales',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
        allergens: ['Gluten', 'Lácteos', 'Huevos', 'Mostaza'],
        pairing: 'b3',
    },
    {
        id: 'p5',
        title: 'Carrillada Ibérica Estofada',
        description: 'Carrilleras de cerdo ibérico cocinadas a fuego lento en vino tinto durante 4 horas, acompañadas de puré de boniato.',
        price: 19.00,
        category: 'principales',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop',
        allergens: ['Sulfitos', 'Lácteos'],
        pairing: 'v3',
    },

    // --- POSTRES (5) ---
    {
        id: 'po1',
        title: 'Tarta de Queso al Horno',
        description: 'Nuestra versión de la tarta de queso vasca, cremosa por dentro y tostada por fuera, servida con coulis de frutos rojos.',
        price: 7.50,
        category: 'postres',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop',
        allergens: ['Lácteos', 'Huevos', 'Gluten'],
    },
    {
        id: 'po2',
        title: 'Coulant de Chocolate',
        description: 'Volcán de chocolate negro 70% con interior fundido, acompañado de una bola de helado de vainilla de Madagascar.',
        price: 8.00,
        category: 'postres',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
        allergens: ['Gluten', 'Huevos', 'Lácteos', 'Soja'],
    },
    {
        id: 'po3',
        title: 'Tiramisú Clásico',
        description: 'El auténtico postre italiano con bizcochos savoiardi empapados en café espresso, crema de mascarpone y cacao puro.',
        price: 7.00,
        category: 'postres',
        image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=800&auto=format&fit=crop',
        allergens: ['Gluten', 'Huevos', 'Lácteos'],
    },
    {
        id: 'po4',
        title: 'Sorbete de Limón al Cava',
        description: 'Refrescante sorbete de limón batido con cava brut nature y un toque de hierbabuena fresca.',
        price: 6.50,
        category: 'postres',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
        allergens: ['Sulfitos'],
    },
    {
        id: 'po5',
        title: 'Brownie con Nueces',
        description: 'Denso y húmedo brownie de chocolate con nueces, servido caliente con nata montada y sirope de chocolate.',
        price: 7.50,
        category: 'postres',
        image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=800&auto=format&fit=crop',
        allergens: ['Gluten', 'Huevos', 'Lácteos', 'Frutos secos'],
    },

    // --- BEBIDAS (5) ---
    {
        id: 'b1',
        title: 'Agua Mineral Premium',
        description: 'Botella de agua mineral natural de manantial (500ml).',
        price: 2.50,
        category: 'bebidas',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop',
        allergens: [],
    },
    {
        id: 'b2',
        title: 'Refrescos Variados',
        description: 'Coca-Cola, Fanta, Sprite o Tónica (330ml).',
        price: 3.00,
        category: 'bebidas',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
        allergens: [],
    },
    {
        id: 'b3',
        title: 'Cerveza Artesana IPA',
        description: 'Cerveza artesanal estilo India Pale Ale, con notas cítricas y amargor equilibrado.',
        price: 4.50,
        category: 'bebidas',
        image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?q=80&w=800&auto=format&fit=crop',
        allergens: ['Gluten'],
    },
    {
        id: 'b4',
        title: 'Limonada Casera',
        description: 'Preparada al momento con limones frescos, azúcar de caña, hierbabuena y un toque de jengibre.',
        price: 4.00,
        category: 'bebidas',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
        allergens: [],
    },
    {
        id: 'b5',
        title: 'Café Espresso',
        description: 'Café de especialidad 100% Arábica, tueste natural.',
        price: 2.00,
        category: 'bebidas',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
        allergens: [],
    },

    // --- VINOS (5) ---
    {
        id: 'v1',
        title: 'Marqués de Riscal Reserva',
        description: 'D.O. Rioja. Vino tinto intenso con aromas a frutos negros y especias. Crianza de 24 meses en barrica.',
        price: 28.00,
        category: 'vinos',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
        allergens: ['Sulfitos'],
    },
    {
        id: 'v2',
        title: 'Albariño Martín Códax',
        description: 'D.O. Rías Baixas. Vino blanco 100% Albariño, fresco y elegante, con notas cítricas y florales.',
        price: 24.00,
        category: 'vinos',
        image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?q=80&w=800&auto=format&fit=crop',
        allergens: ['Sulfitos'],
    },
    {
        id: 'v3',
        title: 'Ribera del Duero Pago de Carraovejas',
        description: 'D.O. Ribera del Duero. Tinto fino, cabernet sauvignon y merlot. Potente, estructurado y muy sabroso.',
        price: 45.00,
        category: 'vinos',
        image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop',
        allergens: ['Sulfitos'],
    },
    {
        id: 'v4',
        title: 'Cava Juvé & Camps Reserva de la Familia',
        description: 'D.O. Cava. Brut Nature Gran Reserva. Burbuja fina y persistente, con notas de fruta blanca y pan tostado.',
        price: 32.00,
        category: 'vinos',
        image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?q=80&w=800&auto=format&fit=crop',
        allergens: ['Sulfitos'],
    },
    {
        id: 'v5',
        title: 'Moët & Chandon Brut Imperial',
        description: 'Champagne francés. Vibrante, generoso y seductor. Notas de manzana verde, cítricos y flores blancas.',
        price: 65.00,
        category: 'vinos',
        image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?q=80&w=800&auto=format&fit=crop',
        allergens: ['Sulfitos'],
    },


    // --- VINOS ADICIONALES ---
    {
        id: 'v6',
        title: 'Ramón Bilbao Crianza',
        description: 'D.O. Rioja. Tempranillo. Un clásico renovado, frutal y equilibrado, con notas de madera noble.',
        price: 18.00,
        category: 'vinos',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
        allergens: ['Sulfitos'],
    },
    {
        id: 'v7',
        title: 'José Pariente Verdejo',
        description: 'D.O. Rueda. Verdejo intenso y aromático, con notas de hinojo, fruta blanca y un toque anisado.',
        price: 22.00,
        category: 'vinos',
        image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=800&q=80',
        allergens: ['Sulfitos'],
    },
    {
        id: 'v8',
        title: 'Protos Roble',
        description: 'D.O. Ribera del Duero. Tinto joven con 6 meses de barrica. Frutal, fresco y con taninos dulces.',
        price: 19.50,
        category: 'vinos',
        image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
        allergens: ['Sulfitos'],
    },

    // --- SEMANA DEL ATÚN (5) ---
    {
        id: 'sa1',
        title: 'Tataki de Atún Rojo',
        description: 'Lomo de atún rojo marcado a la plancha con costra de sésamo, servido con salsa ponzu y wakame.',
        price: 22.00,
        category: 'semana-atun',
        image: 'https://images.unsplash.com/photo-1611250188496-e966043a0629?w=800&q=80',
        allergens: ['Pescado', 'Sésamo', 'Soja'],
    },
    {
        id: 'sa2',
        title: 'Ventresca de Atún a la Parrilla',
        description: 'La parte más jugosa del atún cocinada a la brasa, acompañada de pimientos del piquillo confitados.',
        price: 24.50,
        category: 'semana-atun',
        image: 'https://images.unsplash.com/photo-1611250188496-e966043a0629?w=800&q=80',
        allergens: ['Pescado'],
    },
    {
        id: 'sa3',
        title: 'Marmitako de Atún Tradicional',
        description: 'Guiso marinero vasco con atún fresco, patatas, pimiento choricero y un fumet de pescado de roca.',
        price: 18.50,
        category: 'semana-atun',
        image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&q=80',
        allergens: ['Pescado', 'Sulfitos'],
    },
    {
        id: 'sa4',
        title: 'Sashimi de Atún & Wakame',
        description: 'Cortes finos de atún rojo de almadraba, servidos sobre hielo con ensalada de algas wakame y jengibre.',
        price: 26.00,
        category: 'semana-atun',
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
        allergens: ['Pescado', 'Soja'],
    },
    {
        id: 'sa5',
        title: 'Hamburguesa de Atún Fresco',
        description: 'Hamburguesa 100% atún con mayonesa de wasabi, rúcula y tomate en pan brioche tostado.',
        price: 19.50,
        category: 'semana-atun',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
        allergens: ['Pescado', 'Gluten', 'Huevo', 'Mostaza'],
    },
];
