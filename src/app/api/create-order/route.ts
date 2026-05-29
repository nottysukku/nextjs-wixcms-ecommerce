import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, currency, receipt } = body;

    // Validate request body
    if (amount === undefined || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency' },
        { status: 400 }
      );
    }

    const amountVal = Number(amount);
    if (isNaN(amountVal) || amountVal < 100) {
      return NextResponse.json(
        { error: 'Amount must be a number and at least 100 paise (1 INR)' },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check credentials (Auth failure)
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay credentials not configured on server' },
        { status: 401 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountVal,
      currency: currency,
      receipt: receipt || `receipt_order_${Date.now()}`,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    
    // Handle auth failure explicitly if detectable from error response
    if (error?.statusCode === 401 || error?.error?.description?.includes('authentication')) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid Razorpay Key ID or Secret' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
