<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let player:Twitch.Player;
  export let channelName:string= "monstercat"
  export let showChat:boolean = false
  export let onlineHandler = ()=>{};
  export let offlineHandler = ()=>{};

  onMount(async () => {
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
      // alert (`sending ${channelName}`)
      dispatch('twitchready', {data: channelName});
    })
    player.addEventListener(Twitch.Embed.VIDEO_READY, function(){
      window.player=player;
    })
    player.addEventListener(Twitch.Player.OFFLINE, function(){
      // alert("channel is offline !");
      offlineHandler();
    })
    player.addEventListener(Twitch.Player.ONLINE, function(){
      onlineHandler();
    })
  })
  $: {
    if (player){
      player.setChannel(channelName);
    } 
  }
</script>
<div class="twitch-embed" id="twitch-embed-{channelName}"></div>
<!-- Add a placeholder for the Twitch embed -->
<!-- <div class="twitch-embed" id="twitch-embed-{channelName}"></div> -->
<style>
   .twitch-embed {
		aspect-ratio: 16/9;
	}
</style>