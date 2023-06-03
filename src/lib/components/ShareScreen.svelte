<!-- <script lang="ts">
  import { onMount } from 'svelte';
  import adapter from 'webrtc-adapter';

  let localStream;

  onMount(() => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true }) // Request access to screen sharing
      .then(stream => {
        localStream = stream;
      })
      .catch(error => {
        console.error('Error accessing screen sharing:', error);
      });
  });
</script>

<video bind:this={localVideo} autoplay></video> -->
