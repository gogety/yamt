<!-- <script lang="ts">
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
    if (channels.includes(channel)){
      channels = channels.filter(e=>e!=channel);
    }
    if (offlineChannels.includes(channel)){
      offlineChannels = offlineChannels.filter(e=>e!=channel);
    }
    if (focusedChannel === channel){
      // remove if it was also focused 
      focusedChannel = "";
    }
  }

  function setOnline(channel){   
    let removed=false;
    if (offlineChannels.includes(channel)){
      offlineChannels = offlineChannels.filter(e=>e!=channel);
      removed = !removed;
    }
    if (removed && !channels.includes(channel)){
      channels = [...channels,channel];
    }
  }

  function setOffline(channel){
    let removed=false;
    if (channels.includes(channel)){
      channels = channels.filter(e=>e!=channel);
      removed = !removed;
    }
    if (removed && !offlineChannels.includes(channel)){
      offlineChannels = [...offlineChannels,channel];
    }
  }

</script>
<label style="color: white;"> {channels.length} online, {offlineChannels.length} offline</label>
<div class="container">
  {#if focusedChannel!==""}
    <div id="focusedChannel" class="card focused" >
        <Twitch showChat={true} channelName={focusedChannel}
        deleteHandler={()=>deleteMe(focusedChannel)}
        ></Twitch>
    </div>
  {/if}
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
      {#if channel != focusedChannel}
          <Twitch offlineHandler={()=>setOffline(channel)} 
            channelName={channel}
            deleteHandler={()=>deleteMe(channel)}
            on:twitchready ></Twitch>
      {:else} <div>IN FOCUS</div>
      {/if}
      </div>
    {/each}
  {#if displayOfflineChannels}
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
        <Twitch onlineHandler={()=>setOnline(channel)} 
          channelName={channel}
          deleteHandler={()=>deleteMe(channel)}
          ></Twitch>
      </div>
    {/each}
  {/if}
</div>

<style>
  .focus{
    background-color:navy
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
</style> -->