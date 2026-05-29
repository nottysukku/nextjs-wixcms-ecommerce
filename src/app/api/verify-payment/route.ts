import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Helper to send order email
async function sendOrderEmail({
  email,
  name,
  cartItems,
  total,
  orderId,
  paymentId,
  eta,
}: {
  email: string;
  name: string;
  cartItems: any[];
  total: string;
  orderId: string;
  paymentId: string;
  eta: string;
}) {
  let transporter;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const itemsHtml = cartItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151;">
        ${item.productName?.original || item.name || 'Product'}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151; text-align: center;">
        ${item.quantity || 1}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151; text-align: right; font-weight: bold;">
        ₹${item.price?.amount || item.price || '0.00'}
      </td>
    </tr>
  `
    )
    .join('');

  const mailOptions = {
    from: '"Nottysukkus Store" <noreply@nottysukkus.com>',
    to: email,
    subject: `🎉 Order Confirmation - #${orderId}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); padding: 32px 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; font-weight: bold; letter-spacing: -0.5px;">🛍️ Order Confirmed!</h1>
          <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">Thank you for shopping with Nottysukkus</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px; background-color: white;">
          <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #111827;">Hello ${name},</h2>
          <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">
            Your payment was successfully verified! We are preparing your shipment. Below are your order details and delivery estimate.
          </p>
          
          <!-- Key Order Info Card -->
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: #6b7280; font-weight: 500;">Order ID:</td>
                <td style="padding: 4px 0; font-size: 14px; color: #111827; font-weight: bold; text-align: right;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: #6b7280; font-weight: 500;">Payment ID:</td>
                <td style="padding: 4px 0; font-size: 14px; color: #111827; text-align: right; font-family: monospace;">${paymentId}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: #6b7280; font-weight: 500;">Estimated Delivery (ETA):</td>
                <td style="padding: 4px 0; font-size: 14px; color: #059669; font-weight: bold; text-align: right;">🚚 ${eta}</td>
              </tr>
            </table>
          </div>
          
          <!-- Order Summary Table -->
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px 12px; font-size: 12px; text-transform: uppercase; color: #4b5563; font-weight: 600; text-align: left;">Product</th>
                <th style="padding: 10px 12px; font-size: 12px; text-transform: uppercase; color: #4b5563; font-weight: 600; text-align: center; width: 60px;">Qty</th>
                <th style="padding: 10px 12px; font-size: 12px; text-transform: uppercase; color: #4b5563; font-weight: 600; text-align: right; width: 100px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <!-- Total row -->
              <tr>
                <td colspan="2" style="padding: 16px 12px 12px 12px; font-size: 15px; color: #111827; font-weight: bold; text-align: right;">Total Amount Paid:</td>
                <td style="padding: 16px 12px 12px 12px; font-size: 18px; color: #4f46e5; font-weight: bold; text-align: right;">₹${total}</td>
              </tr>
            </tbody>
          </table>
          
          <!-- Footer Note -->
          <p style="margin: 32px 0 0 0; font-size: 13px; color: #9ca3af; text-align: center; line-height: 1.5;">
            If you have any questions about your order, feel free to reply to this email or contact support at <a href="mailto:sukritchopra2003@gmail.com" style="color: #4f46e5; text-decoration: none;">sukritchopra2003@gmail.com</a>.
          </p>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('📧 Email sent successfully! Message ID:', info.messageId);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  return {
    messageId: info.messageId,
    previewUrl: previewUrl || undefined,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      email,
      name,
      cartItems,
      total,
      eta
    } = body;

    // 1. Missing fields check
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required signature verification fields' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: 'Razorpay Key Secret is not configured' },
        { status: 500 }
      );
    }

    // 2. Generate HMAC-SHA256 signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    // 3. Compare signatures
    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { status: 'failure', message: 'Signature verification failed (mismatch)' },
        { status: 400 }
      );
    }

    // 4. Send email if customer email is provided
    let emailResult = null;
    if (email) {
      try {
        emailResult = await sendOrderEmail({
          email,
          name: name || 'Valued Customer',
          cartItems: cartItems || [],
          total: total || '0.00',
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          eta: eta || '3-5 Business Days',
        });
      } catch (mailError) {
        console.error('Failed to send order email:', mailError);
      }
    }

    // 5. Return success only if signatures match
    return NextResponse.json({
      status: 'success',
      message: 'Payment verified successfully',
      verified: true,
      emailSent: !!emailResult,
      previewUrl: emailResult?.previewUrl || null,
    });
  } catch (error: any) {
    console.error('Razorpay Verification API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
