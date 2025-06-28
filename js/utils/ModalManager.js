// ModalManager.js - Handles modal dialogs and overlays

/**
 * ModalManager handles creation and management of modal dialogs
 */
export class ModalManager {
    constructor() {
        this.activeModals = new Map();
        this.modalStack = [];
        this.backdropClickHandlers = new Map();
    }

    /**
     * Create and show a modal
     * @param {string} modalId - Unique identifier for the modal
     * @param {Object} config - Modal configuration
     * @returns {Promise} Promise that resolves when modal is created
     */
    async createModal(modalId, config = {}) {
        const defaultConfig = {
            title: 'Modal',
            content: '',
            showCloseButton: true,
            closeOnBackdrop: true,
            closeOnEscape: true,
            cssClass: '',
            buttons: [],
            width: 'auto',
            height: 'auto',
            zIndex: 1000 + this.modalStack.length
        };

        const modalConfig = { ...defaultConfig, ...config };
        
        // Create modal structure
        const modal = this.createModalElement(modalId, modalConfig);
        document.body.appendChild(modal);
        
        // Store modal reference
        this.activeModals.set(modalId, {
            element: modal,
            config: modalConfig,
            isVisible: false
        });

        // Setup event listeners
        this.setupModalEventListeners(modalId, modal, modalConfig);

        return modal;
    }

    /**
     * Create modal DOM element
     * @param {string} modalId - Modal ID
     * @param {Object} config - Modal configuration
     * @returns {HTMLElement} Modal element
     */
    createModalElement(modalId, config) {
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = `modal-overlay ${config.cssClass}`;
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: ${config.zIndex};
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 90vw;
            max-height: 90vh;
            overflow: auto;
            position: relative;
            width: ${config.width};
            height: ${config.height};
            animation: modalSlideIn 0.3s ease-out;
        `;

        // Create header
        if (config.title || config.showCloseButton) {
            const header = this.createModalHeader(config);
            modalContent.appendChild(header);
        }

        // Create body
        const body = this.createModalBody(config);
        modalContent.appendChild(body);

        // Create footer with buttons
        if (config.buttons && config.buttons.length > 0) {
            const footer = this.createModalFooter(config, modalId);
            modalContent.appendChild(footer);
        }

        modal.appendChild(modalContent);
        return modal;
    }

    /**
     * Create modal header
     * @param {Object} config - Modal configuration
     * @returns {HTMLElement} Header element
     */
    createModalHeader(config) {
        const header = document.createElement('div');
        header.className = 'modal-header';
        header.style.cssText = `
            padding: 20px 20px 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        if (config.title) {
            const title = document.createElement('h2');
            title.textContent = config.title;
            title.style.cssText = 'margin: 0; font-size: 1.25rem; font-weight: bold;';
            header.appendChild(title);
        }

        if (config.showCloseButton) {
            const closeButton = document.createElement('span');
            closeButton.className = 'modal-close';
            closeButton.innerHTML = '&times;';
            closeButton.style.cssText = `
                font-size: 2rem;
                cursor: pointer;
                color: #aaa;
                transition: color 0.2s;
                user-select: none;
            `;
            closeButton.addEventListener('mouseenter', () => closeButton.style.color = '#000');
            closeButton.addEventListener('mouseleave', () => closeButton.style.color = '#aaa');
            header.appendChild(closeButton);
        }

        return header;
    }

    /**
     * Create modal body
     * @param {Object} config - Modal configuration
     * @returns {HTMLElement} Body element
     */
    createModalBody(config) {
        const body = document.createElement('div');
        body.className = 'modal-body';
        body.style.cssText = 'padding: 20px; min-height: 100px;';
        
        if (typeof config.content === 'string') {
            body.innerHTML = config.content;
        } else if (config.content instanceof HTMLElement) {
            body.appendChild(config.content);
        }

        return body;
    }

    /**
     * Create modal footer
     * @param {Object} config - Modal configuration
     * @param {string} modalId - Modal ID
     * @returns {HTMLElement} Footer element
     */
    createModalFooter(config, modalId) {
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        footer.style.cssText = `
            padding: 10px 20px 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        `;

        config.buttons.forEach(buttonConfig => {
            const button = document.createElement('button');
            button.textContent = buttonConfig.text || 'Button';
            button.className = `modal-button ${buttonConfig.cssClass || ''}`;
            button.style.cssText = `
                padding: 8px 16px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background: ${buttonConfig.primary ? '#007bff' : '#fff'};
                color: ${buttonConfig.primary ? '#fff' : '#333'};
                cursor: pointer;
                transition: all 0.2s;
            `;

            button.addEventListener('click', async () => {
                if (buttonConfig.onClick) {
                    const result = await buttonConfig.onClick();
                    if (result !== false && buttonConfig.closeOnClick !== false) {
                        this.hideModal(modalId);
                    }
                } else if (buttonConfig.closeOnClick !== false) {
                    this.hideModal(modalId);
                }
            });

            footer.appendChild(button);
        });

        return footer;
    }

    /**
     * Setup event listeners for modal
     * @param {string} modalId - Modal ID
     * @param {HTMLElement} modal - Modal element
     * @param {Object} config - Modal configuration
     */
    setupModalEventListeners(modalId, modal, config) {
        // Close button click
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hideModal(modalId));
        }

        // Backdrop click
        if (config.closeOnBackdrop) {
            const backdropHandler = (e) => {
                if (e.target === modal) {
                    this.hideModal(modalId);
                }
            };
            modal.addEventListener('click', backdropHandler);
            this.backdropClickHandlers.set(modalId, backdropHandler);
        }

        // Escape key
        if (config.closeOnEscape) {
            const escapeHandler = (e) => {
                if (e.key === 'Escape' && this.isTopModal(modalId)) {
                    this.hideModal(modalId);
                }
            };
            document.addEventListener('keydown', escapeHandler);
            // Store for cleanup
            if (!modal.escapeHandlers) modal.escapeHandlers = [];
            modal.escapeHandlers.push(escapeHandler);
        }
    }

    /**
     * Show a modal
     * @param {string} modalId - Modal ID
     * @returns {Promise} Promise that resolves when modal is shown
     */
    async showModal(modalId) {
        const modalData = this.activeModals.get(modalId);
        if (!modalData) {
            throw new Error(`Modal ${modalId} not found`);
        }

        modalData.element.style.display = 'flex';
        modalData.isVisible = true;
        this.modalStack.push(modalId);

        // Trigger reflow for animation
        modalData.element.offsetHeight;

        return new Promise(resolve => {
            setTimeout(resolve, 300); // Animation duration
        });
    }

    /**
     * Hide a modal
     * @param {string} modalId - Modal ID
     * @returns {Promise} Promise that resolves when modal is hidden
     */
    async hideModal(modalId) {
        const modalData = this.activeModals.get(modalId);
        if (!modalData || !modalData.isVisible) {
            return;
        }

        const modal = modalData.element;
        const content = modal.querySelector('.modal-content');
        
        if (content) {
            content.style.animation = 'modalSlideOut 0.3s ease-in forwards';
        }

        return new Promise(resolve => {
            setTimeout(() => {
                modal.style.display = 'none';
                modalData.isVisible = false;
                
                // Remove from stack
                const stackIndex = this.modalStack.indexOf(modalId);
                if (stackIndex > -1) {
                    this.modalStack.splice(stackIndex, 1);
                }

                resolve();
            }, 300);
        });
    }

    /**
     * Update modal content
     * @param {string} modalId - Modal ID
     * @param {string|HTMLElement} newContent - New content
     */
    updateModalContent(modalId, newContent) {
        const modalData = this.activeModals.get(modalId);
        if (!modalData) return;

        const body = modalData.element.querySelector('.modal-body');
        if (body) {
            if (typeof newContent === 'string') {
                body.innerHTML = newContent;
            } else if (newContent instanceof HTMLElement) {
                body.innerHTML = '';
                body.appendChild(newContent);
            }
        }
    }

    /**
     * Check if modal is the top modal
     * @param {string} modalId - Modal ID
     * @returns {boolean} True if modal is on top
     */
    isTopModal(modalId) {
        return this.modalStack.length > 0 && this.modalStack[this.modalStack.length - 1] === modalId;
    }

    /**
     * Destroy a modal
     * @param {string} modalId - Modal ID
     */
    destroyModal(modalId) {
        const modalData = this.activeModals.get(modalId);
        if (!modalData) return;

        // Hide first if visible
        if (modalData.isVisible) {
            this.hideModal(modalId);
        }

        // Clean up event listeners
        const modal = modalData.element;
        if (modal.escapeHandlers) {
            modal.escapeHandlers.forEach(handler => {
                document.removeEventListener('keydown', handler);
            });
        }

        // Remove backdrop handler
        const backdropHandler = this.backdropClickHandlers.get(modalId);
        if (backdropHandler) {
            modal.removeEventListener('click', backdropHandler);
            this.backdropClickHandlers.delete(modalId);
        }

        // Remove from DOM
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }

        // Remove from tracking
        this.activeModals.delete(modalId);
    }

    /**
     * Hide all modals
     */
    async hideAllModals() {
        const hidePromises = this.modalStack.map(modalId => this.hideModal(modalId));
        await Promise.all(hidePromises);
    }

    /**
     * Get modal by ID
     * @param {string} modalId - Modal ID
     * @returns {HTMLElement|null} Modal element
     */
    getModal(modalId) {
        const modalData = this.activeModals.get(modalId);
        return modalData ? modalData.element : null;
    }
}

// Global modal manager instance
export const modalManager = new ModalManager();

// Add CSS animations if not already present
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes modalSlideOut {
            from {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            to {
                opacity: 0;
                transform: scale(0.8) translateY(-20px);
            }
        }

        .modal-button:hover {
            opacity: 0.8;
            transform: translateY(-1px);
        }

        .modal-content {
            animation: modalSlideIn 0.3s ease-out !important;
        }
    `;
    document.head.appendChild(styleSheet);
}