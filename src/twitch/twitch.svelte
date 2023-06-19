<script lang="ts">
	import { onMount } from 'svelte';
	import type { Channel } from './TwitchUtils';
  import { channelStatus } from './TwitchUtils';
	let player: Twitch.Player;
  export let channel: Channel;
	export let showChat: boolean = false;
	export let onlineHandler = () => {};
	export let offlineHandler = () => {};
	export let deleteHandler = () => {};
  export let hideHandler = () => {};
  export let focusHandler = () => {};

  onMount(async () =>{
    if (channel.status == channelStatus.online){
      loadPlayer();
    }
  })

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

<div class="twitch-embed" id="twitch-embed-{channel.name}">
  {#if channel.status == channelStatus.offline}
    <div>Offline...</div>
	{:else if !player}
		<div>Loading {channel.name} ...</div>
	{/if}
</div>
<div class="delete" on:click={deleteHandler}>x</div>
<div class="hide" on:click={hideHandler}>h</div>

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

	.delete {
		background-color: red;
	}

  .hide {
		background-color: yellow;
	}
</style>
