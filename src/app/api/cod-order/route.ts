import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

async function sendCODEmail({
  email,
  name,
  cartItems,
  total,
  orderId,
  eta,
}: {
  email: string;
  name: string;
  cartItems: any[];
  total: string;
  orderId: string;
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
    subject: `📦 Cash on Delivery Order Confirmed - #${orderId}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; font-weight: bold; letter-spacing: -0.5px;">📦 Cash on Delivery Order Placed!</h1>
          <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">Thank you for shopping with Nottysukkus</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px; background-color: white;">
          <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #111827;">Hello ${name},</h2>
          <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">
            Your Cash on Delivery order has been confirmed! Please keep the exact amount ready when the delivery partner arrives. Below are your order details and delivery estimate.
          </p>
          
          <!-- COD Badge -->
          <div style="background-color: #ecfdf5; border: 2px solid #059669; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; text-align: center;">
            <span style="font-size: 16px; font-weight: bold; color: #059669;">💵 Payment Method: Cash on Delivery</span>
          </div>
          
          <!-- Key Order Info Card -->
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: #6b7280; font-weight: 500;">Order ID:</td>
                <td style="padding: 4px 0; font-size: 14px; color: #111827; font-weight: bold; text-align: right;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: #6b7280; font-weight: 500;">Payment:</td>
                <td style="padding: 4px 0; font-size: 14px; color: #059669; font-weight: bold; text-align: right;">Cash on Delivery</td>
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
                <td colspan="2" style="padding: 16px 12px 12px 12px; font-size: 15px; color: #111827; font-weight: bold; text-align: right;">Amount to Pay on Delivery:</td>
                <td style="padding: 16px 12px 12px 12px; font-size: 18px; color: #059669; font-weight: bold; text-align: right;">₹${total}</td>
              </tr>
            </tbody>
          </table>
          
          <!-- Important Note -->
          <div style="background-color: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;">
              <strong>⚠️ Important:</strong> Please keep ₹${total} ready in cash when our delivery partner arrives. The order will be cancelled if not collected within 48 hours of delivery attempt.
            </p>
          </div>
          
          <!-- Footer Note -->
          <p style="margin: 32px 0 0 0; font-size: 13px; color: #9ca3af; text-align: center; line-height: 1.5;">
            If you have any questions about your order, contact us at <a href="mailto:sukritchopra2003@gmail.com" style="color: #059669; text-decoration: none;">sukritchopra2003@gmail.com</a>.
          </p>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('📧 COD Email sent successfully! Message ID:', info.messageId);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  return {
    messageId: info.messageId,
    previewUrl: previewUrl || undefined,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, cartItems, total, eta } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Customer email is required for COD orders' },
        { status: 400 }
      );
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Generate a unique COD order ID
    const orderId = `COD_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Send COD confirmation email
    let emailResult = null;
    try {
      emailResult = await sendCODEmail({
        email,
        name: name || 'Valued Customer',
        cartItems,
        total: total || '0.00',
        orderId,
        eta: eta || '5-7 Business Days',
      });
    } catch (mailError) {
      console.error('Failed to send COD email:', mailError);
    }

    return NextResponse.json({
      status: 'success',
      message: 'Cash on Delivery order placed successfully',
      orderId,
      emailSent: !!emailResult,
      previewUrl: emailResult?.previewUrl || null,
    });
  } catch (error: any) {
    console.error('COD Order API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to place COD order' },
      { status: 500 }
    );
  }
}
