'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/store/useStore';
import {
    Star,
    CheckCircle2,
    ShoppingBag,
    ArrowLeft,
    Minus,
    Plus,
    Utensils,
    Leaf,
    Sparkles,
    Truck,
} from 'lucide-react';

interface DailyMeal {
    type: 'Breakfast' | 'Lunch' | 'Dinner';
    title: string;
    description: string;
    price: string;
    image: string;
}

interface DayPlan {
    day: string;
    meals: DailyMeal[];
}

const WEEKLY_PLAN_DATA: DayPlan[] = [
    {
        day: 'Monday',
        meals: [
            {
                type: 'Breakfast',
                title: 'String Hoppers & Coconut Sambol',
                description: 'Steamed string hoppers served with spicy pol sambol and coconut gravy.',
                price: 'Rs. 1,150',
                image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Lunch',
                title: 'Chicken & Red Rice Curry',
                description: 'Chicken curry served with organic red rice, dhal, and jackfruit curry.',
                price: 'Rs. 1,350',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Dinner',
                title: 'Vegetable Kottu',
                description: 'Chopped flatbread wok-tossed with fresh garden vegetables & Sri Lankan spices.',
                price: 'Rs. 1,050',
                image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
            },
        ],
    },
    {
        day: 'Tuesday',
        meals: [
            {
                type: 'Breakfast',
                title: 'Hoppers & Dhal Curry',
                description: 'Crispy edge hoppers served with creamy tempered dhal curry.',
                price: 'Rs. 1,100',
                image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Lunch',
                title: 'Fish Rice & Curry',
                description: 'Spicy fish curry served with white rice, beetroot, and winged bean sambol.',
                price: 'Rs. 1,350',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Dinner',
                title: 'Chicken Kothu',
                description: 'Shredded roti tossed with spicy chicken, eggs, and aromatic leeks.',
                price: 'Rs. 1,200',
                image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
            },
        ],
    },
    {
        day: 'Wednesday',
        meals: [
            {
                type: 'Breakfast',
                title: 'Pittu & Coconut Sambol',
                description: 'Steamed rice flour and coconut cylinders served with spiced sambol.',
                price: 'Rs. 1,050',
                image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Lunch',
                title: 'Chicken Fried Rice',
                description: 'Wok-fried rice with seasoned chicken chunks, carrots, and scallions.',
                price: 'Rs. 1,350',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Dinner',
                title: 'Dhal Curry & Rice',
                description: 'Comforting yellow lentil curry served with hot basmati rice & papadam.',
                price: 'Rs. 1,000',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
            },
        ],
    },
    {
        day: 'Thursday',
        meals: [
            {
                type: 'Breakfast',
                title: 'Kiribath & Lunu Miris',
                description: 'Traditional milk rice squares served with spicy onion-chilli paste.',
                price: 'Rs. 1,150',
                image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Lunch',
                title: 'Devilled Chicken Rice',
                description: 'Sweet and spicy stir-fried chicken with capsicum, onion, and yellow rice.',
                price: 'Rs. 1,350',
                image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Dinner',
                title: 'String Hoppers & Chicken Curry',
                description: 'Light string hoppers served with rich chicken gravy and coconut sambol.',
                price: 'Rs. 1,250',
                image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
            },
        ],
    },
    {
        day: 'Friday',
        meals: [
            {
                type: 'Breakfast',
                title: 'Roti & Dhal Curry',
                description: 'Warm coconut roti served with spicy lentil curry and coconut sambol.',
                price: 'Rs. 1,100',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Lunch',
                title: 'Fish Yellow Rice',
                description: 'Aromatic turmeric yellow rice with tuna fish curry and vegetable side.',
                price: 'Rs. 1,350',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Dinner',
                title: 'Vegetable Fried Rice',
                description: 'Light & flavorful wok-fried rice loaded with garden vegetables.',
                price: 'Rs. 1,050',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
            },
        ],
    },
    {
        day: 'Saturday',
        meals: [
            {
                type: 'Breakfast',
                title: 'Egg Hoppers & Sambol',
                description: 'Crispy hopper bowl with a soft cooked egg center, served with lunu miris.',
                price: 'Rs. 1,200',
                image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Lunch',
                title: 'Chicken Biryani',
                description: 'Fragrant basmati rice cooked with spiced chicken, boiled egg & raita.',
                price: 'Rs. 1,450',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Dinner',
                title: 'Cheese Kothu',
                description: 'Savory shredded roti cooked with tender chicken, melted cheese & veggies.',
                price: 'Rs. 1,300',
                image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
            },
        ],
    },
    {
        day: 'Sunday',
        meals: [
            {
                type: 'Breakfast',
                title: 'Paratha & Chicken Curry',
                description: 'Flaky layered paratha flatbread served with rich Sri Lankan chicken curry.',
                price: 'Rs. 1,200',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Lunch',
                title: 'Sri Lankan Special Rice & Curry',
                description: 'Sunday special rice spread with chicken, devilled potato, cashew & brinjal.',
                price: 'Rs. 1,500',
                image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
            },
            {
                type: 'Dinner',
                title: 'Chicken Noodles',
                description: 'Sri Lankan style wok-tossed noodles with chicken, vegetables & fried chilli.',
                price: 'Rs. 1,250',
                image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
            },
        ],
    },
];

export default function MealDetailsPage() {
    const [quantity, setQuantity] = useState<number>(1);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [mounted, setMounted] = useState<boolean>(false);

    const { cart, addToCart } = useStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAddToCart = () => {
        const itemToAdd = {
            id: 'healthy-sri-lankan-weekly-plan',
            title: 'Healthy Sri Lankan Weekly Meal Plan',
            category: 'Weekly Subscription',
            price: 8500,
            image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        };

        for (let i = 0; i < quantity; i++) {
            addToCart(itemToAdd);
        }

        setToastMessage(`Added ${quantity} × Healthy Sri Lankan Weekly Meal Plan to cart!`);
        setTimeout(() => {
            setToastMessage(null);
        }, 3500);
    };

    return (
        <div className="min-h-screen bg-[#F7F5F0] text-stone-900 flex flex-col font-sans selection:bg-[#0D5C53] selection:text-white">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#0D5C53] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium border border-teal-600/40 animate-slide-up">
                    <ShoppingBag className="w-4 h-4 text-teal-200" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header Navigation */}
            <Header
                cartCount={mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0}
                activeTab="Meals"
            />

            {/* Page Body */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Back Link Breadcrumb */}
                <div className="mb-6">
                    <Link
                        href="/meal-plans"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-[#0D5C53] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Meal Plans
                    </Link>
                </div>

                {/* Hero Card */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-stone-200/80 shadow-sm mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                        {/* Left: Meal Spread Hero Image */}
                        <div className="lg:col-span-6 relative">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md group">
                                <img
                                    src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80"
                                    alt="Healthy Sri Lankan Weekly Meal Plan Spread"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Rating Badge Overlay */}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span className="text-xs font-bold text-stone-900">4.9 (128)</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Plan Details & Subscription Form */}
                        <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
                            <div>
                                <h1 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
                                    Healthy Sri Lankan Weekly Meal Plan
                                </h1>

                                <div className="flex items-center gap-4 mt-3 text-xs font-medium text-stone-600">
                                    <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span>4.9</span>
                                        <span className="text-stone-400">(128 reviews)</span>
                                    </div>
                                    <span className="text-stone-300">•</span>
                                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>Available</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-stone-600 text-sm leading-relaxed">
                                An authentic Sri Lankan 7-day meal plan featuring 21 nutritious, chef-crafted meals made from fresh local ingredients delivered hot to your doorstep.
                            </p>

                            {/* Feature Badges (2x2 Grid) */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="bg-[#F4F7F6] border border-stone-200/60 rounded-xl p-3 flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-teal-100/70 text-[#0D5C53] flex items-center justify-center shrink-0">
                                        <Utensils className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-stone-800">21 Meals</span>
                                </div>

                                <div className="bg-[#F4F7F6] border border-stone-200/60 rounded-xl p-3 flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                                        <Leaf className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-stone-800">Fresh Local Ingredients</span>
                                </div>

                                <div className="bg-[#F4F7F6] border border-stone-200/60 rounded-xl p-3 flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-stone-800">Freshly Prepared</span>
                                </div>

                                <div className="bg-[#F4F7F6] border border-stone-200/60 rounded-xl p-3 flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-800 flex items-center justify-center shrink-0">
                                        <Truck className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-stone-800">Weekly Delivery</span>
                                </div>
                            </div>

                            {/* Pricing & Add to Cart Row */}
                            <div className="pt-4 border-t border-stone-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
                                        Weekly total price
                                    </span>
                                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0D5C53] mt-0.5">
                                        Rs. 8,500
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    {/* Quantity Stepper */}
                                    <div className="flex items-center border border-stone-300 rounded-full bg-stone-50 px-2 py-1">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold text-stone-900">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Add To Cart CTA Button */}
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 sm:flex-initial bg-[#0D5C53] hover:bg-[#09433D] text-white text-xs font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>Add To Cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7-Day Meal Schedule Header */}
                <section className="mb-8">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                        Your 7-Day Meal Plan
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">
                        Explore 21 delicious meals included in your weekly plan.
                    </p>
                </section>

                {/* 7-Day Meals List */}
                <div className="space-y-10">
                    {WEEKLY_PLAN_DATA.map((dayPlan) => (
                        <div key={dayPlan.day} className="space-y-4">
                            {/* Day Header Row */}
                            <div className="flex items-center justify-between pb-2 border-b border-stone-200/70">
                                <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#0D5C53]" />
                                    {dayPlan.day}
                                </h3>
                                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                                    3 Meals
                                </span>
                            </div>

                            {/* 3 Meals Card Grid (Breakfast, Lunch, Dinner) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {dayPlan.meals.map((meal, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
                                    >
                                        {/* Meal Image */}
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                                            <img
                                                src={meal.image}
                                                alt={meal.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Meal Category Badge (Top Left) */}
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-stone-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                                                {meal.type}
                                            </div>
                                        </div>

                                        {/* Meal Details Body */}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-stone-900 text-base mb-1.5 leading-snug group-hover:text-[#0D5C53] transition-colors">
                                                    {meal.title}
                                                </h4>
                                                <p className="text-xs text-stone-500 leading-relaxed mb-4 line-clamp-2">
                                                    {meal.description}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                                                <span className="text-xs font-bold text-[#0D5C53]">
                                                    {meal.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Weekly Summary Card */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm my-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                                Weekly Plan Summary
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-500 mt-1">
                                7 Days per Week • 21 Total Meals Included
                            </p>

                            {/* Stat Boxes */}
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <div className="bg-[#F4F7F6] px-4 py-2 rounded-xl text-xs font-medium text-stone-700">
                                    <span className="text-stone-400 block text-[10px]">Total Meals</span>
                                    <span className="font-bold text-stone-900">21</span>
                                </div>
                                <div className="bg-[#F4F7F6] px-4 py-2 rounded-xl text-xs font-medium text-stone-700">
                                    <span className="text-stone-400 block text-[10px]">Days / Wk</span>
                                    <span className="font-bold text-stone-900">7</span>
                                </div>
                                <div className="bg-[#F4F7F6] px-4 py-2 rounded-xl text-xs font-medium text-stone-700">
                                    <span className="text-stone-400 block text-[10px]">Delivery</span>
                                    <span className="font-bold text-stone-900">Free</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs font-medium text-stone-500">Price:</span>
                                <span className="text-2xl sm:text-3xl font-extrabold text-[#0D5C53]">
                                    Rs. 8,500
                                </span>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="flex items-center border border-stone-300 rounded-full bg-stone-50 px-2 py-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold text-stone-900">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="bg-[#0D5C53] hover:bg-[#09433D] text-white text-xs font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Add To Cart</span>
                                </button>
                            </div>

                            <p className="text-[10px] text-stone-400 max-w-xs text-left md:text-right">
                                Cancel or pause your subscription anytime from account settings.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
