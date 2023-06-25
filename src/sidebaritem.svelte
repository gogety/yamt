<script lang="ts">
	import { channelStatus, type Channel, EmbedMode } from "./twitch/TwitchUtils";
  import '@fortawesome/fontawesome-free/js/all.js';
  import '@fortawesome/fontawesome-free/css/all.css';
	import Twitch from "./twitch/twitch.svelte";

  export let channels:Array<Channel>=[];
  export let title: string;
  export let hideUnhideChannelHandler = (channel:Channel) => {};
  export let deleteChannelHandler = (channel:Channel) => {}
  // let selectedChannel:Channel;
  let previewChannel = (channel:Channel)=>{
    if (channel.preview){
      channel.preview = !channel.preview;
    }
    else{
      channel.preview = true;
    }
    channels = channels;
    // if (selectedChannel===channel){
    //   selectedChannel=null
    // }
    // else{
    //   selectedChannel=channel
    // }
  }
</script>

<div>
  {#if channels.length}
    <div style="color:white; font-size:20px; margin-bottom:10px; margin-top:5px">{title} ({channels.length})</div>
    {#each channels as channel, index(channel)}
      <div class="item">
        {#if channel.status == channelStatus.online && channel.isHidden}
          <span title="preview" class="clickable" on:click={() => previewChannel(channel)}>
            <i class="fa-solid fa-magnifying-glass"/> 
          </span>
        {/if}
        <span title="mute/unmute" class="clickable" on:click={() => hideUnhideChannelHandler(channel)}>
          <i class="fa-regular {channel.isHidden ? 'fa-eye' : 'fa-eye-slash'}" /> 
        </span>
        <span title="remove" class="clickable" on:click={() => deleteChannelHandler(channel)}>
          <i class="fa-solid fa-trash"/> 
        </span>
        <i class="fa-solid fa-circle" style="{channel.status == channelStatus.online ? 'color: green' : 'color:red'}"/>
        <span>{channel.name}</span>
      </div>
      {#if channel.preview && channel.status == channelStatus.online}
        <div style="padding-right:10px">
          <Twitch channel={channel} mode={EmbedMode.preview}/>
        </div>
      {/if}
    {/each}
  {/if}
</div>

<style>
  .item{
    color:  white;
    height: 30px;
  }
  .clickable{
    color:  #818181;
  }
  .clickable:hover{
    color: white;
  }
  body {
    font-family: "Lato", sans-serif;
  }
</style>