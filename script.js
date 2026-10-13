document.addEventListener('DOMContentLoaded', () => {
    // State variables
    let currentSpread = 1;
    const totalSpreads = 3;
    let isMusicPlaying = false;

    // DOM Elements
    const screenClosedBook = document.getElementById('screen-closed-book');
    const screenBookReader = document.getElementById('screen-book-reader');
    const screenCelebration = document.getElementById('screen-celebration');
    
    const openBookTrigger = document.getElementById('openBookTrigger');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageIndicatorText = document.getElementById('pageIndicatorText');
    const readAgainBtn = document.getElementById('readAgainBtn');

    const spread1 = document.getElementById('spread-1');
    const spread2 = document.getElementById('spread-2');
    const spread3 = document.getElementById('spread-3');

    // Audio elements
    const audioBookOpen = document.getElementById('audioBookOpen');
    const audioPageTurn = document.getElementById('audioPageTurn');
    const audioBookClose = document.getElementById('audioBookClose');
    const audioBirthdaySong = document.getElementById('audioBirthdaySong');

    // Safe audio play helper for sound effects
    function safePlay(audioElem) {
        if (audioElem) {
            audioElem.currentTime = 0;
            audioElem.play().catch(e => {
                console.log("Audio FX playback prevented or missing file:", e);
            });
        }
    }

    // Play Birthday Song (Triggered on opening book)
    function startBirthdaySong() {
        if (audioBirthdaySong) {
            audioBirthdaySong.play().then(() => {
                isMusicPlaying = true;
            }).catch(e => {
                console.log("Birthday song playback prevented by browser:", e);
            });
        }
    }

    // Stop Birthday Song
    function stopBirthdaySong() {
        if (audioBirthdaySong) {
            audioBirthdaySong.pause();
            audioBirthdaySong.currentTime = 0;
            isMusicPlaying = false;
        }
    }

    // Pause music if user switches tab / minimizes window, resume when active
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (isMusicPlaying && audioBirthdaySong) {
                audioBirthdaySong.pause();
            }
        } else {
            if (isMusicPlaying && audioBirthdaySong) {
                audioBirthdaySong.play().catch(e => console.log("Resume audio blocked:", e));
            }
        }
    });

    // Floating petals generator
    function createFloatingParticles() {
        setInterval(() => {
            if (document.hidden) return;
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.width = (Math.random() * 10 + 8) + 'px';
            particle.style.height = (Math.random() * 14 + 10) + 'px';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            document.body.appendChild(particle);
            setTimeout(() => {
                particle.remove();
            }, 6000);
        }, 800);
    }
    createFloatingParticles();

    // Screen Switcher
    function showScreen(screenId) {
        [screenClosedBook, screenBookReader, screenCelebration].forEach(s => {
            if (s) s.classList.remove('active');
        });
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) activeScreen.classList.add('active');
    }

    // Open Book Interaction
    openBookTrigger.addEventListener('click', () => {
        safePlay(audioBookOpen);
        startBirthdaySong(); // Song begins playing immediately upon clicking the book
        showScreen('screen-book-reader');
        currentSpread = 1;
        updateSpreadDisplay();
    });

    // Update Spread view and indicator
    function updateSpreadDisplay() {
        if (spread1) spread1.style.display = 'none';
        if (spread2) spread2.style.display = 'none';
        if (spread3) spread3.style.display = 'none';

        if (currentSpread === 1) {
            if (spread1) spread1.style.display = 'flex';
            if (pageIndicatorText) pageIndicatorText.textContent = 'Pages 1–2 of 6';
            if (prevPageBtn) prevPageBtn.textContent = '← Cover';
            if (nextPageBtn) nextPageBtn.textContent = 'Next Page →';
        } else if (currentSpread === 2) {
            if (spread2) spread2.style.display = 'flex';
            if (pageIndicatorText) pageIndicatorText.textContent = 'Pages 3–4 of 6';
            if (prevPageBtn) prevPageBtn.textContent = '← Previous';
            if (nextPageBtn) nextPageBtn.textContent = 'Next Page →';
        } else if (currentSpread === 3) {
            if (spread3) spread3.style.display = 'flex';
            if (pageIndicatorText) pageIndicatorText.textContent = 'Pages 5–6 of 6';
            if (prevPageBtn) prevPageBtn.textContent = '← Previous';
            if (nextPageBtn) nextPageBtn.textContent = 'Close the Book ♡';
        }
    }

    // Next Page / Spread Navigation
    nextPageBtn.addEventListener('click', () => {
        safePlay(audioPageTurn);
        if (currentSpread < totalSpreads) {
            currentSpread++;
            updateSpreadDisplay();
        } else {
            // Final Spread -> Close Book & Celebration
            safePlay(audioBookClose);
            showScreen('screen-celebration');
        }
    });

    // Previous Page / Spread Navigation
    prevPageBtn.addEventListener('click', () => {
        safePlay(audioPageTurn);
        if (currentSpread > 1) {
            currentSpread--;
            updateSpreadDisplay();
        } else {
            // Return to closed book landing page
            showScreen('screen-closed-book');
        }
    });

    // Read Again Reset Button
    readAgainBtn.addEventListener('click', () => {
        stopBirthdaySong(); // Stop and reset music on restart
        currentSpread = 1;
        showScreen('screen-closed-book');
    });
});