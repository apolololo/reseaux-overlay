// Gestionnaire du Studio d'Overlays

class StudioManager {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
        this.userId = this.userData?.id || 'anonymous';
        this.overlays = this.loadOverlays();
    }

    // Charger les overlays depuis le stockage local
    loadOverlays() {
        const savedOverlays = localStorage.getItem(`overlays_${this.userId}`);
        return savedOverlays ? JSON.parse(savedOverlays) : [];
    }

    // Sauvegarder les overlays dans le stockage local
    saveOverlays() {
        localStorage.setItem(`overlays_${this.userId}`, JSON.stringify(this.overlays));
    }

    // Créer un nouvel overlay
    createOverlay(name, template = 'basic') {
        const overlay = {
            id: Date.now().toString(),
            name: name,
            template: template,
            settings: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.overlays.push(overlay);
        this.saveOverlays();
        return overlay;
    }

    // Mettre à jour un overlay existant
    updateOverlay(overlayId, updates) {
        const index = this.overlays.findIndex(o => o.id === overlayId);
        if (index === -1) return null;

        this.overlays[index] = {
            ...this.overlays[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveOverlays();
        return this.overlays[index];
    }

    // Supprimer un overlay
    deleteOverlay(overlayId) {
        const index = this.overlays.findIndex(o => o.id === overlayId);
        if (index === -1) return false;

        this.overlays.splice(index, 1);
        this.saveOverlays();
        return true;
    }

    // Générer l'URL d'un overlay pour OBS
    generateOverlayUrl(overlayId) {
        const overlay = this.overlays.find(o => o.id === overlayId);
        if (!overlay) return null;

        const overlayPath = `/src/overlays/custom/${overlayId}`;
        const token = window.securityUtils.generateSecureOverlayToken(overlayPath);
        return `${window.location.origin}/overlay.html?token=${token}`;
    }
}

// Exporter le gestionnaire
window.studioManager = new StudioManager();