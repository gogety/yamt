<script lang="ts">
	import { tick } from 'svelte';
  import Grid from '../grid/grid.svelte'

  let pool:string[] = []
  const MAXPOOL = 10;
  let channelsToAdd:string[]=[];

  let handleTwitchReady= (event:CustomEvent)=>
  {
    const channel = event.detail.data;
    if (pool.includes(channel)){
      // alert(`freeing ${channel}`) 
      pool = pool.filter(e=>e!=channel);
    }
  }

  let addChannel=()=>{
    let currentValue:string = document.getElementById("channel_name").value;

    try{
      currentValue= JSON.parse(currentValue);
    }
    catch{ }

    channelsToAdd = Array.isArray(currentValue)?[...currentValue]:[currentValue];
    // typeof(currentValue) =="Array"{
    //   channelsToAdd = currentValue;
    // }
    // else{
    //   channelsToAdd = [currentValue];
    // }
    debugger;
    
    // easiest but also can be too much in one shot
    // onlineChannels=[...new Set([...onlineChannels, ...channelsToAdd])];
    
    // lazy buffering
    // const addChannelSlowly = () => {
    //   if (channelsToAdd.length > 0){
    //     if(pool.length < MAXPOOL){
    //       const channel = channelsToAdd.shift();
    //       channelsToAdd = channelsToAdd;
    //       channel && !channels.includes(channel) && channels.push(channel) && (channels = channels) && (pool.push(channel))
    //     }
    //     setTimeout(addChannelSlowly,100)
    //   }
    // }
    // addChannelSlowly();

    // best buffering would be to have a "pool" and wait for the events to free more space
    
    // if (!channels.includes(currentValue)){
      // channels.push(currentValue);
      // }
    }

  // Sort of recursion with tick. Updating channelsToAdd and/or pool triggers the function again
  $: tick().then(()=>{
    if(channelsToAdd.length > 0 && pool.length < MAXPOOL){
      const channel = channelsToAdd.shift();
      channelsToAdd = channelsToAdd;
      channel && !channels.includes(channel) && channels.push(channel) && (channels = channels) && (pool.push(channel)) && (pool=pool)
    }
  });

  // import Twitch from '../twitch/TwitchChannelEmbed.svelte';
  export let channels: Array<string> = ['davegrecoart','dzikawa','monstercat'];
  // export let offlineChannels: Array<string>=[]; 
  let displayOfflineChannels = false;
</script>

<input type="text" id="channel_name"/>
<button on:click="{()=>addChannel()}" >Add</button>
{#if pool.length > 0 }
<label style="color: white;">Loading {pool.length} [{pool.join(',')}], {channelsToAdd.length} channels to go </label>
{/if}
<input type="checkbox" bind:checked={displayOfflineChannels}/>
  <label style="color: white;">Display offline channels</label>
<Grid on:twitchready={handleTwitchReady}
  displayOfflineChannels={displayOfflineChannels} 
  channels={channels}></Grid>

<style>

</style>