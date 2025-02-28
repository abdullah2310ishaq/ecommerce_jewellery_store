import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use "Gmail", "Yahoo", "Outlook", or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

// Define types for order items and payload
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderPayload {
  name: string;
  email: string;
  orderId: string | number;
  items: OrderItem[];
  totalAmount: number;
  address: string;
}

// Email sending function
export async function POST(req: NextRequest) {
  try {
    const { name, email, orderId, items, totalAmount, address } =
      (await req.json()) as OrderPayload;

    // Create order summary HTML
    const orderSummary = items
      .map((item: OrderItem) => `<li>${item.name} (x${item.quantity}) - Rs. ${item.price}</li>`)
      .join("");

    // Email HTML content
    const mailOptions = {
      from: `"H&H Jewelers" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <h2>Thank you for your order, ${name}!</h2>
        <p>Your order ID: <strong>#${orderId}</strong></p>
        <p><strong>Order Summary:</strong></p>
        <ul>${orderSummary}</ul>
        <p><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
        <p><strong>Shipping Address:</strong> ${address}</p>
        <p>We will notify you once your order is shipped.</p>
        <p>For any queries, contact us at support@yourstore.com.</p>
        <p>Best regards,</p>
        <p><strong>H&H Jewelers</strong></p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Email could not be sent" }, { status: 500 });
  }
}
