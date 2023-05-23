<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Grid from '../grid/grid.svelte';
	import { myChannels } from './myChannels';

	let pool: string[] = [];
	const MAXPOOL = 30;
	let channelsToAdd: string[] = [];
	export let channels: Array<string> = [];
  let displayOfflineChannels = false;
  let input:string;

  onMount(async()=>{

  })


	let handleTwitchReady = (event: CustomEvent) => {
		const channel = event.detail.data;
		if (pool.includes(channel)) {
			// alert(`freeing ${channel}`)
			pool = pool.filter((e) => e != channel);
		}
	};

	let addChannels = () => {
		// let currentValue: string = document.getElementById('channel_name').value;
    let currentValue = input;

		try {
			currentValue = JSON.parse(currentValue);
		} catch {}

		channelsToAdd = Array.isArray(currentValue) ? [...currentValue] : [currentValue];

		debugger;

		// easiest to push all channels but also can be too much in one shot. Comment if enabling reactive buffering below
		channels = [...new Set([...channels, ...channelsToAdd])];
	};

	// Reactive buffering, not needed when there are not that many online channels
	// Sort of recursion with tick. Updating channelsToAdd and/or pool triggers the function again
	// $: tick().then(()=>{
	//   if(channelsToAdd.length > 0 && pool.length < MAXPOOL){
	//     const channel = channelsToAdd.shift();
	//     channelsToAdd = channelsToAdd;
	//     channel && !channels.includes(channel) && channels.push(channel) && (channels = channels) && (pool.push(channel)) && (pool=pool)
	//   }
	// });

	// export let offlineChannels: Array<string>=[];

    input = myChannels;

</script>

<input bind:value={input} placeholder="Enter channel name or JSON array of channels" type="text" id="channel_name" />
<button on:click={() => addChannels()}>Add</button>
{#if pool.length > 0}
	<label style="color: white;">Loading {pool.length} [{pool.join(',')}], {channelsToAdd.length} channels to go</label>
{/if}
<input type="checkbox" bind:checked={displayOfflineChannels} />
<label style="color: white;">Display offline channels</label>
<Grid on:twitchready={handleTwitchReady} {displayOfflineChannels} {channels} />

<style>
</style>
