<script lang="ts">
	import { flip } from 'svelte/animate'
	import Twitch from '../twitch/twitch.svelte';

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
    const removed = channels.splice(channels.indexOf(channel),1);
    channels=channels
    if (focusedChannel === channel){
      // remove if it was also focused 
      focusedChannel = "";
    }
    return removed
  }

  function setOffline(channel){
    const offlineChannel = deleteMe(channel);
    if (offlineChannel && !offlineChannels.includes(offlineChannel)){
      offlineChannels.push(offlineChannel);
      offlineChannels=offlineChannels;
    }
  }
</script>

<div class="container">
  {#if focusedChannel!==""}
    <div id="focusedChannel" class="card focused" >
      <div on:click="{focusMe(focusedChannel)}">x</div>
      <Twitch showChat="true" channelName={focusedChannel}></Twitch>
    </div>
  {/if}
  <!-- <div id="onlinechannels" display="flex"> -->
    {#each channels as channel (channel)}
      <div
        animate:flip={{ duration: dragDuration }}
        class="card"
        style="display: {focusedChannel===channel?"none":""}"
        class:focused={focusedChannel==channel}
        draggable="true"
        on:dragstart={() => draggingCard = channel}
        on:dragend={() => draggingCard = undefined}
        on:dragenter={() => swapWith(channel)}
        on:dragover|preventDefault
      >
        <div on:click="{deleteMe(channel)}">x</div>
        <div on:click="{focusMe(channel)}">f</div>
        <Twitch offlineHandler={()=>setOffline(channel)} channelName={channel}></Twitch>
      </div>
    {/each}
  <!-- </div> -->
  {#if displayOfflineChannels}
  <!-- <div id="offlineChannels" display="flex"> -->
    {#each offlineChannels as channel (channel)}
      <div
        animate:flip={{ duration: dragDuration }}
        class="card"
        style="display: {focusedChannel===channel?"none":""}"
        class:focused={focusedChannel==channel}
        draggable="true"
        on:dragstart={() => draggingCard = channel}
        on:dragend={() => draggingCard = undefined}
        on:dragenter={() => swapWith(channel)}
        on:dragover|preventDefault
      >
        <div on:click="{deleteMe(channel)}">x</div>
        <div on:click="{focusMe(channel)}">f</div>
        <Twitch channelName={channel}></Twitch>
      </div>
    {/each}
  <!-- </div> -->
  {/if}
</div>

<style>
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
		background-color: lightblue;
		/* width: 100%; */
		height: 340px;
		font-size: 1.5rem;
		aspect-ratio: 16/9;
    flex-basis: 0;
	}
  
  .focused {
    height: 950px;
    /* width: 100%; */
  }
</style>