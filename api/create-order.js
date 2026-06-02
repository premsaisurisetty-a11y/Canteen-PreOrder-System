export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount, orderId, customerName } = req.body;

  try {
    const response = await fetch('https://sandbox.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: 'cust_' + orderId,
          customer_name: customerName || 'Student',
          customer_email: 'student@campusbites.edu',
          customer_phone: '9999999999',
        },
        order_meta: {
          return_url: `${req.headers.origin || 'https://canteen-pre-order-system.vercel.app'}/orders?cf_order_id=${orderId}&status={order_status}`,
        },
        order_tags: {
          app: 'CampusBites',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree error:', data);
      return res.status(response.status).json({ error: data.message || 'Cashfree order creation failed', details: data });
    }

    res.status(200).json({
      payment_session_id: data.payment_session_id,
      cf_order_id: data.cf_order_id,
      order_id: data.order_id,
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
