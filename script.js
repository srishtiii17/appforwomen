// Calendar functionality
document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();
    
    // Add click handlers to cards
    const cards = document.querySelectorAll('.card, .card-large');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Card clicked:', this.querySelector('h3').textContent);
            // Add navigation logic here
        });
    });
});

function generateCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;
    
    const currentDate = new Date();
    const currentMonth = 0; // January (0-indexed)
    const currentYear = 2026;
    
    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Adjust for Monday start (0 = Sunday, we want Monday = 0)
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    // Get previous month's last days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    
    // Clear calendar
    calendarDays.innerHTML = '';
    
    // Add previous month's days
    for (let i = adjustedStart - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = prevMonthLastDay - i;
        calendarDays.appendChild(day);
    }
    
    // Add current month's days
    for (let i = 1; i <= totalDays; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        // Mark day 2 as selected (as shown in the design)
        if (i === 2) {
            day.classList.add('selected');
        }
        
        // Add click event
        day.addEventListener('click', function() {
            // Remove previous selection
            document.querySelectorAll('.calendar-day.selected').forEach(d => {
                d.classList.remove('selected');
            });
            // Add selection to clicked day
            this.classList.add('selected');
            
            // Update the information for selected day
            updateDayInfo(i);
        });
        
        calendarDays.appendChild(day);
    }
    
    // Fill remaining days with next month
    const totalCells = calendarDays.children.length;
    const remainingCells = 35 - totalCells; // 5 weeks * 7 days
    
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i < 10 ? '0' + i : i;
        calendarDays.appendChild(day);
    }
}

function updateDayInfo(day) {
    // This function would update the cycle information based on the selected day
    // For now, it's a placeholder for future implementation
    console.log('Selected day:', day);
    
    // Example: You could fetch data from a server or local storage
    // and update the "Today" section with relevant information
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add hover effect to cards
const allCards = document.querySelectorAll('.card, .card-large');
allCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Cycle progress animation
function animateProgress() {
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach((fill, index) => {
        setTimeout(() => {
            fill.style.opacity = '0';
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.opacity = '1';
                fill.style.transition = 'width 1s ease-out';
                // Reset to original width
                if (index === 0) fill.style.width = '25%';
                if (index === 1) fill.style.width = '25%';
                if (index === 2) fill.style.width = '50%';
            }, 50);
        }, index * 200);
    });
}

// Run progress animation on load
window.addEventListener('load', animateProgress);
