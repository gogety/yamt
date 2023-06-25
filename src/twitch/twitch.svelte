<script lang="ts">
	import { onMount } from 'svelte';
	import { type Channel, EmbedMode } from './TwitchUtils';
  import { channelStatus } from './TwitchUtils';
	let player: Twitch.Player;
  export let channel: Channel;
	export let focusedChannel: Channel = null;
  export let mode:EmbedMode = EmbedMode.tile;
  export let onlineHandler = () => {};
	export let offlineHandler = () => {};
	export let deleteHandler = null;
  export let hideHandler = null;
  export let focusHandler = null;
  let currentlyFocused:boolean;

  onMount(async () =>{
    if (channel.status == channelStatus.online){
      loadPlayer();
    }
  })

  let reload = () => {
    if (player) { player.destroy();}
    loadPlayer();
  }

  let loadPlayer = async () => {
    player = new Twitch.Embed(`twitch-embed-${channel.name}-${mode}`, {
      width: '100%',
      height: '100%',
      channel: channel.name,
      muted: true,
      // Only needed if this page is going to be embedded on other websites
      parent: ['localhost'],
      layout: mode==EmbedMode.focus ? 'video-with-chat' : 'video'
    });
    player.addEventListener(Twitch.Embed.READY, function () {
      // alert("ready");
      switch (mode){
        case EmbedMode.focus:
          document.documentElement.requestFullscreen();
          player.setQuality(player.getQuality()[1]);
          break;
        case EmbedMode.tile:
          player.setQuality('480p');
          break;
        case EmbedMode.preview:
          // const availableQualities = player.getQuality();
          player.setQuality('160p')
          break;
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
      window.player = player;
    });
  }

  let changeChannel = () => {player && player.setChannel(channel.name)};

	$: {
		if (channel.name) {
      changeChannel();
		}
	}

  $: {
    if (focusedChannel==channel){
      currentlyFocused = true;
    }
    else if (currentlyFocused){
      currentlyFocused = false;
      setTimeout(reload, 0); ;
    }
  }
</script>

{#if mode!=EmbedMode.preview}
  <div style="display: flex">
    <label style="color:white; padding-left: 3px">{channel.name}</label>
    <div class="controlbar">
      <span title="reload" class="clickable" on:click={reload}>
        <i class="fa-solid fa-arrows-rotate "/>
      </span>

      {#if focusHandler != null}
        <span title="focus/unfocus" class="clickable" on:click={focusHandler}>
          <i class="fa-solid fa-expand "/>
        </span>
      {/if}

      {#if hideHandler != null}
        <span title="mute/unmute" class="clickable" on:click={hideHandler}>
          <i class="fa-solid {channel.isHidden ? 'fa-eye' : 'fa-eye-slash'}"/>
        </span>
      {/if}

      {#if deleteHandler != null}
        <span title="remove" class="clickable" on:click={deleteHandler}>
          <i class="fa-solid fa-trash "/>
        </span>
      {/if}
    </div>
  </div>
{/if}

{#if channel !== focusedChannel}
  <div class="twitch-embed" id="twitch-embed-{channel.name}-{mode}">
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
