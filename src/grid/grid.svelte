<script lang="ts">
	import { flip } from 'svelte/animate'
	import Twitch from '../twitch/twitch.svelte';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

	const dragDuration = 300
  export let channels:string[];
  export let displayOfflineChannels:boolean=false;
	let draggingCard
	let animatingCards = new Set()
  export let offlineChannels:string[]= []
  let focusedChannel="";

	function swapWith(channel) {
		if (draggingCard === channel || animatingCards.has(channel)) return
		animatingCards.add(channel)
		setTimeout(() => animatingCards.delete(channel), dragDuration)
		const cardAIndex = channels.indexOf(draggingCard)
		const cardBIndex = channels.indexOf(channel)
		channels[cardAIndex] = channel
		channels[cardBIndex] = draggingCard
	}

  function focusMe(channel){
    focusedChannel = focusedChannel== channel ? "" : channel;
  }

  function deleteMe(channel){
    // const removed = channels.splice(channels.indexOf(channel),1);
    // channels=channels

    let removed;
    if (channels.includes(channel)){
      channels = channels.filter(e=>e!=channel);
      removed = channel
    }
    if (focusedChannel === channel){
      // remove if it was also focused 
      focusedChannel = "";
    }
    return removed
  }

  function setOnline(channel){
    // Only do something if the channel is not already online
    if (channels.includes(channel))
      return
    
    if (offlineChannel && !offlineChannels.includes(offlineChannel)){
      const onlineChannel = offlineChannels.splice(offlineChannels.indexOf(offlineChannel),1);
      offlineChannels=offlineChannels;
      channels.push(onlineChannel);
    }
  }

  function setOffline(channel){
    const offlineChannel = deleteMe(channel);
    if (offlineChannel && !offlineChannels.includes(offlineChannel)){
      offlineChannels.push(offlineChannel);
      offlineChannels=offlineChannels;
    }
  }

</script>
<label style="color: white;"> {channels.length} online, {offlineChannels.length} offline</label>
<div class="container">
  {#if focusedChannel!==""}
    <div id="focusedChannel" class="card focused" >
        <Twitch showChat="true" channelName={focusedChannel}></Twitch>
        <div class="delete" on:click="{focusMe(focusedChannel)}">x</div>
    </div>
  {/if}
  <!-- <div id="onlinechannels" display="flex"> -->
    {#each channels as channel (channel)}
      <div
        animate:flip={{ duration: dragDuration }}
        class="card"
        draggable="true"
        on:dragstart={() => draggingCard = channel}
        on:dragend={() => draggingCard = undefined}
        on:dragenter={() => swapWith(channel)}
        on:dragover|preventDefault
      >
        <div class="focus" on:click="{focusMe(channel)}">f</div>
        <Twitch offlineHandler={()=>setOffline(channel)} 
          channelName={channel}
          on:twitchready ></Twitch>
        <div class="delete" on:click="{deleteMe(channel)}">x</div>
      </div>
    {/each}
  <!-- </div> -->
  {#if displayOfflineChannels}
  <!-- <div id="offlineChannels" display="flex"> -->
    {#each offlineChannels as channel (channel)}
      <div
        animate:flip={{ duration: dragDuration }}
        class="card"
        draggable="true"
        on:dragstart={() => draggingCard = channel}
        on:dragend={() => draggingCard = undefined}
        on:dragenter={() => swapWith(channel)}
        on:dragover|preventDefault
      >
        <Twitch onlineHandler={()=>setOnline(channel)} channelName={channel}></Twitch>
        <div class="delete" on:click="{deleteMe(channel)}">x</div>
      </div>
    {/each}
  <!-- </div> -->
  {/if}
</div>

<style>
  .focus{
    background-color:navy
  }
  .delete{
    background-color:red
  }
.container {
		display: flex;
    flex-wrap: wrap;
		/* grid-template-rows: repeat(4, 1fr); */
		 /* grid-template-columns: repeat(5, 1fr);  */
    /* grid-template-columns: repeat(auto-fill); */
    /* grid-template-rows: repeat(auto-fill, minmax(200px,1fr)); */
		gap: 24px;
	}

	.card {
		display: flex;
		/* justify-content: center; */
		align-items: left;
    color: darkblue;
		background-color: #787878;
		/* width: 100%; */
		height: 340px;
		font-size: 1.5rem;
		aspect-ratio: 16/9;
    flex-basis: 0;
	}
  
  .focused {
    height: 1000px;
    /* width: 100%; */
  }
</style>