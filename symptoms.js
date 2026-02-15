// Symptoms tracking with local storage

let selectedSymptoms = {};

document.addEventListener('DOMContentLoaded', function() {
    // Load previously saved symptoms
    loadSavedSymptoms();
    
    // Add click handlers to all chips
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            toggleChip(this);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        filterSymptoms(this.value);
    });
    
    // Initialize the selected items display
    updateSelectedDisplay();
});

function toggleChip(chip) {
    const category = chip.getAttribute('data-category');
    const value = chip.getAttribute('data-value');
    
    // Toggle selected state
    chip.classList.toggle('selected');
    
    // Update selected symptoms object
    if (chip.classList.contains('selected')) {
        if (!selectedSymptoms[category]) {
            selectedSymptoms[category] = [];
        }
        selectedSymptoms[category].push({
            value: value,
            label: chip.textContent.trim()
        });
    } else {
        if (selectedSymptoms[category]) {
            selectedSymptoms[category] = selectedSymptoms[category].filter(
                item => item.value !== value
            );
            if (selectedSymptoms[category].length === 0) {
                delete selectedSymptoms[category];
            }
        }
    }
    
    // Update the selected items display
    updateSelectedDisplay();
}

function updateSelectedDisplay() {
    const selectedItemsContainer = document.getElementById('selectedItems');
    
    // Clear current display
    selectedItemsContainer.innerHTML = '';
    
    // Check if any symptoms are selected
    const hasSelections = Object.keys(selectedSymptoms).length > 0;
    
    if (!hasSelections) {
        selectedItemsContainer.innerHTML = '<p class="empty-state">Select symptoms to track</p>';
        return;
    }
    
    // Display selected symptoms by category
    Object.entries(selectedSymptoms).forEach(([category, items]) => {
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'selected-item';
            itemDiv.innerHTML = `
                <span>${item.label}</span>
                <button class="remove-btn" onclick="removeSymptom('${category}', '${item.value}')">×</button>
            `;
            selectedItemsContainer.appendChild(itemDiv);
        });
    });
}

function removeSymptom(category, value) {
    // Remove from selected symptoms
    if (selectedSymptoms[category]) {
        selectedSymptoms[category] = selectedSymptoms[category].filter(
            item => item.value !== value
        );
        if (selectedSymptoms[category].length === 0) {
            delete selectedSymptoms[category];
        }
    }
    
    // Remove selected class from chip
    const chip = document.querySelector(`[data-category="${category}"][data-value="${value}"]`);
    if (chip) {
        chip.classList.remove('selected');
    }
    
    // Update display
    updateSelectedDisplay();
}

function filterSymptoms(searchTerm) {
    const chips = document.querySelectorAll('.chip');
    const categories = document.querySelectorAll('.symptom-category');
    
    searchTerm = searchTerm.toLowerCase();
    
    if (searchTerm === '') {
        // Show all
        chips.forEach(chip => chip.style.display = 'inline-flex');
        categories.forEach(cat => cat.style.display = 'block');
        return;
    }
    
    // Filter chips
    categories.forEach(category => {
        let hasVisibleChips = false;
        const categoryChips = category.querySelectorAll('.chip');
        
        categoryChips.forEach(chip => {
            const text = chip.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                chip.style.display = 'inline-flex';
                hasVisibleChips = true;
            } else {
                chip.style.display = 'none';
            }
        });
        
        // Hide category if no visible chips
        category.style.display = hasVisibleChips ? 'block' : 'none';
    });
}

function saveSymptoms() {
    // Get current date
    const today = new Date().toISOString().split('T')[0];
    
    // Save to localStorage
    const symptomsData = {
        date: today,
        symptoms: selectedSymptoms,
        timestamp: new Date().toISOString()
    };
    
    // Get existing data
    let allSymptoms = JSON.parse(localStorage.getItem('symptomsData') || '{}');
    
    // Add today's data
    allSymptoms[today] = symptomsData;
    
    // Save back to localStorage
    localStorage.setItem('symptomsData', JSON.stringify(allSymptoms));
    
    // Show success message
    showSuccessMessage();
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function loadSavedSymptoms() {
    const today = new Date().toISOString().split('T')[0];
    const allSymptoms = JSON.parse(localStorage.getItem('symptomsData') || '{}');
    
    if (allSymptoms[today]) {
        selectedSymptoms = allSymptoms[today].symptoms;
        
        // Mark chips as selected
        Object.entries(selectedSymptoms).forEach(([category, items]) => {
            items.forEach(item => {
                const chip = document.querySelector(`[data-category="${category}"][data-value="${item.value}"]`);
                if (chip) {
                    chip.classList.add('selected');
                }
            });
        });
        
        updateSelectedDisplay();
    }
}

function showSuccessMessage() {
    // Create success message element
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #7ED957, #6BC946);
        color: white;
        padding: 2rem 3rem;
        border-radius: 20px;
        font-size: 1.2rem;
        font-weight: 600;
        box-shadow: 0 8px 32px rgba(126, 217, 87, 0.3);
        z-index: 9999;
        animation: popIn 0.3s ease;
    `;
    message.textContent = '✓ Symptoms Saved Successfully!';
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popIn {
            0% {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(message);
    
    // Remove after animation
    setTimeout(() => {
        message.style.animation = 'popIn 0.3s ease reverse';
        setTimeout(() => message.remove(), 300);
    }, 1200);
}

// Navigation active state
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    if (item.getAttribute('href') === 'symptoms.html' || 
        item.getAttribute('href') === 'mycycle.html') {
        item.classList.add('active');
    }
});
