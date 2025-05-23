// Configuration de l'overlay
const config = {
    // Dimensions par défaut
    dimensions: {
        width: 1920,
        height: 1080
    },

    // Paramètres Twitch
    twitch: {
        clientId: '', // À remplir avec votre Client ID Twitch
        redirectUri: 'https://apo-overlay.netlify.app/auth/callback.html',
        scopes: [
            'chat:read',
            'chat:edit',
            'channel:read:subscriptions',
            'channel:read:redemptions',
            'channel:read:bits',
            'channel:read:goals'
        ]
    },

    // Paramètres par défaut des éléments
    elements: {
        text: {
            defaultFontSize: 24,
            defaultColor: '#ffffff',
            defaultFontFamily: 'Montserrat, sans-serif'
        },
        chat: {
            maxMessages: 50,
            messageTimeout: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '8px',
            padding: '10px'
        },
        alert: {
            duration: 5000,
            animation: 'fadeIn',
            backgroundColor: 'rgba(255, 82, 82, 0.9)',
            borderRadius: '8px',
            padding: '15px'
        }
    },

    // Animations disponibles
    animations: {
        fadeIn: {
            from: { opacity: 0, transform: 'translateY(-10px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
        },
        slideIn: {
            from: { transform: 'translateX(-100%)' },
            to: { transform: 'translateX(0)' }
        },
        scaleIn: {
            from: { opacity: 0, transform: 'scale(0.8)' },
            to: { opacity: 1, transform: 'scale(1)' }
        }
    },

    // Thèmes disponibles
    themes: {
        default: {
            primary: '#9146FF',
            secondary: '#00ADB5',
            background: '#0e0e10',
            surface: '#18181b',
            text: '#efeff1',
            textSecondary: '#adadb8'
        },
        dark: {
            primary: '#1DB954',
            secondary: '#191414',
            background: '#000000',
            surface: '#121212',
            text: '#FFFFFF',
            textSecondary: '#B3B3B3'
        },
        light: {
            primary: '#1DA1F2',
            secondary: '#E1E8ED',
            background: '#FFFFFF',
            surface: '#F5F8FA',
            text: '#14171A',
            textSecondary: '#657786'
        }
    },

    // Paramètres de sauvegarde
    storage: {
        prefix: 'apo_overlay_',
        autoSave: true,
        autoSaveInterval: 30000 // 30 secondes
    },

    // Paramètres d'export
    export: {
        formats: ['json', 'html', 'css'],
        defaultFormat: 'json',
        includeAssets: true
    }
};

// Exporter la configuration
export default config; 