
export const sendAutomaticHoldingEmail = async (house: any, user: any) => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  if (!apiKey) {
    console.warn("VITE_RESEND_API_KEY missing. Automatic email bypassed.");
    return false;
  }

  const subject = `INQUIRY: ${house.title} - HOLDING INITIALIZATION`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #0F172A;">
      <h1 style="color: #00AEEF; border-bottom: 2px solid #00AEEF; padding-bottom: 10px;">Property Holding Initialization</h1>
      <p>Hi ${house.ownerName || 'Property Owner'},</p>
      <p>I am <strong>${user.name}</strong> and I am reaching out to initialize a holding for your property: <strong>"${house.title}"</strong> located in ${house.location}.</p>
      <p>I have reviewed the Neural Manifestation Analysis and Historical Delta Matrix, and I would like to proceed with the holding fee of <strong>₹${house.price.toLocaleString()}</strong>.</p>
      <p>Please provide me with the specific documentation requirements and next steps.</p>
      <div style="margin-top: 40px; border-top: 1px solid #E2E8F0; pt: 20px;">
        <p>Best Regards,</p>
        <p><strong>${user.name}</strong></p>
        <p style="color: #94A3B8; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Antigravity Intelligence Portfolio Holder</p>
      </div>
    </div>
  `;

  try {
    // Note: If using Resend's free tier without a verified domain, 
    // sending to addresses other than your own may fail with code 403.
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'AffordHome Intelligence <onboarding@resend.dev>',
        to: [house.email],
        reply_to: user.email,
        subject: subject,
        html: html
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API Error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email Dispatch Error:', error);
    return false;
  }
};
