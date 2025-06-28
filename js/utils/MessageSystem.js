// MessageSystem.js - Handles game messages and notifications

import { ANIMATION_TIMINGS, CSS_CLASSES } from '../core/GameConstants.js';

/**
 * MessageSystem handles floating messages and notifications
 */
export class MessageSystem {
    constructor() {
        this.activeMessages = new Set();
        this.messageQueue = [];
        this.isProcessingQueue = false;
    }

    /**
     * Show a floating message
     * @param {string} text - Message text
     * @param {Object} options - Message options
     */
    showMessage(text, options = {}) {
        const config = {
            duration: ANIMATION_TIMINGS.MESSAGE_DISPLAY_DURATION,
            position: 'center', // 'center', 'top', 'bottom'
            type: 'info', // 'info', 'success', 'warning', 'error'
            fontSize: 'clamp(12px, 3vw, 16px)',
            ...options
        };

        const message = this.createMessageElement(text, config);
        document.body.appendChild(message);
        this.activeMessages.add(message);

        // Auto-remove after duration
        setTimeout(() => {
            this.removeMessage(message);
        }, config.duration);

        return message;
    }

    /**
     * Create message DOM element
     * @param {string} text - Message text
     * @param {Object} config - Message configuration
     * @returns {HTMLElement} Message element
     */
    createMessageElement(text, config) {
        const message = document.createElement('div');
        message.className = `${CSS_CLASSES.GAME_MESSAGE} message-${config.type}`;
        message.textContent = text;

        // Position styles
        const positions = {
            center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            top: { top: '20%', left: '50%', transform: 'translate(-50%, -50%)' },
            bottom: { bottom: '20%', left: '50%', transform: 'translateX(-50%)' }
        };

        const position = positions[config.position] || positions.center;

        message.style.cssText = `
            position: fixed;
            top: ${position.top || 'auto'};
            bottom: ${position.bottom || 'auto'};
            left: ${position.left};
            transform: ${position.transform};
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 1000;
            animation: messageFloat ${config.duration}ms ease-out forwards;
            font-size: ${config.fontSize};
            max-width: 90vw;
            text-align: center;
            pointer-events: none;
        `;

        // Add type-specific styling
        this.applyTypeStyles(message, config.type);

        return message;
    }

    /**
     * Apply type-specific styles to message
     * @param {HTMLElement} message - Message element
     * @param {string} type - Message type
     */
    applyTypeStyles(message, type) {
        const typeStyles = {
            success: { background: 'rgba(76, 175, 80, 0.9)', borderLeft: '4px solid #4CAF50' },
            warning: { background: 'rgba(255, 152, 0, 0.9)', borderLeft: '4px solid #FF9800' },
            error: { background: 'rgba(244, 67, 54, 0.9)', borderLeft: '4px solid #f44336' },
            info: { background: 'rgba(0, 0, 0, 0.9)', borderLeft: '4px solid #2196F3' }
        };

        const styles = typeStyles[type] || typeStyles.info;
        Object.assign(message.style, styles);
    }

    /**
     * Remove a message
     * @param {HTMLElement} message - Message to remove
     */
    removeMessage(message) {
        if (message && message.parentNode) {
            message.style.opacity = '0';
            message.style.transform += ' scale(0.8)';
            
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
                this.activeMessages.delete(message);
            }, 300);
        }
    }

    /**
     * Clear all active messages
     */
    clearAllMessages() {
        this.activeMessages.forEach(message => {
            this.removeMessage(message);
        });
        this.activeMessages.clear();
    }

    /**
     * Show success message
     * @param {string} text - Message text
     * @param {Object} options - Additional options
     */
    showSuccess(text, options = {}) {
        return this.showMessage(text, { ...options, type: 'success' });
    }

    /**
     * Show warning message
     * @param {string} text - Message text
     * @param {Object} options - Additional options
     */
    showWarning(text, options = {}) {
        return this.showMessage(text, { ...options, type: 'warning' });
    }

    /**
     * Show error message
     * @param {string} text - Message text
     * @param {Object} options - Additional options
     */
    showError(text, options = {}) {
        return this.showMessage(text, { ...options, type: 'error' });
    }

    /**
     * Show info message
     * @param {string} text - Message text
     * @param {Object} options - Additional options
     */
    showInfo(text, options = {}) {
        return this.showMessage(text, { ...options, type: 'info' });
    }

    /**
     * Queue a message to be shown after current ones
     * @param {string} text - Message text
     * @param {Object} options - Message options
     */
    queueMessage(text, options = {}) {
        this.messageQueue.push({ text, options });
        this.processQueue();
    }

    /**
     * Process message queue
     */
    async processQueue() {
        if (this.isProcessingQueue || this.messageQueue.length === 0) return;

        this.isProcessingQueue = true;

        while (this.messageQueue.length > 0) {
            const { text, options } = this.messageQueue.shift();
            this.showMessage(text, options);
            
            // Wait a bit before showing next message
            if (this.messageQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        this.isProcessingQueue = false;
    }

    /**
     * Create a progress message that can be updated
     * @param {string} initialText - Initial message text
     * @param {Object} options - Message options
     * @returns {Object} Progress message controller
     */
    createProgressMessage(initialText, options = {}) {
        const message = this.showMessage(initialText, { 
            ...options, 
            duration: 999999 // Long duration, will be manually removed
        });

        return {
            update: (newText) => {
                message.textContent = newText;
            },
            remove: () => {
                this.removeMessage(message);
            },
            element: message
        };
    }
}

// Global message system instance
export const messageSystem = new MessageSystem();

// Add CSS keyframes for message animation if not already present
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes messageFloat {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8) translateY(20px);
            }
            10% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) translateY(0);
            }
            90% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) translateY(0);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9) translateY(-10px);
            }
        }

        .message-success {
            border-left: 4px solid #4CAF50 !important;
        }

        .message-warning {
            border-left: 4px solid #FF9800 !important;
        }

        .message-error {
            border-left: 4px solid #f44336 !important;
        }

        .message-info {
            border-left: 4px solid #2196F3 !important;
        }
    `;
    document.head.appendChild(styleSheet);
}