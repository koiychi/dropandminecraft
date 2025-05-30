// countdown.js
// Calculates time left until October 23, 2025 and updates the #time element

function updateCountdown() {
    const futureDate = new Date('December 31, 2029 23:59:59');
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

// Gallery Modal Logic (minimal, no download/info)
function showGalleryModal(imgSrc) {
    const modal = document.getElementById('galleryModal');
    document.getElementById('galleryModalImg').src = imgSrc;
    modal.classList.remove('d-none');
}

function hideGalleryModal() {
    document.getElementById('galleryModal').classList.add('d-none');
    document.getElementById('galleryModalImg').src = '';
}

Array.from(document.getElementsByClassName('gallery-img')).forEach(function(img) {
    img.addEventListener('click', function() {
        showGalleryModal(img.src);
    });
});

document.getElementById('closeGalleryModal').addEventListener('click', hideGalleryModal);
// Optional: close modal on background click
const galleryModal = document.getElementById('galleryModal');
galleryModal.addEventListener('click', function(e) {
    if (e.target === galleryModal) hideGalleryModal();
});
