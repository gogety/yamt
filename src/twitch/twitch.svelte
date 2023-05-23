<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
	import { isChannelLive } from './TwitchUtils';
  const dispatch = createEventDispatcher();
  let player:Twitch.Player;
  let isLive:boolean=false;
  export let channelName:string= "monstercat"
  export let showChat:boolean = false
  export let onlineHandler = ()=>{};
  export let offlineHandler = ()=>{};

  const updateIsLive = async ()=>{
      isLive = await isChannelLive(channelName);
      if (!isLive){
        offlineHandler();
        dispatch('twitchready', {data: channelName});
        setTimeout(()=>updateIsLive(),60000);
      }
      return isLive;
    }

  onMount(async () => {
    updateIsLive()
  })
  $: {
    if (player){
      player.setChannel(channelName);
    } 
  }
  $: {
    if(isLive){
      player = new Twitch.Embed(`twitch-embed-${channelName}`, {
        width: "100%",
        height: "100%",
        channel: channelName,
        muted: true,
        // Only needed if this page is going to be embedded on other websites
        parent: ["localhost"],
        layout: showChat?"video-with-chat":"video"
      });
      player.addEventListener(Twitch.Embed.READY,function(){
        if (showChat){
          player.setQuality(player.getQuality()[1])
          document.documentElement.requestFullscreen();
        }
        else{
          // lazy, for now statically get the second highest 
          player.setQuality('480p');
        }
        dispatch('twitchready', {data: channelName});
      })
      player.addEventListener(Twitch.Embed.VIDEO_READY, function(){
        window.player=player;
      })
      player.addEventListener(Twitch.Player.OFFLINE, function(){
        // alert("channel is offline !");
        updateIsLive()
      })
      player.addEventListener(Twitch.Player.ONLINE, function(){
        onlineHandler();
      })
    }
   };
</script>

<div class="twitch-embed" id="twitch-embed-{channelName}">
  {#await updateIsLive}
  <div> Loading... </div>
  {:then}
    {#if !isLive}
    <div class="offline">{channelName} is offline!</div>
    {/if}
  {/await}
</div>

<!-- Add a placeholder for the Twitch embed -->
<!-- <div class="twitch-embed" id="twitch-embed-{channelName}"></div> -->
<style>
   .twitch-embed {
		aspect-ratio: 16/9;
	}

  .offline{
    vertical-align: middle;
    text-align: center;
  }
</style>