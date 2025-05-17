
/**
 * CECI EST UN EXEMPLE DE CODE SERVEUR
 * À implémenter sur votre propre serveur ou service serverless
 * (Express.js, Netlify Functions, Vercel API Routes, etc.)
 */

// Clés API stockées en sécurité sur le serveur (variables d'environnement)
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID || 2;

// Exemple avec Express.js
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Adresse email invalide' 
      });
    }
    
    // Appel à l'API Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(BREVO_LIST_ID)],
        updateEnabled: true
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        success: false, 
        message: data.message || 'Erreur lors de l\'inscription' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Inscription réussie à la newsletter' 
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'inscription' 
    });
  }
});
