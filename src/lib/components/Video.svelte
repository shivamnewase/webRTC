<script lang="ts">
  import video from "$lib/directive/video";
  import PhoneIcon from "$lib/icons/PhoneIcon.svelte";
  import PhoneIcommingIcon from "../../lib/icons/PhoneIcommingIcon.svelte";
  import MicIcon from "../../lib/icons/MicIcon.svelte";
  import MicOffIcon from "../../lib/icons/MicOffIcon.svelte";
  import VideoOffIcon from "../../lib/icons/VideoOffIcon.svelte";
  import VideoOnIcon from "../../lib/icons/VideoOnIcon.svelte";

  export let stream: MediaStream;
  export let user: string;
  export let isCurrentUser: boolean = false;
  export let isUserCameraOn: boolean = true;
  export let isUserMicOn: boolean = true;
  export function toggleCamera(){

  }
 
</script>

{#if stream}
<div class="flex">
  <div class="w-9/12">
    <video
      use:video={stream}
      class="w-full h-[760px] rounded-md"
      autoPlay
      playsinline
      controls={false}
    >
      <track kind="captions" />
    </video>
    {#if user}
      <div
        class="absolute right-0 text-sm left-0 bottom-0 h-8 bg-gray-900/60 backdrop-blur-md flex items-center text-white px-2 rounded-b-md"
      >
        {#if isCurrentUser}
          You
        {:else}
          Remote
        {/if}

        ({user})
      </div>
    {/if}
  </div>
  <div class="w-3/12 height-[650px] justify-center bg-gray-400 ">
    
   <h1>User List</h1>
   
   
  
  
</div>
</div>
{/if}
