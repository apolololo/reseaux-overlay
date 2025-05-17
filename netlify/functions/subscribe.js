
// Netlify function to handle newsletter subscriptions

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // Parse the incoming request body
    const { email } = JSON.parse(event.body);
    
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Adresse email invalide' 
        })
      };
    }
    
    // Get environment variables
    const BREVO_API_KEY = process.env.VITE_BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.VITE_BREVO_LIST_ID;
    
    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      console.error('Missing Brevo API key or list ID');
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Configuration serveur manquante'
        })
      };
    }
    
    // Send to Brevo API
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(BREVO_LIST_ID)],
        updateEnabled: true
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Inscription réussie!'
        })
      };
    } else {
      console.error('Brevo API error:', data);
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Erreur lors de l\'inscription: ' + (data.message || 'Erreur inconnue')
        })
      };
    }
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Une erreur est survenue'
      })
    };
  }
};
