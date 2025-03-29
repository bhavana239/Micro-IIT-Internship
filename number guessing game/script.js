class NumberGuessingGame {
    constructor() {
        this.minNumber = 1;
        this.maxNumber = 100;
        this.maxAttempts = 10;
        this.attemptsLeft = this.maxAttempts;
        this.targetNumber = this.generateRandomNumber();
        this.guessHistory = [];
        
        // DOM Elements
        this.guessInput = document.getElementById('guess-input');
        this.guessBtn = document.getElementById('guess-btn');
        this.messageElement = document.getElementById('message');
        this.attemptsElement = document.getElementById('attempts');
        this.historyElement = document.getElementById('history');
        this.newGameBtn = document.getElementById('new-game');
        
        // Bind event listeners
        this.guessBtn.addEventListener('click', () => this.makeGuess());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        
        // Initialize game
        this.updateUI();
    }

    generateRandomNumber() {
        return Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) + this.minNumber;
    }

    makeGuess() {
        const guess = parseInt(this.guessInput.value);
        
        // Validate input
        if (isNaN(guess) || guess < this.minNumber || guess > this.maxNumber) {
            this.showMessage('Please enter a valid number!', 'error');
            this.guessInput.classList.add('shake');
            setTimeout(() => this.guessInput.classList.remove('shake'), 500);
            return;
        }

        // Process guess
        this.attemptsLeft--;
        this.guessHistory.push(guess);
        
        // Check if guess is correct
        if (guess === this.targetNumber) {
            this.showMessage(`🎉 Congratulations! You've guessed the number ${this.targetNumber}!`, 'success');
            this.endGame(true);
        } else if (this.attemptsLeft === 0) {
            this.showMessage(`Game Over! The number was ${this.targetNumber}`, 'error');
            this.endGame(false);
        } else {
            const hint = guess < this.targetNumber ? 'Too low! ⬆️' : 'Too high! ⬇️';
            this.showMessage(hint, 'error');
        }

        this.updateUI();
    }

    showMessage(text, type) {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
    }

    updateUI() {
        // Update attempts display
        this.attemptsElement.textContent = this.attemptsLeft;
        
        // Update history
        this.historyElement.innerHTML = this.guessHistory
            .map((guess, index) => {
                const result = guess === this.targetNumber ? '🎯 Correct!' :
                             guess < this.targetNumber ? '⬆️ Too low' : '⬇️ Too high';
                return `<div class="history-item">Guess ${index + 1}: ${guess} - ${result}</div>`;
            })
            .join('');
        
        // Scroll history to bottom
        this.historyElement.scrollTop = this.historyElement.scrollHeight;
    }

    endGame(won) {
        this.guessBtn.disabled = true;
        this.guessInput.disabled = true;
        this.newGameBtn.style.display = 'block';
    }

    startNewGame() {
        this.targetNumber = this.generateRandomNumber();
        this.attemptsLeft = this.maxAttempts;
        this.guessHistory = [];
        this.guessInput.value = '';
        this.guessInput.disabled = false;
        this.guessBtn.disabled = false;
        this.newGameBtn.style.display = 'none';
        this.showMessage('', '');
        this.updateUI();
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new NumberGuessingGame();
}); 