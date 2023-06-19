<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { myChannels } from './myChannels';
	import { flip } from 'svelte/animate';
	import Twitch from '../twitch/twitch.svelte';
	import { isChannelLive, channelStatus, getChannelStatus, type Channel } from '../twitch/TwitchUtils';
	import Sidebar from '../sidebar.svelte';
	let channels: Channel[] = [];
	// $: offlineChannels = () => channels.filter(channel => channel.status == channelStatus.offline)
	$: onlineChannels = () => channels.filter(channel => channel.status == channelStatus.online)
	// $: hiddenChannels = () =>channels.filter(channel => channel.isHidden)
	let focusedChannel:Channel|undefined;
	let displayHiddenChannels = false;
	let input: string;

	onMount(async () => {
		setInterval(scanOffline,60000);
	});

	const dragDuration = 300;
	let draggingCard: Channel|undefined;
	let swappingWithCard: Channel|undefined;
	
	function swapWith(channel: Channel|undefined) {
		// sacrifice animation to not have to reload all channels in the path of the two swapped
		// have to be precise when moving
		if (draggingCard === channel ) return;
		if (draggingCard){
			const cardAIndex = channels.indexOf(draggingCard);
			const cardBIndex = channels.indexOf(channel);
			const cardAName = channels[cardAIndex].name;
			const cardBName = channels[cardBIndex].name ;
			channels[cardAIndex].name = cardBName;
			channels[cardBIndex].name = cardAName;
			channels = channels;
		}
		return true
	}

	function focusMe(channel: Channel|undefined) {
		channel && (focusedChannel = focusedChannel == channel ? undefined : channel)
		focusedChannel = focusedChannel;
		return null
	}

	function deleteMe(channel: Channel) {
		channels = channels.filter((e) => e != channel);
		(focusedChannel === channel) && (focusedChannel = undefined)
	}

	function setStatus(channel: Channel, status: channelStatus | undefined = undefined){
		if (status){
			channel.status = status;
			channels = channels;
		}
		else{
			getChannelStatus(channel.name).then(status=>{
				setStatus(channel, status)
			});
		}
	}

	let addChannels = async () => {
		let currentValue = input;
		try{
			currentValue = JSON.parse(currentValue);
		}
		catch{} // if it fails, consider it is not a json object and just one channel name
		let channelsToAdd: Channel[] = Array.isArray(currentValue)
			? await Promise.all(currentValue.map(
					async (channelName) => ({ name: channelName, status: await getChannelStatus(channelName) } as Channel)
			  ))
			: [{ name: currentValue, status: await getChannelStatus(currentValue)} as Channel];

		// easiest to push all channels but also can be too much in one shot. Comment if enabling reactive buffering below
		channels = [...channels, ...channelsToAdd.filter(channel => !channels.some(cha=>cha.name === channel.name))];
	};
	
	let hideUnhideChannel = (channel:	Channel) => {
		channel.isHidden = !channel.isHidden;
		channel = channel;
		getChannelStatus(channel.name).then(status => {channel.status = status; channels = channels});
	}

	let scanOffline = () => {
		channels.filter(channel => channel.status == channelStatus.offline || channel.isHidden).forEach(async (channel) => {
			channel.status = await getChannelStatus(channel.name);
		})
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

<Sidebar channels={channels} unhideChannelHandler={hideUnhideChannel} ></Sidebar>
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
<input type="checkbox" bind:checked={displayHiddenChannels} />
<label style="color: white;">Display hidden channels</label>
<!-- <label style="color: white;"> {onlineChannels().length} online, {offlineChannels().length} offline</label> -->
{#if focusedChannel}
	<div id="focusedChannel" class="focused">
		<Twitch
			showChat={true}
			channel={focusedChannel}
			focusHandler={() => focusMe(focusedChannel)}
		/>
	</div>
{/if}
<div class="container">
	<!-- <div id="onlinechannels" display="flex"> -->
	{#each onlineChannels().filter((channel) => displayHiddenChannels || !channel.isHidden) as channel, index(channel)}
			<div
				id={index.toString()}
				animate:flip={{ duration: dragDuration }}
				class="card"
				draggable="true"
				on:dragstart={() => (draggingCard = channel)}
				on:dragend={() => (swapWith(swappingWithCard)) && (draggingCard = undefined) && (swappingWithCard = undefined)}
				on:dragenter={() => (swappingWithCard = channel)}
				on:dragover|preventDefault
			>
				<Twitch
					offlineHandler={() => setStatus(channel, channelStatus.offline)}
					channel={channel}
					deleteHandler={() => deleteMe(channel)}
					hideHandler={()=>hideUnhideChannel(channel)}
					focusHandler={()=>focusMe(channel)}
					focusedChannel = {focusedChannel}
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
