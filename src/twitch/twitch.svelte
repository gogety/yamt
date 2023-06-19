<script lang="ts">
	import { onMount } from 'svelte';
	import type { Channel } from './TwitchUtils';
  import { channelStatus } from './TwitchUtils';
	let player: Twitch.Player;
  export let channel: Channel;
	export let focusedChannel: Channel;
  export let showChat: boolean = false;
  export let onlineHandler = null;
	export let offlineHandler = null;
	export let deleteHandler = null;
  export let hideHandler = null;
  export let focusHandler = null;


  onMount(async () =>{
    if (channel.status == channelStatus.online){
      loadPlayer();
    }
  })

  let reload = () => {
    player = null;
    loadPlayer();
  }

  let loadPlayer = async () => {
    player = new Twitch.Embed(`twitch-embed-${channel.name}`, {
      width: '100%',
      height: '100%',
      channel: channel.name,
      muted: true,
      // Only needed if this page is going to be embedded on other websites
      parent: ['localhost'],
      layout: showChat ? 'video-with-chat' : 'video'
    });
    player.addEventListener(Twitch.Embed.READY, function () {
      // alert("ready");
      if (showChat) {
        player.setQuality(player.getQuality()[1]);
        document.documentElement.requestFullscreen();
      } else {
        // lazy, for now statically get the second highest
        player.setQuality('480p');
      }
    });
    player.addEventListener(Twitch.Embed.VIDEO_READY, function () {
      window.player = player;
    });
    player.addEventListener(Twitch.Player.OFFLINE, function () {
      offlineHandler();
    });
    player.addEventListener(Twitch.Player.ONLINE, function () {
      onlineHandler();
    });
  }

  let changeChannel = () => {player && player.setChannel(channel.name)};

	$: {
		if (channel.name) {
      changeChannel();
		}
	}
</script>

<div class="controlbar">
  <span class="clickable" on:click={reload}>
    <i class="fa-solid fa-arrows-rotate "/>
  </span>

  {#if focusHandler != null}
    <span class="clickable" on:click={focusHandler}>
      <i class="fa-solid fa-expand "/>
    </span>
  {/if}

  {#if hideHandler != null}
    <span class="clickable" on:click={hideHandler}>
      <i class="fa-solid {channel.isHidden ? 'fa-eye' : 'fa-eye-slash'}"/>
    </span>
  {/if}

  {#if deleteHandler != null}
    <span class="clickable" on:click={deleteHandler}>
      <i class="fa-solid fa-trash "/>
    </span>
  {/if}
</div>

{#if channel != focusedChannel}
  <div class="twitch-embed" id="twitch-embed-{channel.name}">
    {#if channel.status == channelStatus.offline}
    <div>Offline...</div>
    {:else if !player}
    <div>Loading {channel.name} ...</div>
    {/if}
  </div>
{:else}
  <div style="color:white">IN FOCUS</div>
{/if}


<!-- Add a placeholder for the Twitch embed -->
<!-- <div class="twitch-embed" id="twitch-embed-{channelName}"></div> -->
<style>
	.twitch-embed {
		aspect-ratio: 16/9;
	}

	.offline {
		vertical-align: middle;
		text-align: center;
	}

  .controlbar{
    /* width: px; */
    background-color: rgb(45, 45, 45);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    width: 100%;
    justify-content: right;
    vertical-align: middle;
    display: flex;
  }
  .clickable{
		color: white;
    margin-right: 5px;
    margin-top:1px;
  }

  .clickable:hover{
    color: #818181;
  }
</style>
