

<script lang="ts">
  import { onMount } from 'svelte';
  let player:Twitch.Player;
  export let channelName:string= "monstercat"
  onMount(async () => {
    player = new Twitch.Embed("twitch-embed", {
      width: 854,
      height: 480,
      channel: channelName,
      muted: true,
      // Only needed if this page is going to be embedded on other websites
      parent: ["localhost"],
      layout: "video"
    });
    player.addEventListener(Twitch.Embed.VIDEO_READY, function(){
      window.player=player
    })
    player.addEventListener(Twitch.Player.OFFLINE, function(){
      alert("channel is offline !");
    })
  })
</script>

<!-- Add a placeholder for the Twitch embed -->
<div id="twitch-embed"></div>
<!-- <iframe title="twitch-chat" id="twitch-chat" src="https://www.twitch.tv/embed/{channelName}/chat?parent=<parent>"
  height="480"
  width="200">
</iframe> -->