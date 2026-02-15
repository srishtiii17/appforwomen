// Wellness page with API integrations

// API Integration 1: Quotes API (quotable.io - free, no key required)
// API Integration 2: Health Tips (using Advice Slip API as fallback)
// API Integration 3: Using local data for nutrition tips

document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    fetchDailyQuote();
    loadHealthTips();
    loadNutritionPhase('menstrual');
    loadUserStats();
    
    // Initialize animations
    animateCards();
});

// ==================== API INTEGRATION 1: QUOTES API ====================
async function fetchDailyQuote() {
    const quoteContent = document.getElementById('quoteContent');
    
    try {
        const response = await fetch('https://api.quotable.io/quotes/random?tags=inspirational|wellness|health');
        
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        
        const data = await response.json();
        const quote = data[0];
        
        displayQuote(quote.content, quote.author);
    } catch (error) {
        console.error('Error fetching quote:', error);
        // Fallback to local quotes
        const fallbackQuotes = [
            {
                text: "Your body is your most priceless possession. Take care of it.",
                author: "Jack Lalanne"
            },
            {
                text: "Health is a state of body, wellness is a state of being.",
                author: "J. Stanford"
            },
            {
                text: "Take care of your body. It's the only place you have to live.",
                author: "Jim Rohn"
            },
            {
                text: "Self-care is giving the world the best of you, instead of what's left of you.",
                author: "Katie Reed"
            },
            {
                text: "Wellness is the complete integration of body, mind, and spirit.",
                author: "Greg Anderson"
            }
        ];
        
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        displayQuote(randomQuote.text, randomQuote.author);
    }
}

function displayQuote(text, author) {
    const quoteContent = document.getElementById('quoteContent');
    quoteContent.innerHTML = `
        <p class="quote-text">"${text}"</p>
        <p class="quote-author">— ${author}</p>
    `;
}

function fetchNewQuote() {
    const quoteContent = document.getElementById('quoteContent');
    quoteContent.innerHTML = '<div class="loading">Loading new inspiration...</div>';
    fetchDailyQuote();
}

// ==================== API INTEGRATION 2: HEALTH TIPS ====================
async function loadHealthTips() {
    const tipsContent = document.getElementById('tipsContent');
    
    // Period wellness tips - using local data for accuracy
    const periodTips = [
        {
            title: "Stay Hydrated",
            description: "Drinking plenty of water helps reduce bloating and can ease menstrual cramps. Aim for 8-10 glasses daily."
        },
        {
            title: "Gentle Movement",
            description: "Light exercise like walking or yoga can help reduce period pain and boost your mood through endorphin release."
        },
        {
            title: "Heat Therapy",
            description: "Apply a heating pad to your lower abdomen for 15-20 minutes to relax muscles and relieve cramps."
        },
        {
            title: "Magnesium-Rich Foods",
            description: "Include foods like spinach, almonds, and dark chocolate to help reduce cramps and muscle tension."
        },
        {
            title: "Quality Sleep",
            description: "Aim for 7-9 hours of sleep to help regulate hormones and reduce fatigue during your period."
        },
        {
            title: "Reduce Caffeine",
            description: "Limiting caffeine can help reduce breast tenderness and anxiety during your menstrual cycle."
        }
    ];
    
    // Try to fetch additional tips from API, but use local data as primary source
    try {
        // Using Advice Slip API as supplementary
        const response = await fetch('https://api.adviceslip.com/advice');
        const data = await response.json();
        
        // Add API advice as bonus tip if relevant
        if (data.slip) {
            periodTips.push({
                title: "Wellness Wisdom",
                description: data.slip.advice
            });
        }
    } catch (error) {
        console.log('Using local health tips');
    }
    
    // Display random 4 tips
    const shuffled = periodTips.sort(() => 0.5 - Math.random());
    const selectedTips = shuffled.slice(0, 4);
    
    tipsContent.innerHTML = selectedTips.map((tip, index) => `
        <div class="tip-item" style="animation-delay: ${index * 0.1}s">
            <h3>${tip.title}</h3>
            <p>${tip.description}</p>
        </div>
    `).join('');
}

// ==================== NUTRITION DATA (LOCAL) ====================
const nutritionData = {
    menstrual: [
        { icon: '🥬', name: 'Leafy Greens - Iron boost' },
        { icon: '🐟', name: 'Salmon - Omega-3 for pain relief' },
        { icon: '🍫', name: 'Dark Chocolate - Magnesium & comfort' },
        { icon: '🥜', name: 'Nuts & Seeds - Reduce inflammation' },
        { icon: '🍓', name: 'Berries - Antioxidants' },
        { icon: '🥑', name: 'Avocado - Healthy fats' }
    ],
    follicular: [
        { icon: '🥚', name: 'Eggs - Protein & B vitamins' },
        { icon: '🥦', name: 'Broccoli - Estrogen balance' },
        { icon: '🫐', name: 'Blueberries - Energy boost' },
        { icon: '🌰', name: 'Brazil Nuts - Selenium' },
        { icon: '🥕', name: 'Carrots - Beta-carotene' },
        { icon: '🫘', name: 'Lentils - Plant protein' }
    ],
    ovulation: [
        { icon: '🍊', name: 'Citrus Fruits - Vitamin C' },
        { icon: '🥬', name: 'Spinach - Folate' },
        { icon: '🫐', name: 'Berries - Antioxidants' },
        { icon: '🥜', name: 'Almonds - Vitamin E' },
        { icon: '🫑', name: 'Bell Peppers - Vitamin C' },
        { icon: '🥥', name: 'Coconut - Healthy fats' }
    ],
    luteal: [
        { icon: '🍠', name: 'Sweet Potatoes - Complex carbs' },
        { icon: '🥬', name: 'Dark Leafy Greens - Calcium' },
        { icon: '🍌', name: 'Bananas - B6 for mood' },
        { icon: '🌻', name: 'Sunflower Seeds - Vitamin E' },
        { icon: '🥜', name: 'Chickpeas - Magnesium' },
        { icon: '🍫', name: 'Dark Chocolate - Mood support' }
    ]
};

function showPhase(phase) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load nutrition for phase
    loadNutritionPhase(phase);
}

function loadNutritionPhase(phase) {
    const nutritionContent = document.getElementById('nutritionContent');
    const foods = nutritionData[phase];
    
    nutritionContent.innerHTML = `
        <div class="nutrition-list">
            ${foods.map((food, index) => `
                <div class="nutrition-item" style="animation-delay: ${index * 0.05}s">
                    <span>${food.icon}</span>
                    <span>${food.name}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// ==================== EXERCISE DETAILS ====================
function showExerciseDetails(type) {
    const exercises = {
        yoga: {
            title: 'Gentle Yoga Flow',
            duration: '15-20 minutes',
            benefits: 'Reduces cramps, improves flexibility, calms mind',
            poses: ['Child\'s Pose', 'Cat-Cow', 'Reclined Twist', 'Legs Up The Wall']
        },
        walking: {
            title: 'Light Walking',
            duration: '20-30 minutes',
            benefits: 'Boosts circulation, reduces bloating, improves mood',
            tips: ['Start slow', 'Maintain steady pace', 'Breathe deeply']
        },
        stretching: {
            title: 'Gentle Stretching',
            duration: '10-15 minutes',
            benefits: 'Relieves muscle tension, improves blood flow',
            areas: ['Lower back', 'Hips', 'Legs', 'Shoulders']
        }
    };
    
    const exercise = exercises[type];
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        ">
            <h2 style="font-family: 'Playfair Display', serif; color: #2D2D2D; margin-bottom: 1rem;">
                ${exercise.title}
            </h2>
            <p style="color: #CF7486; font-weight: 600; margin-bottom: 1rem;">
                Duration: ${exercise.duration}
            </p>
            <p style="margin-bottom: 1rem; line-height: 1.6;">
                <strong>Benefits:</strong> ${exercise.benefits}
            </p>
            ${exercise.poses ? `
                <div style="margin-bottom: 1rem;">
                    <strong>Recommended Poses:</strong>
                    <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                        ${exercise.poses.map(pose => `<li>${pose}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${exercise.areas ? `
                <div style="margin-bottom: 1rem;">
                    <strong>Focus Areas:</strong>
                    <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                        ${exercise.areas.map(area => `<li>${area}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <button onclick="this.closest('div[style*=fixed]').remove()" style="
                width: 100%;
                padding: 0.75rem;
                background: linear-gradient(135deg, #CF7486, #B06676);
                color: white;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 1rem;
            ">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ==================== MEDITATION TIMER ====================
function startMeditation(minutes) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(248, 187, 208, 0.95) 0%, rgba(255, 230, 237, 0.95) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.5s ease;
    `;
    
    let remainingSeconds = minutes * 60;
    
    modal.innerHTML = `
        <div style="text-align: center; color: white;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 2rem;">
                Meditation Session
            </h2>
            <div id="meditationTimer" style="
                font-size: 5rem;
                font-weight: 700;
                margin-bottom: 2rem;
                font-family: 'Poppins', sans-serif;
            ">
                ${formatTime(remainingSeconds)}
            </div>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">
                Breathe deeply and relax...
            </p>
            <button id="stopMeditation" style="
                padding: 1rem 2rem;
                background: rgba(255, 255, 255, 0.3);
                color: white;
                border: 2px solid white;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                font-size: 1.1rem;
            ">
                End Session
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const timerInterval = setInterval(() => {
        remainingSeconds--;
        const timerDisplay = document.getElementById('meditationTimer');
        if (timerDisplay) {
            timerDisplay.textContent = formatTime(remainingSeconds);
        }
        
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            completeMeditation(modal, minutes);
        }
    }, 1000);
    
    document.getElementById('stopMeditation').addEventListener('click', () => {
        clearInterval(timerInterval);
        modal.remove();
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function completeMeditation(modal, minutes) {
    modal.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✓</div>
            <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 1rem;">
                Session Complete!
            </h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">
                You meditated for ${minutes} minutes
            </p>
            <button onclick="this.closest('div[style*=fixed]').remove()" style="
                padding: 1rem 2rem;
                background: white;
                color: #CF7486;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                font-size: 1.1rem;
            ">
                Done
            </button>
        </div>
    `;
    
    // Update meditation stats
    updateMeditationStats(minutes);
}

// ==================== USER STATS ====================
function loadUserStats() {
    const stats = JSON.parse(localStorage.getItem('wellnessStats') || '{}');
    
    document.getElementById('daysTracked').textContent = stats.daysTracked || 0;
    document.getElementById('workoutsCompleted').textContent = stats.workouts || 0;
    document.getElementById('meditationMinutes').textContent = stats.meditation || 0;
}

function updateMeditationStats(minutes) {
    const stats = JSON.parse(localStorage.getItem('wellnessStats') || '{}');
    stats.meditation = (stats.meditation || 0) + minutes;
    localStorage.setItem('wellnessStats', JSON.stringify(stats));
    loadUserStats();
}

function trackWater() {
    const stats = JSON.parse(localStorage.getItem('wellnessStats') || '{}');
    stats.waterGlasses = (stats.waterGlasses || 0) + 1;
    localStorage.setItem('wellnessStats', JSON.stringify(stats));
    
    showNotification(`💧 Water logged! Total today: ${stats.waterGlasses} glasses`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #7ED957, #6BC946);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== ANIMATIONS ====================
function animateCards() {
    const cards = document.querySelectorAll('.wellness-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
