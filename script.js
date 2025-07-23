function playPronunciation() {
  const audio = new Audio('https://media.merriam-webster.com/audio/prons/en/us/mp3/gg/ggever03.mp3');
  audio.play().catch(error => {
    console.error('Audio playback failed:', error);
  });
}