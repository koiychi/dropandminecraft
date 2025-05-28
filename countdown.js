// countdown.js
// Calculates time left until October 23, 2025 and updates the #time element

function updateCountdown() {
    const futureDate = new Date('October 23, 2025 00:00:00');
    const now = new Date();
    let diff = futureDate - now;

    if (diff < 0) {
        document.getElementById('time').textContent = 'Time capsule opened!';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    document.getElementById('time').textContent = `${days} days | ${hours} hours | ${minutes} minutes | ${seconds.toString().padStart(2, '0')} seconds`;
}

// Animate hourglass rotation on each second change
let hourglassRotation = 0;
function rotateHourglass() {
    hourglassRotation += 180;
    const hourglass = document.getElementById('hourglass');
    if (hourglass) {
        hourglass.style.transform = `rotate(${hourglassRotation}deg)`;
    }
}

// Patch updateCountdown to rotate hourglass every second
const originalUpdateCountdown = updateCountdown;
updateCountdown = function() {
    originalUpdateCountdown();
    rotateHourglass();
}

setInterval(updateCountdown, 1000);
updateCountdown();

document.getElementById('joinServerBtn').addEventListener('click', function(e) {
    e.preventDefault();
    const section = document.getElementById('joinServerSection');
    section.classList.toggle('d-none');
    section.scrollIntoView({ behavior: 'smooth' });
});

// Close button for Join Server overlay
const closeBtn = document.getElementById('closeJoinServer');
if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        document.getElementById('joinServerSection').classList.add('d-none');
    });
}
