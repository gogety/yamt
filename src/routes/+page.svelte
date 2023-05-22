<script lang="ts">
  import Grid from '../grid/grid.svelte'
  let addChannel=()=>{
    const currentValue = document.getElementById("channel_name").value;
    if (!channels.includes(currentValue)){
      channels.push(currentValue);
      channels=channels;
    }
  }
  // import Twitch from '../twitch/TwitchChannelEmbed.svelte';
  export let channels: Array<string> = ['davegrecoart','dzikawa','monstercat'];
  export let offlineChannels: Array<string>=[]; 
  let displayOfflineChannels = false;
</script>

<input type="text" id="channel_name"/>
<button on:click="{()=>addChannel()}" >Add</button>
<input type="checkbox" bind:checked={displayOfflineChannels}/>
  <label style="color: white;">Display offline channels</label>
<Grid displayOfflineChannels={displayOfflineChannels} channels={channels}></Grid>

<style>

</style>