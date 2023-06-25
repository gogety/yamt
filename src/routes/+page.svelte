<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { myChannels } from './myChannels';
	import { flip } from 'svelte/animate';
	import Twitch from '../twitch/twitch.svelte';
	import {
		channelStatus,
		getChannelStatus,
		type Channel,
		EmbedMode
	} from '../twitch/TwitchUtils';
	import Sidebar from '../sidebar.svelte';
	let channels: Channel[] = [];
	// $: offlineChannels = () => channels.filter(channel => channel.status == channelStatus.offline)
	$: onlineChannels = () => channels.filter((channel) => channel.status == channelStatus.online);
	// $: hiddenChannels = () =>channels.filter(channel => channel.isHidden)
	let focusedChannel: Channel | undefined;
	let displayHiddenChannels = false;
	let input: string;
	let channelsFromLocalStorage: string;

	onMount(async () => {
		channelsFromLocalStorage = localStorage.getItem("channels")
		setInterval(scanOffline, 60000);
	});

	const dragDuration = 300;
	let draggingCard: Channel | undefined;
	let swappingWithCard: Channel | undefined;

	function swapWith(channel: Channel | undefined) {
		// sacrifice animation to not have to reload all channels in the path of the two swapped
		// have to be precise when moving
		if (draggingCard === channel) return;
		if (draggingCard) {
			const cardAIndex = channels.indexOf(draggingCard);
			const cardBIndex = channels.indexOf(channel);
			const cardAName = channels[cardAIndex].name;
			const cardBName = channels[cardBIndex].name;
			channels[cardAIndex].name = cardBName;
			channels[cardBIndex].name = cardAName;
			channels = channels;
		}
		return true;
	}

	let focusMe = (channel: Channel | undefined) => {
		channel && (focusedChannel = focusedChannel == channel ? undefined : channel);
		focusedChannel = focusedChannel;
		return null;
	}

	let deleteMe = (channel: Channel) => {
		channels = channels.filter((e) => e != channel);
		focusedChannel === channel && (focusedChannel = undefined);
	}

	let setStatus = async (channel: Channel, status: channelStatus | undefined = undefined) => {
		if (status) {
			channel.status = status;
			if (channel.status == channelStatus.offline && channel.preview) {
				channel.preview = false;
			}
			channels = channels;
		} else {
			getChannelStatus(channel.name).then((status) => {
				setStatus(channel, status);
			});
		}
	}

	let addChannels = async () => {
		let currentValue = input;
		try {
			currentValue = JSON.parse(currentValue);
		} catch {} // if it fails, consider it is not a json object and just one channel name
		let channelsToAdd: Channel[] = Array.isArray(currentValue)
			? currentValue.map(
						(channelName) =>
							({ name: channelName} as Channel)
					)
			: [{ name: currentValue} as Channel];

		loadChannels(channelsToAdd)
	};

	let saveChannels = () => {
		// we don't need to save all the properties, just map the ones we want to keep
		channelsFromLocalStorage = JSON.stringify(channels.map((channel)=>{
			return {
				name: channel.name,
				isHidden: channel.isHidden
			} as Channel
		}));
		localStorage.setItem("channels",channelsFromLocalStorage)
		alert("Saved successfully !");
	};

	let loadChannels = async (channelsToAdd:Channel[]=null) => {
		// Get list from local storage
		!channelsToAdd && (channelsToAdd = JSON.parse(channelsFromLocalStorage))

		if(channelsToAdd){
			// get status
			await Promise.all(
				channelsToAdd.map(channel => {setStatus(channel)})
			)

			channels = [
			...channels,
			...channelsToAdd.filter((channel) => !channels.some((cha) => cha.name === channel.name))
			];
		}
		else{
			alert("No channels to load, use the save feature")
		}
	};

	let exportChannels = () => {
		const channelsExport = JSON.stringify(channels.map((channel)=>{
			return {
				name: channel.name,
				isHidden: channel.isHidden
			} as Channel// may return an object later
		}))
		navigator.clipboard.writeText(channelsExport);

		alert ("Copied to clipboard");
	}

	let importChannels = () =>{
		let channelsToAdd;
		try{
			channelsToAdd = JSON.parse(input)
			loadChannels(channelsToAdd);
		}
		catch{
			alert("Unable to parse syntax. Only use the import feature along with the export feature output.")
		}
	}

	let hideUnhideChannel = (channel: Channel) => {
		channel.isHidden = !channel.isHidden;
		if (!channel.isHidden && channel.preview) {
			channel.preview = false;
		}
		channels = channels;
		setStatus(channel);
	};

	let scanOffline = () => {
		channels
			.filter((channel) => channel.status == channelStatus.offline || channel.isHidden)
			.forEach(async (channel) => {
				setStatus(channel);
			});
		channels = channels;
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

<Sidebar {channels} unhideChannelHandler={hideUnhideChannel} deleteChannelHandler={deleteMe} />
<input
	bind:value={input}
	placeholder="Enter channel name or JSON array of channels"
	type="text"
	id="channel_name"
/>
{#if !!input}
	<button on:click={() => addChannels()}>Add</button>
{/if}
{#if !!channels.length}
	<button on:click={() => saveChannels()}>Save</button>
	<button on:click={() => exportChannels()}>Export</button>
{/if}
{#if !!input}
	<button on:click={() => importChannels()}>Import</button>
{/if}
{#if channelsFromLocalStorage}
	<button title="Load saved channels" on:click={() => loadChannels()}>Load</button>
{/if}
<!-- {#if pool.length > 0}
	<label style="color: white;"
		>Loading {pool.length} [{pool.join(',')}], {channelsToAdd.length} channels to go</label
	>
{/if} -->
<input type="checkbox" bind:checked={displayHiddenChannels} />
<label style="color: white;">Display muted channels</label>
<!-- <label style="color: white;"> {onlineChannels().length} online, {offlineChannels().length} offline</label> -->
{#if focusedChannel}
	<div id="focusedChannel" class="focused">
		<Twitch
			mode={EmbedMode.focus}
			channel={focusedChannel}
			focusHandler={() => focusMe(focusedChannel)}
		/>
	</div>
{/if}
<div class="container">
	<!-- <div id="onlinechannels" display="flex"> -->
	{#each onlineChannels().filter((channel) => displayHiddenChannels || !channel.isHidden) as channel, index (channel)}
		<div
			id={index.toString()}
			animate:flip={{ duration: dragDuration }}
			class="card"
			draggable="true"
			on:dragstart={() => (draggingCard = channel)}
			on:dragend={() =>
				swapWith(swappingWithCard) && (draggingCard = undefined) && (swappingWithCard = undefined)}
			on:dragenter={() => (swappingWithCard = channel)}
			on:dragover|preventDefault
		>
			<Twitch
				offlineHandler={() => setStatus(channel, channelStatus.offline)}
				{channel}
				deleteHandler={() => deleteMe(channel)}
				hideHandler={() => hideUnhideChannel(channel)}
				focusHandler={() => focusMe(channel)}
				{focusedChannel}
			/>
		</div>
	{/each}
</div>

<style>
	.focus {
		background-color: navy;
	}

	.container {
		display: flex;
		flex-wrap: wrap;
		justify-content: middle;
		/* grid-template-rows: repeat(4, 1fr); */
		/* grid-template-columns: repeat(5, 1fr);  */
		/* grid-template-columns: repeat(auto-fill); */
		/* grid-template-rows: repeat(auto-fill, minmax(200px,1fr)); */
		/* gap: 24px; */
	}

	.card {
		/* display: flex; */
		/* justify-content: center; */
		/* align-items: left; */
		/* color: darkblue; */
		background-color: rgb(45, 45, 45);
		/* width: 100%; */
		height: 340px;
		/* font-size: 1.5rem; */
		aspect-ratio: 16/9;
		/* flex-basis: 0; */
		margin-bottom: 30px;
		margin-left: 20px;
		border-radius: 5px;
	}

	.focused {
		/* height: 1000px; */
		width: 100%;
	}
</style>
