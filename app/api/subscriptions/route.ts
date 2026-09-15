import { NextRequest, NextResponse } from 'next/server';

// Server-side in-memory cache for development / Next.js server runtime
let subscriptionsStore: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(subscriptionsStore);
    }

    const filtered = subscriptionsStore.filter(
      (sub) => String(sub.customer_id) === String(customerId)
    );

    return NextResponse.json(filtered);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newSubscription = {
      subscription_id: body.subscription_id || Date.now(),
      customer_id: Number(body.customer_id),
      meal_id: Number(body.meal_id),
      subscribe_date: body.subscribe_date || new Date().toISOString(),
      canceled_date: null,
      delivery_preferred_date: body.delivery_preferred_date,
      status: body.status || 'ACTIVE',
      delivery_time_slot: body.delivery_time_slot || 'lunch',
      frequency: body.frequency || 'weekly',
      delivery_days: body.delivery_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      special_instructions: body.special_instructions || '',
      meal_plan: body.meal_plan,
    };

    // Upsert into store
    const existingIndex = subscriptionsStore.findIndex(
      (s) => s.subscription_id === newSubscription.subscription_id
    );
    if (existingIndex > -1) {
      subscriptionsStore[existingIndex] = newSubscription;
    } else {
      subscriptionsStore.push(newSubscription);
    }

    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
