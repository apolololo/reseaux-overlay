// Timer configuration handling
export function initializeTimerConfig() {
  const timerOptions = document.querySelector('.timer-options');
  const timerMinutes = document.getElementById('timer-minutes');
  const timerSeconds = document.getElementById('timer-seconds');
  const applyTimer = document.getElementById('apply-timer');
  const previewFrame = document.getElementById('overlay-preview');

  // Load saved timer settings
  loadTimerSettings();

  // Show timer options only for Starting Soon overlay
  document.querySelectorAll('.overlay-item').forEach(item => {
    item.addEventListener('click', () => {
      const isStartingOverlay = item.dataset.url.includes('starting');
      timerOptions.style.display = isStartingOverlay ? 'block' : 'none';
    });
  });

  // Handle timer application
  applyTimer.addEventListener('click', () => {
    const minutes = parseInt(timerMinutes.value) || 0;
    const seconds = parseInt(timerSeconds.value) || 0;
    const totalSeconds = (minutes * 60) + seconds;

    // Save settings
    saveTimerSettings(minutes, seconds);

    // Update preview URL with new duration
    if (previewFrame) {
      const currentUrl = new URL(previewFrame.src);
      currentUrl.searchParams.set('duration', totalSeconds);
      previewFrame.src = currentUrl.toString();
    }
  });
}

function saveTimerSettings(minutes, seconds) {
  localStorage.setItem('timerSettings', JSON.stringify({ minutes, seconds }));
}

function loadTimerSettings() {
  const timerMinutes = document.getElementById('timer-minutes');
  const timerSeconds = document.getElementById('timer-seconds');
  const settings = localStorage.getItem('timerSettings');

  if (settings) {
    const { minutes, seconds } = JSON.parse(settings);
    timerMinutes.value = minutes;
    timerSeconds.value = seconds;
  }
}
