// Setup form - multi-step navigation with auth integration

let currentStep = 1;
const totalSteps = 3;

document.addEventListener('DOMContentLoaded', function() {
    // Must be logged in to access setup
    const user = localStorage.getItem('erayaUser');
    if (!user) { window.location.href = 'login.html'; return; }

    const userData = JSON.parse(user);
    const users = JSON.parse(localStorage.getItem('erayaUsers') || '{}');

    // If setup already completed, skip to dashboard
    if (users[userData.email] && users[userData.email].setupDone) {
        window.location.href = 'index.html'; return;
    }

    // Pre-fill name from signup
    const nameField = document.getElementById('name');
    if (nameField && userData.name) nameField.value = userData.name;

    // Set max date for last period to today
    const lastPeriodInput = document.getElementById('lastPeriod');
    if (lastPeriodInput) lastPeriodInput.max = new Date().toISOString().split('T')[0];

    updateProgressUI();
    document.getElementById('setupForm').addEventListener('submit', handleSubmit);
});

function nextStep() {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) { currentStep++; updateStepDisplay(); updateProgressUI(); }
}

function prevStep() {
    if (currentStep > 1) { currentStep--; updateStepDisplay(); updateProgressUI(); }
}

function updateStepDisplay() {
    document.querySelectorAll('.form-step').forEach(function(s) { s.classList.remove('active'); });
    var active = document.querySelector('.form-step[data-step="' + currentStep + '"]');
    if (active) active.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressUI() {
    document.querySelectorAll('.progress-step').forEach(function(step, i) {
        var n = i + 1;
        if (n < currentStep) { step.classList.add('completed'); step.classList.remove('active'); }
        else if (n === currentStep) { step.classList.add('active'); step.classList.remove('completed'); }
        else { step.classList.remove('active', 'completed'); }
    });
}

function validateStep(step) {
    var el = document.querySelector('.form-step[data-step="' + step + '"]');
    var valid = true;
    el.querySelectorAll('[required]').forEach(function(f) {
        if (!f.value.trim()) {
            valid = false;
            f.style.borderColor = '#FF6B9D';
            setTimeout(function() { f.style.borderColor = ''; }, 2000);
        }
    });
    if (!valid) showNotification('Please fill in all required fields', 'error');
    return valid;
}

function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    // Collect form data
    var formData = new FormData(e.target);
    var data = {};
    formData.forEach(function(v, k) {
        if (data[k]) {
            data[k] = Array.isArray(data[k]) ? data[k].concat(v) : [data[k], v];
        } else {
            data[k] = v;
        }
    });

    // Calculate next period
    var lp = new Date(data.lastPeriod);
    var cl = parseInt(data.cycleLength) || 28;
    var np = new Date(lp);
    np.setDate(np.getDate() + cl);
    data.nextPeriod = np.toISOString().split('T')[0];
    data.setupComplete = true;

    // Save profile data
    localStorage.setItem('userData', JSON.stringify(data));

    // Mark setupDone for this user (create entry if missing)
    var cu = JSON.parse(localStorage.getItem('erayaUser') || '{}');
    var users = JSON.parse(localStorage.getItem('erayaUsers') || '{}');
    if (cu.email) {
        if (!users[cu.email]) {
            users[cu.email] = { name: cu.name || '', email: cu.email };
        }
        users[cu.email].setupDone = true;
        users[cu.email].profile = data;
        localStorage.setItem('erayaUsers', JSON.stringify(users));
    }

    showSuccessAnimation();

    // Redirect to dashboard after animation
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 2000);
}

function showSuccessAnimation() {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;';
    var box = document.createElement('div');
    box.style.cssText = 'background:white;padding:3rem 4rem;border-radius:24px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);';
    box.innerHTML = '<div style="font-size:4rem;margin-bottom:1rem">&#10003;</div><h2 style="font-size:2rem;color:#2D2D2D;margin-bottom:0.5rem">Welcome to ERAYA!</h2><p style="color:#666">Your wellness journey begins now...</p>';
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function showNotification(msg, type) {
    var n = document.createElement('div');
    n.style.cssText = 'position:fixed;top:20px;right:20px;padding:14px 22px;background:' + (type === 'error' ? '#FF6B9D' : '#4ECDC4') + ';color:white;border-radius:12px;font-weight:600;z-index:10000;font-size:15px;';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(function() { if (n.parentNode) n.remove(); }, 3000);
}
