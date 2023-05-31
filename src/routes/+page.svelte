<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Grid from '../grid/grid.svelte';
	import { myChannels } from './myChannels';
	let channelsToAdd: string[] = [];
	export let channels: Array<string> = [];
	let displayOfflineChannels = false;
	let input: string;

	onMount(async () => {});

	import { flip } from 'svelte/animate';
	import Twitch from '../twitch/twitch.svelte';

	const dragDuration = 300;
	let draggingCard;
	let animatingCards = new Set();
	export let offlineChannels: string[] = [];
	let focusedChannel = '';

	function swapWith(channel) {
		if (draggingCard === channel || animatingCards.has(channel)) return;
		animatingCards.add(channel);
		setTimeout(() => animatingCards.delete(channel), dragDuration);
		const cardAIndex = channels.indexOf(draggingCard);
		const cardBIndex = channels.indexOf(channel);
		channels[cardAIndex] = channel;
		channels[cardBIndex] = draggingCard;
	}

	function focusMe(channel) {
		focusedChannel = focusedChannel == channel ? '' : channel;
	}

	function deleteMe(channel) {
		if (channels.includes(channel)) {
			channels = channels.filter((e) => e != channel);
		}
		if (offlineChannels.includes(channel)) {
			offlineChannels = offlineChannels.filter((e) => e != channel);
		}
		if (focusedChannel === channel) {
			// remove if it was also focused
			focusedChannel = '';
		}
	}

	function setOnline(channel) {
		let removed = false;
		if (offlineChannels.includes(channel)) {
			offlineChannels = offlineChannels.filter((e) => e != channel);
			removed = !removed;
		}
		if (removed && !channels.includes(channel)) {
			channels = [...channels, channel];
		}
	}

	function setOffline(channel) {
		let removed = false;
		if (channels.includes(channel)) {
			channels = channels.filter((e) => e != channel);
			removed = !removed;
		}
		if (removed && !offlineChannels.includes(channel)) {
			offlineChannels = [...offlineChannels, channel];
		}
	}

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

	// let pool: string[] = [];
	// const MAXPOOL = 30;

	// let handleTwitchReady = (event: CustomEvent) => {
	// 	const channel = event.detail.data;
	// 	if (pool.includes(channel)) {
	// 		// alert(`freeing ${channel}`)
	// 		pool = pool.filter((e) => e != channel);
	// 	}
	// };

	input = myChannels;
</script>

<input
	bind:value={input}
	placeholder="Enter channel name or JSON array of channels"
	type="text"
	id="channel_name"
/>
<button on:click={() => addChannels()}>Add</button>
<!-- {#if pool.length > 0}
	<label style="color: white;"
		>Loading {pool.length} [{pool.join(',')}], {channelsToAdd.length} channels to go</label
	>
{/if} -->
<input type="checkbox" bind:checked={displayOfflineChannels} />
<label style="color: white;">Display offline channels</label>
<label style="color: white;"> {channels.length} online, {offlineChannels.length} offline</label>
<div class="container">
	{#if focusedChannel !== ''}
		<div id="focusedChannel" class="card focused">
			<Twitch
				showChat={true}
				channelName={focusedChannel}
				deleteHandler={() => focusMe(focusedChannel)}
			/>
		</div>
	{/if}
	<!-- <div id="onlinechannels" display="flex"> -->
	{#each channels as channel (channel)}
		<div
			animate:flip={{ duration: dragDuration }}
			class="card"
			draggable="true"
			on:dragstart={() => (draggingCard = channel)}
			on:dragend={() => (draggingCard = undefined)}
			on:dragenter={() => swapWith(channel)}
			on:dragover|preventDefault
		>
			<div class="focus" on:click={focusMe(channel)}>f</div>
			{#if channel != focusedChannel}
				<Twitch
					offlineHandler={() => setOffline(channel)}
					channelName={channel}
					deleteHandler={() => deleteMe(channel)}
				/>
			{:else}
				<div>IN FOCUS</div>
			{/if}
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
				on:dragstart={() => (draggingCard = channel)}
				on:dragend={() => (draggingCard = undefined)}
				on:dragenter={() => swapWith(channel)}
				on:dragover|preventDefault
			>
				<Twitch
					onlineHandler={() => setOnline(channel)}
					channelName={channel}
					deleteHandler={() => deleteMe(channel)}
				/>
			</div>
		{/each}
		<!-- </div> -->
	{/if}
</div>

<style>
	.focus {
		background-color: navy;
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
