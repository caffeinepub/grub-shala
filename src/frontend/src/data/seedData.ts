import type { Category, MenuItem } from "../backend.d";

let _nextId = 1n;
const nextId = () => _nextId++;

export const SEED_CATEGORIES: Category[] = [
  { id: nextId(), name: "Burgers", sortOrder: 1n },
  { id: nextId(), name: "Drinks", sortOrder: 2n },
  { id: nextId(), name: "Sides", sortOrder: 3n },
  { id: nextId(), name: "Desserts", sortOrder: 4n },
  { id: nextId(), name: "Specials", sortOrder: 5n },
];

export const CATEGORY_EMOJIS: Record<string, string> = {
  Burgers: "🍔",
  Drinks: "🥤",
  Sides: "🍟",
  Desserts: "🍦",
  Specials: "⭐",
};

const [burgers, drinks, sides, desserts, specials] = SEED_CATEGORIES;

export const SEED_MENU_ITEMS: MenuItem[] = [
  // Burgers
  {
    id: nextId(),
    categoryId: burgers.id,
    name: "Classic Smash Burger",
    description: "Double beef patty, cheddar, pickles, special sauce",
    priceCents: 19900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: burgers.id,
    name: "BBQ Bacon Stack",
    description: "Triple patty, crispy bacon, BBQ sauce, onion rings",
    priceCents: 24900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: burgers.id,
    name: "Spicy Jalapeño Crunch",
    description: "Beef patty, jalapeños, pepper jack, sriracha mayo",
    priceCents: 21900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: burgers.id,
    name: "Mushroom Swiss Melt",
    description: "Sautéed mushrooms, Swiss cheese, garlic aioli",
    priceCents: 22900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: burgers.id,
    name: "Crispy Chicken Deluxe",
    description: "Fried chicken breast, coleslaw, honey mustard",
    priceCents: 20900n,
    available: true,
  },

  // Drinks
  {
    id: nextId(),
    categoryId: drinks.id,
    name: "Fresh Lemonade",
    description: "Hand-squeezed with mint and ice",
    priceCents: 8000n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: drinks.id,
    name: "Craft Root Beer Float",
    description: "House-made root beer with vanilla ice cream",
    priceCents: 12000n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: drinks.id,
    name: "Mango Passion Shake",
    description: "Real mango, passion fruit, condensed milk",
    priceCents: 14900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: drinks.id,
    name: "Iced Matcha Latte",
    description: "Premium matcha, oat milk, honey",
    priceCents: 10900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: drinks.id,
    name: "Sparkling Water",
    description: "San Pellegrino 500ml",
    priceCents: 6000n,
    available: true,
  },

  // Sides
  {
    id: nextId(),
    categoryId: sides.id,
    name: "Crispy Waffle Fries",
    description: "Seasoned waffle-cut fries with dipping sauce",
    priceCents: 9900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: sides.id,
    name: "Loaded Cheese Fries",
    description: "Fries topped with nacho cheese & jalapeños",
    priceCents: 13900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: sides.id,
    name: "Onion Ring Tower",
    description: "Beer-battered rings with chipotle dip",
    priceCents: 11900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: sides.id,
    name: "Garden Side Salad",
    description: "Mixed greens, cherry tomatoes, house vinaigrette",
    priceCents: 10900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: sides.id,
    name: "Mac & Cheese Bites",
    description: "Crispy fried mac and cheese bites, 6 pcs",
    priceCents: 12900n,
    available: true,
  },

  // Desserts
  {
    id: nextId(),
    categoryId: desserts.id,
    name: "Warm Cookie Sundae",
    description: "Chocolate chip cookie, vanilla gelato, caramel",
    priceCents: 16900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: desserts.id,
    name: "New York Cheesecake",
    description: "Classic creamy cheesecake, berry compote",
    priceCents: 15900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: desserts.id,
    name: "Churro Bites",
    description: "Cinnamon sugar churros with chocolate sauce",
    priceCents: 13900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: desserts.id,
    name: "Banana Foster Waffle",
    description: "Belgian waffle, caramelized banana, toffee sauce",
    priceCents: 17900n,
    available: true,
  },

  // Specials
  {
    id: nextId(),
    categoryId: specials.id,
    name: "The Big Boss Combo",
    description: "Double smash + waffle fries + large shake",
    priceCents: 39900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: specials.id,
    name: "Family Feast Box",
    description: "4 burgers, 4 sides, 4 drinks — feeds the crew",
    priceCents: 99900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: specials.id,
    name: "Weekend Brunch Stack",
    description: "Pancake burger, egg, hollandaise, seasonal juice",
    priceCents: 32900n,
    available: true,
  },
  {
    id: nextId(),
    categoryId: specials.id,
    name: "Veggie Power Bowl",
    description: "Grilled veggies, hummus, falafel, pita chips",
    priceCents: 24900n,
    available: true,
  },
];

export const ITEM_EMOJIS: Record<string, string> = {
  "Classic Smash Burger": "🍔",
  "BBQ Bacon Stack": "🥓",
  "Spicy Jalapeño Crunch": "🌶️",
  "Mushroom Swiss Melt": "🍄",
  "Crispy Chicken Deluxe": "🍗",
  "Fresh Lemonade": "🍋",
  "Craft Root Beer Float": "🍺",
  "Mango Passion Shake": "🥭",
  "Iced Matcha Latte": "🍵",
  "Sparkling Water": "💧",
  "Crispy Waffle Fries": "🍟",
  "Loaded Cheese Fries": "🧀",
  "Onion Ring Tower": "🧅",
  "Garden Side Salad": "🥗",
  "Mac & Cheese Bites": "🧆",
  "Warm Cookie Sundae": "🍪",
  "New York Cheesecake": "🍰",
  "Churro Bites": "🥐",
  "Banana Foster Waffle": "🧇",
  "The Big Boss Combo": "👑",
  "Family Feast Box": "📦",
  "Weekend Brunch Stack": "🌅",
  "Veggie Power Bowl": "🥙",
};

export const ITEM_GRADIENTS: Record<string, string> = {
  Burgers: "from-amber-900/60 to-orange-900/40",
  Drinks: "from-blue-900/60 to-cyan-900/40",
  Sides: "from-yellow-900/60 to-amber-900/40",
  Desserts: "from-pink-900/60 to-purple-900/40",
  Specials: "from-emerald-900/60 to-teal-900/40",
};

export function formatPrice(priceCents: bigint): string {
  return `\u20B9${(Number(priceCents) / 100).toFixed(0)}`;
}
