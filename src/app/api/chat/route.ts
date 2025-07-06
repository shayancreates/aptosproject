import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    let response =
      "I'm here to help you track your orders. Please provide your order ID.";

    if (
      message.toLowerCase().includes("order") &&
      message.toLowerCase().includes("track")
    ) {
      response =
        "To track your order, please provide your order ID. You can find this in your order confirmation email or in your order history.";
    } else if (message.toLowerCase().includes("delivery")) {
      response =
        "Delivery times vary depending on the product and location. Most orders are delivered within 3-5 business days. You can track your specific order by providing your order ID.";
    } else if (
      message.toLowerCase().includes("return") ||
      message.toLowerCase().includes("refund")
    ) {
      response =
        "For returns and refunds, please contact our customer service team. You can also check our return policy on our website.";
    } else if (message.toLowerCase().includes("help")) {
      response =
        "I can help you with: \n- Order tracking\n- Delivery information\n- Returns and refunds\n- General inquiries\n\nWhat would you like to know?";
    } else if (/\d+/.test(message)) {
      response = `Thank you for providing order ID ${message}. I'm checking the status of your order...\n\nOrder Status: In Transit\nEstimated Delivery: 2-3 business days\nCurrent Location: Distribution Center\n\nIs there anything else you'd like to know about your order?`;
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
