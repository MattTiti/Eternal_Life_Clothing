import Stripe from "stripe";
import fetch from "node-fetch";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "Session ID is missing" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log(session);
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Extract customer information from session
    const customerEmail = session.customer_details.email;
    const shippingAddress = session.shipping_details;
    const name = session.customer_details.name;
    // ... any other customer information available in the session

    // Here, you can use this information to place an order with Printify
    // For example, you might send a POST request to your Printify order API route

    const printifyOrderDetails = {
      items: lineItems.data.map((item) => ({
        product_id: "6585de66aa1d44090c0fd72c",
        variant_id: 31950,
        quantity: item.quantity,
      })),
      address: {
        first_name: name,
        email: customerEmail,
        country: shippingAddress.address.country,
        state: shippingAddress.address.state,
        address1: shippingAddress.address.line1,
        address2: shippingAddress.address.line2 || "",
        city: shippingAddress.address.city,
        zip: shippingAddress.address.postal_code,
      },
    };
    console.log(shippingAddress);

    const response = await fetch(`http://localhost:3000/api/printify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printifyOrderDetails),
    });

    if (!response.ok) {
      throw new Error(`Error from Printify order API: ${response.status}`);
    }

    const printifyResponse = await response.json();

    // Respond back to the client
    res.status(200).json({
      success: true,
      message: "Stripe and Printify processing completed",
      printifyResponse,
    });
  } catch (error) {
    console.error("Error in success callback:", error);
    res.status(500).json({ error: error.message });
  }
}
