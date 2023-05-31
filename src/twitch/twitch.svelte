<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { createEventDispatcher } from 'svelte';
	import { isChannelLive } from './TwitchUtils';
  const dispatch = createEventDispatcher();
  let player:Twitch.Player;
  let isLive:boolean=false;
  let statusChecker: number;
  export let channelName:string= "monstercat"
  export let showChat:boolean = false
  export let onlineHandler = ()=>{};
  export let offlineHandler = ()=>{};
  export let deleteHandler = ()=>{};

  const updateIsLive = async ()=>{
      // debugger;
      // alert("checking if live")
      isLive = await isChannelLive(channelName);
      if (!isLive){
        // alert("updateIsLive returned offline")
        offlineHandler();
        dispatch('twitchready', {data: channelName});
        statusChecker = setTimeout(()=>updateIsLive(),1000);
        player && (player.destroy());
      }
      else{
        player = new Twitch.Embed(`twitch-embed-${channelName}`, {
          width: "100%",
          height: "100%",
          channel: channelName,
          muted: true,
          // Only needed if this page is going to be embedded on other websites
          parent: ["localhost"],
          layout: showChat?"video-with-chat":"video"
        });
        if (player.getEnded()){
          statusChecker = setTimeout(()=>updateIsLive(),1000);
        }
        player.addEventListener(Twitch.Embed.READY,function(){
         // alert("ready");
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
       //   alert("channel is offline !");
          updateIsLive()
          // player && (player.destroy());
        })
        player.addEventListener(Twitch.Player.ONLINE, function(){
          onlineHandler();
        })
      }
      return isLive;
    }

  onMount(async () => {
    updateIsLive()
  })

  function dispose(){
    clearTimeout(statusChecker)
    player && player.destroy();
    deleteHandler(channelName);
  }
  $: {
    if (player){
      player.setChannel(channelName);
    } 
  }
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
<div class="delete" on:click="{dispose}">x</div>

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

  .delete{
    background-color:red
  }
</style>