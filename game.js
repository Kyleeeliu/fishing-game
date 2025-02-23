class Game {
    constructor() {
        this.score = 0;
        this.player = document.getElementById('player');
        this.hook = document.getElementById('hook');
        this.ocean = document.getElementById('ocean');
        this.scoreElement = document.getElementById('score');
        this.hookLength = 100;
        this.isReeling = false;
        this.fishes = [];
        this.playerPosition = 400; // Center position
        
        this.init();
    }

    init() {
        // Add event listeners
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Start spawning fish
        this.spawnFish();
        
        // Start game loop
        this.gameLoop();
    }

    handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowLeft':
                if(this.playerPosition > 0) {
                    this.playerPosition -= 10;
                    this.player.style.left = `${this.playerPosition}px`;
                    if(!this.isReeling) {
                        this.hook.style.left = `${this.playerPosition + 50}px`; // Center hook with rod
                    }
                }
                break;
            case 'ArrowRight':
                if(this.playerPosition < 700) {
                    this.playerPosition += 10;
                    this.player.style.left = `${this.playerPosition}px`;
                    if(!this.isReeling) {
                        this.hook.style.left = `${this.playerPosition + 50}px`; // Center hook with rod
                    }
                }
                break;
            case 'Space':
            case ' ':
                e.preventDefault(); // Prevent page scrolling
                if(!this.isReeling) {
                    this.castLine();
                }
                break;
        }
    }

    handleKeyUp(e) {
        if(e.key === ' ' || e.key === 'Space') {
            this.reelIn();
        }
    }

    castLine() {
        this.isReeling = true;
        const currentLeft = parseFloat(this.hook.style.left) || (this.playerPosition + 50);
        this.hook.style.left = `${currentLeft}px`; // Keep current horizontal position
        
        const castInterval = setInterval(() => {
            if(this.hookLength < 500 && this.isReeling) {
                this.hookLength += 5;
                this.hook.style.height = `${this.hookLength}px`;
            } else {
                clearInterval(castInterval);
            }
        }, 20);
    }

    reelIn() {
        this.isReeling = false;
        const currentLeft = parseFloat(this.hook.style.left) || (this.playerPosition + 50);
        
        const reelInterval = setInterval(() => {
            if(this.hookLength > 100) {
                this.hookLength -= 5;
                this.hook.style.height = `${this.hookLength}px`;
            } else {
                clearInterval(reelInterval);
                // Only reset horizontal position after fully reeled in
                this.hook.style.left = `${this.playerPosition + 50}px`;
            }
        }, 20);
    }

    spawnFish() {
        setInterval(() => {
            const fish = document.createElement('div');
            fish.className = 'fish';
            fish.style.left = '0px';
            fish.style.bottom = `${Math.random() * 250}px`;
            
            // Add random fish colors
            const colors = [
                'linear-gradient(45deg, #ff8c00, #ffd700)',
                'linear-gradient(45deg, #ff6b6b, #ff8c8c)',
                'linear-gradient(45deg, #4facfe, #00f2fe)',
                'linear-gradient(45deg, #43e97b, #38f9d7)'
            ];
            fish.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            // Random fish size
            const size = 0.8 + Math.random() * 0.4;
            fish.style.transform = `scaleX(-1) scale(${size})`;
            
            this.ocean.appendChild(fish);
            this.fishes.push(fish);

            // Slightly faster speed (0.3-0.6 pixels per frame)
            const speed = 0.3 + Math.random() * 0.3;
            let currentPosition = 0;
            
            const fishInterval = setInterval(() => {
                currentPosition += speed;
                if(currentPosition > 800) {
                    clearInterval(fishInterval);
                    fish.remove();
                    this.fishes = this.fishes.filter(f => f !== fish);
                } else {
                    fish.style.left = `${currentPosition}px`;
                    // Gentle wave movement
                    fish.style.bottom = `${parseFloat(fish.style.bottom) + Math.sin(currentPosition / 100) * 0.1}px`;
                }
            }, 35); // Even slightly faster update interval
        }, 3000); // Spawn fish less frequently
    }

    checkCollision() {
        const hookRect = this.hook.getBoundingClientRect();
        
        this.fishes.forEach(fish => {
            const fishRect = fish.getBoundingClientRect();
            
            if(this.isReeling && 
               hookRect.left < fishRect.right &&
               hookRect.right > fishRect.left &&
               hookRect.bottom > fishRect.top &&
               hookRect.top < fishRect.bottom) {
                this.catchFish(fish);
            }
        });
    }

    catchFish(fish) {
        fish.remove();
        this.fishes = this.fishes.filter(f => f !== fish);
        this.score += 10;
        this.scoreElement.textContent = `Score: ${this.score}`;
    }

    gameLoop() {
        this.checkCollision();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game
new Game(); 