// Navigation Component
class Navigation {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isAuthenticated = this.checkAuthentication();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/') return 'dashboard';
        if (path.includes('editor.html')) return 'editor';
        if (path.includes('my-overlays.html')) return 'overlays';
        if (path.includes('marketplace.html')) return 'marketplace';
        return 'dashboard';
    }

    checkAuthentication() {
        return localStorage.getItem('user_logged_in') || localStorage.getItem('user_token');
    }

    createNavigationHTML() {
        return `
            <nav class="main-navigation">
                <div class="nav-container">
                    <div class="nav-brand">
                        <a href="index.html" class="brand-link">
                            <i class="fas fa-layer-group"></i>
                            <span>APO Overlays</span>
                        </a>
                    </div>
                    
                    <div class="nav-menu">
                        <a href="index.html" class="nav-item ${this.currentPage === 'dashboard' ? 'active' : ''}">
                            <i class="fas fa-home"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="editor.html" class="nav-item ${this.currentPage === 'editor' ? 'active' : ''}">
                            <i class="fas fa-edit"></i>
                            <span>Éditeur</span>
                        </a>
                        <a href="my-overlays.html" class="nav-item ${this.currentPage === 'overlays' ? 'active' : ''}">
                            <i class="fas fa-folder"></i>
                            <span>Mes Overlays</span>
                        </a>
                        <a href="marketplace.html" class="nav-item ${this.currentPage === 'marketplace' ? 'active' : ''}">
                            <i class="fas fa-store"></i>
                            <span>Marketplace</span>
                        </a>
                    </div>
                    
                    <div class="nav-actions">
                        ${this.isAuthenticated ? `
                            <div class="user-menu">
                                <button class="user-button" onclick="toggleUserMenu()">
                                    <i class="fas fa-user"></i>
                                    <span>Profil</span>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                                <div class="user-dropdown" id="userDropdown">
                                    <a href="#" onclick="logout()">
                                        <i class="fas fa-sign-out-alt"></i>
                                        Déconnexion
                                    </a>
                                </div>
                            </div>
                        ` : `
                            <a href="/auth/auth.html" class="btn btn-primary">
                                <i class="fas fa-sign-in-alt"></i>
                                Se connecter
                            </a>
                        `}
                    </div>
                </div>
            </nav>
        `;
    }

    createNavigationCSS() {
        return `
            <style>
                .main-navigation {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    margin-bottom: 20px;
                }
                
                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    height: 70px;
                }
                
                .nav-brand .brand-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                    color: var(--primary-color, #8b5cf6);
                    font-size: 1.5rem;
                    font-weight: 700;
                }
                
                .nav-brand .brand-link i {
                    font-size: 1.8rem;
                }
                
                .nav-menu {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    text-decoration: none;
                    color: var(--text-secondary, #a0a0a0);
                    border-radius: 10px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                
                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-color, #ffffff);
                }
                
                .nav-item.active {
                    background: var(--primary-gradient, linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%));
                    color: white;
                }
                
                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .user-menu {
                    position: relative;
                }
                
                .user-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    color: var(--text-color, #ffffff);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .user-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .user-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    min-width: 150px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }
                
                .user-dropdown.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                
                .user-dropdown a {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    text-decoration: none;
                    color: var(--text-color, #ffffff);
                    transition: all 0.3s ease;
                }
                
                .user-dropdown a:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                @media (max-width: 768px) {
                    .nav-container {
                        padding: 0 15px;
                    }
                    
                    .nav-menu {
                        display: none;
                    }
                    
                    .nav-brand .brand-link span {
                        display: none;
                    }
                }
            </style>
        `;
    }

    init() {
        // Injecter le CSS
        document.head.insertAdjacentHTML('beforeend', this.createNavigationCSS());
        
        // Injecter la navigation au début du body
        document.body.insertAdjacentHTML('afterbegin', this.createNavigationHTML());
        
        // Ajouter les event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Fonction globale pour le menu utilisateur
        window.toggleUserMenu = () => {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
        };

        // Fermer le menu si on clique ailleurs
        document.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.user-menu');
            const dropdown = document.getElementById('userDropdown');
            if (userMenu && dropdown && !userMenu.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Fonction globale de déconnexion
        window.logout = () => {
            localStorage.removeItem('user_logged_in');
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_data');
            window.location.href = '/auth/auth.html';
        };
    }
}

// Initialiser la navigation automatiquement
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const nav = new Navigation();
        nav.init();
    });
}

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}