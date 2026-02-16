// YouTube iframe API callback
let players = {};
let backdrop;
let videoWrappers;

function onYouTubeIframeAPIReady() {
  backdrop = document.querySelector('.video-backdrop');
  videoWrappers = document.querySelectorAll('.video-wrapper');

  // Create YouTube players
  players.top = new YT.Player('player-top', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });

  players.bottom = new YT.Player('player-bottom', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });

  // Set up click handlers
  videoWrappers.forEach(wrapper => {
    const playerId = wrapper.querySelector('iframe').id;
    const player = players[playerId.replace('player-', '')];
    const overlay = wrapper.querySelector('.video-overlay');

    // Click overlay to expand and play
    overlay.addEventListener('click', () => {
      // Close any other playing videos
      videoWrappers.forEach(w => {
        const wPlayerId = w.querySelector('iframe').id;
        const wPlayer = players[wPlayerId.replace('player-', '')];
        if (wPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
          wPlayer.pauseVideo();
          w.classList.remove('playing');
        }
      });

      // Mark as playing and show backdrop
      wrapper.classList.add('playing');
      backdrop.classList.add('active');

      // Play the video
      player.playVideo();
    });
  });

  // Click backdrop to close video
  backdrop.addEventListener('click', () => {
    Object.values(players).forEach(player => {
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
      }
    });
  });
}

function onPlayerStateChange(event) {
  const iframe = event.target.getIframe();
  const wrapper = iframe.closest('.video-wrapper');

  // When video pauses or ends, reset state
  if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    wrapper.classList.remove('playing');
    backdrop.classList.remove('active');
  }
}
