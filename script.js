document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Live Counter ---
    function initCounter() {
        const startDate = new Date(2019, 9, 1, 0, 0, 0); // Octubre 2019

        const dEl = document.getElementById('c-days');
        const hEl = document.getElementById('c-hours');
        const mEl = document.getElementById('c-minutes');
        const sEl = document.getElementById('c-seconds');

        function updateCounter() {
            const now = new Date();
            const diff = now - startDate;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            dEl.textContent = days;
            hEl.textContent = hours.toString().padStart(2, '0');
            mEl.textContent = minutes.toString().padStart(2, '0');
            sEl.textContent = seconds.toString().padStart(2, '0');
        }

        updateCounter();
        setInterval(updateCounter, 1000);
    }
    initCounter();

    // --- 2. Manual Carousel Logic ---
    function initCarousel() {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (slides.length === 0) return;

        let currentIndex = 0;

        function goToSlide(index) {
            // Remove active class from current slide
            const currentSlide = slides[currentIndex];
            currentSlide.classList.remove('active');
            
            // If it's a video, pause it when it hides
            const currentVideo = currentSlide.querySelector('video');
            if (currentVideo) {
                currentVideo.pause();
                currentVideo.currentTime = 0; // reset
            }

            // Move to next slide
            currentIndex = index;
            
            // Add active class to new slide
            const newSlide = slides[currentIndex];
            newSlide.classList.add('active');
            
            // If it's a video, play it
            const newVideo = newSlide.querySelector('video');
            const bgAudio = document.getElementById('bg-music');
            if (newVideo) {
                newVideo.play().catch(e => console.log("Video auto-play prevented"));
                if (bgAudio) bgAudio.volume = 0.3; // Lower volume by 70%
            } else {
                if (bgAudio) bgAudio.volume = 1.0; // Restore full volume
            }
        }

        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = slides.length - 1;
            goToSlide(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            let newIndex = (currentIndex + 1) % slides.length;
            goToSlide(newIndex);
        });

        // Initialize first slide (play video if it is one)
        const initVideo = slides[0].querySelector('video');
        const bgAudio = document.getElementById('bg-music');
        if(initVideo) {
            initVideo.play().catch(e => console.log("Init video auto-play prevented"));
            if (bgAudio) bgAudio.volume = 0.3;
        } else {
            if (bgAudio) bgAudio.volume = 1.0;
        }
    }
    initCarousel();

    // --- 3. Audio Control ---
    const audioBtn = document.getElementById('audio-btn');
    const audio = document.getElementById('bg-music');
    const iconMute = document.getElementById('icon-mute');
    const iconUnmute = document.getElementById('icon-unmute');

    let isPlaying = false;

    audioBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.play().then(() => {
                isPlaying = true;
                iconMute.style.display = 'none';
                iconUnmute.style.display = 'block';
            }).catch(e => console.log("Audio play failed:", e));
        }
        
        if (isPlaying) {
            iconMute.style.display = 'none';
            iconUnmute.style.display = 'block';
        } else {
            iconMute.style.display = 'block';
            iconUnmute.style.display = 'none';
        }
    });

    // --- 4. Floating Heart Effect ---
    document.addEventListener('click', (e) => {
        // Prevent heart on interactive elements
        const isInteractive = e.target.closest('button') || 
                              e.target.closest('.carousel-section') ||
                              ['A', 'INPUT', 'TEXTAREA', 'SELECT', 'VIDEO', 'IMG'].includes(e.target.tagName);
        
        if (isInteractive) return;

        const heart = document.createElement('img');
        heart.src = 'assets/Corazon_png_vector.png';
        heart.classList.add('floating-heart');
        
        // Position at click (centered roughly for a 40x40 image)
        heart.style.left = `${e.clientX - 20}px`;
        heart.style.top = `${e.clientY - 20}px`;
        
        document.body.appendChild(heart);
        
        // Remove after animation (1500ms)
        setTimeout(() => {
            heart.remove();
        }, 1500);
    });
});
