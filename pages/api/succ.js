import Stripe from "stripe";
import fetch from "node-fetch";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const PRINTIFY_API_KEY = process.env.NEXT_PUBLIC_PRINTIFY_TOKEN;

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "Session ID is missing" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Parsing orderDetails from session metadata
    const orderDetails = JSON.parse(session.metadata.orderDetails);

    // Mapping line items to Printify order details
    const printifyOrderDetails = {
      line_items: lineItems.data.map((item, index) => {
        const detail = orderDetails[index];

        return {
          product_id: detail.productId,
          variant_id: detail.variantId,
          quantity: item.quantity,
        };
      }),
      address_to: {
        first_name: session.customer_details.name.split(" ")[0], // Assuming the first name is the first part of the full name
        last_name: session.customer_details.name.split(" ")[1] || "", // Assuming the last name is the second part of the full name
        email: session.customer_details.email,
        country: session.shipping_details.address.country,
        address1: session.shipping_details.address.line1,
        address2: session.shipping_details.address.line2 || "",
        city: session.shipping_details.address.city,
        state: session.shipping_details.address.state,
        zip: session.shipping_details.address.postal_code,
      },
    };
    // Sending order to Printify
    const response = await fetch(
      `https://api.printify.com/v1/shops/13368790/orders.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PRINTIFY_API_KEY}`,
        },
        body: JSON.stringify(printifyOrderDetails),
      }
    );

    if (!response.ok) {
      throw new Error(`Error from Printify order API: ${response.status}`);
    }

    const printifyResponse = await response.json();

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
