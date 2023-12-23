import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  // Extract order details from the request body
  const orderDetails = req.body;

  // Define your Printify API key and Shop ID
  const PRINTIFY_API_KEY = process.env.NEXT_PUBLIC_PRINTIFY_TOKEN;
  const SHOP_KEY = 13368790;

  // Format the order for Printify's API
  const printifyOrder = {
    line_items: orderDetails.items.map((item) => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
    })),
    is_printify_express: false,
    send_shipping_notification: false,
    address_to: {
      first_name: orderDetails.address.first_name,
      last_name: "",
      email: orderDetails.address.email,
      country: orderDetails.address.country,
      address1: orderDetails.address.address1,
      address2: orderDetails.address.address2,
      city: orderDetails.address.city,
      state: orderDetails.address.state,
      zip: orderDetails.address.zip,
    },
  };

  try {
    // Make a POST request to Printify's API to create the order
    const response = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_KEY}/orders.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PRINTIFY_API_KEY}`,
          "Content-Type": "raw/json",
        },
        body: JSON.stringify(printifyOrder),
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error(`Error from Printify API: ${response.status}`);
    }

    // Parse the response from Printify
    const printifyResponse = await response.json();

    // Respond to the client with the Printify response
    res.status(200).json(printifyResponse);
  } catch (error) {
    console.error("Error placing order with Printify:", error);
    res.status(500).json({ error: error.message });
  }
}
