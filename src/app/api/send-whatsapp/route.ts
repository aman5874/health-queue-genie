import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Message to customer
    const customerMessage = `Dear ${data.name},\n\nYour appointment has been confirmed for ${data.date} at ${data.time}.\n\nPayment Method: ${data.paymentMethod}\n\nThank you for choosing our service!`;
    
    // Message to admin
    const adminMessage = `New Appointment:\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nDate: ${data.date}\nTime: ${data.time}\nPayment: ${data.paymentMethod}\nNotes: ${data.notes}`;

    // Send message to customer
    await client.messages.create({
      body: customerMessage,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${data.phone}`
    });

    // Send message to admin
    await client.messages.create({
      body: adminMessage,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Twilio WhatsApp error:', error);
    return NextResponse.json(
      { error: 'Failed to send WhatsApp notification' },
      { status: 500 }
    );
  }
} 