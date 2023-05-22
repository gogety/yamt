<script lang="ts">
  import Main from './main.svelte';
  import Twitch from '../twitch/twitch.svelte';
  // import Twitch from '../twitch/TwitchChannelEmbed.svelte';
  export let channels: Array<string> = ['davegrecoart','dzikawa','monstercat'];
  let channel:string = 'davegrecoart'
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the docufmentation</p>
<Main></Main>
<!-- <Twitch {channel} id=1 live={false}></Twitch> -->
{#each channels as channel}
  <Twitch channelName={channel}></Twitch>
{/each}