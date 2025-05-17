
interface SubscriptionResponse {
  success: boolean;
  message: string;
}

export const subscribeToNewsletter = async (email: string): Promise<SubscriptionResponse> => {
  try {
    // Get the backend URL from environment variables
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    if (!backendUrl) {
      console.error('Backend URL not configured');
      return {
        success: false,
        message: 'Configuration du backend manquante. Veuillez configurer l\'URL du backend.'
      };
    }

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard.'
    };
  }
};
