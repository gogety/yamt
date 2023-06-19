<script lang="ts">
	import { channelStatus, type Channel } from "./twitch/TwitchUtils";
  import '@fortawesome/fontawesome-free/js/all.js';
  import '@fortawesome/fontawesome-free/css/all.css';

  export let channels:Array<Channel>=[];
  export let title: string;
  export let hideUnhideChannelHandler = (channel:Channel) => {};
</script>

<div>
  {#if channels.length}
    <div style="color:white; font-size:20px; margin-bottom:10px; margin-top:5px">{title} ({channels.length})</div>
    {#each channels as channel}
      <div class="item">
        <span class="clickable" on:click={() => hideUnhideChannelHandler(channel)}>
          <i  class="fa-regular {channel.isHidden ? 'fa-eye' : 'fa-eye-slash'}"/> 
        </span>
        <i class="fa-solid fa-circle" style="{channel.status == channelStatus.online ? 'color: green' : 'color:red'}"/>
        {channel.name}
      </div>
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