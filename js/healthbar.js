// healthbar.js - Reusable HealthBar Component

/**
    // Basic usage
    const healthBar = new HealthBarComponent('#container', {
    name: 'Player Name',
    initialValue: 75,
    backgroundImage: 'path/to/your/image.jpg'
    });

    // Control the health bar
    healthBar.add(25);           // Heal by 25%
    healthBar.remove(10);        // Damage by 10%
    healthBar.setHealth(50);     // Set to specific health
    healthBar.getCurrentHealth(); // Get current health value
    healthBar.isDead();          // Check if player is dead
 */
class HealthBarComponent {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            name: options.name || 'Player',
            initialValue: options.initialValue || 100,
            backgroundImage: options.backgroundImage || null,
            ...options
        };
        
        this.init();
    }
    
    init() {
        // Create the HTML structure
        this.createHTML();
        
        // Initialize the HealthBar with the existing logic
        this.healthBar = new HealthBar(
            this.container.querySelector('.barInner'),
            this.options.initialValue,
            this.container.querySelector('.value')
        );
        
        // Set the name
        this.container.querySelector('.name').textContent = this.options.name;
        
        // Set background image if provided
        if (this.options.backgroundImage) {
            this.container.querySelector('.background').style.backgroundImage = `url('${this.options.backgroundImage}')`;
        }
    }
    
    createHTML() {
        this.container.innerHTML = `
            <div class="barWrapper">
                <div class="bar">
                    <div class="barInner">
                        <span class="name">${this.options.name}</span>
                        <span class="value"></span>
                        <div class="state"></div>
                        <div class="background"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Expose HealthBar methods
    add(amount) {
        return this.healthBar.add(amount);
    }
    
    remove(amount) {
        return this.healthBar.remove(amount);
    }
    
    setHealth(percent) {
        return this.healthBar.setBar(percent);
    }
    
    getCurrentHealth() {
        return this.healthBar.state.current;
    }
    
    isDead() {
        return this.healthBar.dead;
    }
}

// Original HealthBar class (refactored for better encapsulation)
class HealthBar {
    constructor(element, initial, lblValue) {
        this.bar = element;
        this.lblValue = lblValue;
        this.state = element.querySelector('.state');
        this.state.current = initial;
        this.state.classList.add('state');
        this.bar.appendChild(this.state);
        this.dead = false;
        
        // Animation frame helper
        this.requestAnimationFrame = window.requestAnimationFrame || 
            ((callback) => setTimeout(callback, 20));
        
        this.setBar(this.state.current);
    }
    
    // Easing function
    static easeOutExpo(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }
    
    setBar(percent) {
        if (percent) {
            this.lblValue.innerHTML = parseInt(percent) + '/100';
            if (this.dead) {
                this.bar.classList.remove('dead');
                this.lblValue.classList.remove('dead');
                this.dead = false;
            }
        } else {
            this.dead = true;
            this.bar.classList.add('dead');
            this.lblValue.classList.add('dead');
            this.lblValue.innerHTML = 'Defeated';
        }
        
        // Color calculation based on health percentage
        const r = percent - 50;
        const red = r > 0 ? 255 / 50 * (50 - r) : 255;
        const green = percent < 50 ? 255 / 50 * percent : 255;
        
        this.state.style.backgroundColor = `rgba(${parseInt(red)}, ${parseInt(green)}, 0, 0.5)`;
        this.state.style.boxShadow = `0 0 8px 0 rgba(${parseInt(red)}, ${parseInt(green)}, 0, 0.8)`;
        this.state.style.width = percent + '%';
    }
    
    add(amount) {
        if (this.state.current + amount > 100) {
            amount = 100 - this.state.current;
        }
        
        const delta = document.createElement('div');
        delta.classList.add('additional');
        delta.style.width = '0px';
        delta.style.left = this.state.current + '%';
        
        // Add healing info text
        const infoText = document.createElement('span');
        infoText.className = 'infoText healTaken';
        infoText.innerHTML = amount + '%';
        this.bar.appendChild(infoText);
        
        setTimeout(() => {
            if (this.bar.contains(infoText)) {
                this.bar.removeChild(infoText);
            }
        }, 1000);
        
        this.animateChange(delta, amount, true);
        this.state.current += amount;
    }
    
    remove(amount) {
        if (this.state.current - amount < 0) {
            amount = this.state.current;
        }
        
        const delta = document.createElement('div');
        delta.classList.add('removal');
        delta.style.width = amount + 'px';
        delta.style.right = (100 - this.state.current) + '%';
        
        // Add damage info text
        const infoText = document.createElement('span');
        infoText.className = 'infoText dmgTaken';
        infoText.innerHTML = amount + '%';
        this.bar.appendChild(infoText);
        
        setTimeout(() => {
            if (this.bar.contains(infoText)) {
                this.bar.removeChild(infoText);
            }
        }, 1000);
        
        this.animateChange(delta, amount, false);
        this.state.current -= amount;
    }
    
    animateChange(delta, amount, isHealing) {
        const sStart = this.state.current;
        const start = Date.now();
        const duration = 500;
        
        const animate = () => {
            const t = Date.now() - start;
            const s = HealthBar.easeOutExpo(t, 0, amount, duration);
            
            delta.style.width = s + '%';
            
            if (isHealing) {
                this.setBar(sStart + s);
            } else {
                this.setBar(sStart - s);
            }
            
            if (t <= duration) {
                window.requestAnimationFrame(animate);
            } else {
                this.setBar(isHealing ? sStart + amount : sStart - amount);
                delta.classList.add('fadeout');
            }
        };
        
        this.bar.insertBefore(delta, this.state);
        animate();
        
        setTimeout(() => {
            this.setBar(this.state.current);
            if (this.bar.contains(delta)) {
                this.bar.removeChild(delta);
            }
        }, 1000);
    }
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HealthBarComponent, HealthBar };
}