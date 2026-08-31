export interface MealPlan {
  id: string;
  title: string;
  category: 'Vegetarian' | 'Non-Veg' | 'Vegan' | 'Gluten-Free' | string;
  price: number;
  image: string;
  items: string[];
  status: 'Available' | 'Sold Out' | 'Limited';
  popularity: number;
  description?: string;
  apiData?: any;
}

export const MEAL_PLANS: MealPlan[] = [
  {
    id: 'classic-sri-lankan',
    title: 'Classic Sri Lankan',
    category: 'Non-Veg',
    price: 850,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    items: ['String Hoppers', 'Potato Curry', 'Pol Sambol', 'Dhal'],
    status: 'Available',
    popularity: 98,
    description: 'Traditional Sri Lankan breakfast favourite served with freshly made string hoppers, spicy potato curry, toasted coconut pol sambol and tempered dhal.'
  },
  {
    id: 'gluten-free-plan',
    title: 'Gluten-Free Plan',
    category: 'Gluten-Free',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    items: ['Red Rice', 'Chicken Curry', 'Dhal', 'Gotukola Sambol', 'Papadam'],
    status: 'Available',
    popularity: 94,
    description: 'Nutritious gluten-free Sri Lankan red rice accompanied by aromatic black chicken curry, lentils, gotukola sambol and crisp papadam.'
  },
  {
    id: 'wannaku-plan',
    title: 'Wannaku Plan',
    category: 'Non-Veg',
    price: 1400,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    items: ['Roast Paan', 'Fish Ambul Thiyal', 'Dhal', 'Seeni Sambol'],
    status: 'Available',
    popularity: 96,
    description: 'Authentic Colombo-style meal featuring crispy roast paan bread, sour and spicy fish ambul thiyal, rich dhal curry and caramelized onion seeni sambol.'
  },
  {
    id: 'ceylon-veg-plan',
    title: 'Ceylon Veg Plan',
    category: 'Vegetarian',
    price: 950,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    items: ['White Rice', 'Polos Curry', 'Beetroot', 'Dhal', 'Mallum'],
    status: 'Available',
    popularity: 90,
    description: 'Wholesome Sri Lankan vegetarian feast with tender jackfruit polos curry, tempered beetroot, spiced yellow dhal and fresh coconut green mallum.'
  },
  {
    id: 'protein-feast',
    title: 'Protein Feast',
    category: 'Non-Veg',
    price: 1300,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    items: ['Chopped Roti', 'Chicken', 'Vegetables', 'Egg', 'Spices'],
    status: 'Available',
    popularity: 97,
    description: 'Sizzling Sri Lankan Kottu Roti packed with high-protein grilled chicken chunks, farm eggs, fresh garden vegetables and authentic spice blend.'
  },
  {
    id: 'nallur-vegan',
    title: 'Nallur Vegan',
    category: 'Vegan',
    price: 900,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    items: ['Plain Hoppers', 'Egg Hopper', 'Lunu Miris', 'Seeni Sambol'],
    status: 'Available',
    popularity: 91,
    description: 'Jaffna special vegan delight featuring bowl-shaped crispy hoppers served with spicy onion lunu miris and sweet caramelized onion seeni sambol.'
  }
];
