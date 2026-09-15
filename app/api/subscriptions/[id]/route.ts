import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const subId = Number(id);

    const updated = {
      subscription_id: subId,
      ...body,
    };

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    return NextResponse.json({ message: `Subscription ${id} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to delete subscription' },
      { status: 500 }
    );
  }
}
