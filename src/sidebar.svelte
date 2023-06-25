<script lang="ts">
	import { channelStatus, type Channel } from "./twitch/TwitchUtils";
	import Sidebaritem from "./sidebaritem.svelte";

  export let channels:Array<Channel>=[];
  export let unhideChannelHandler = (channel:Channel) => {};
  export let deleteChannelHandler = (channel:Channel) => {};
  $: offlineChannels = () => channels.filter(channel => channel.status == channelStatus.offline && !channel.isHidden)
	$: onlineChannels = () => channels.filter(channel => channel.status == channelStatus.online && !channel.isHidden)
	$: hiddenChannels = () => channels.filter(channel => channel.isHidden)
  
  let openNav = () => {
    document.getElementById("mySidebar").style.width = "250px";
  }

  let closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
  }  
</script>

<div id="mySidebar" class="sidebar">
  <span class="closebtn" on:click="{closeNav}" style="color:white">x</span>
  <Sidebaritem title="Muted" channels={hiddenChannels()} hideUnhideChannelHandler={unhideChannelHandler} deleteChannelHandler={deleteChannelHandler}/>
  <Sidebaritem title="Online" channels={onlineChannels()} hideUnhideChannelHandler={unhideChannelHandler} deleteChannelHandler={deleteChannelHandler}/>
  <Sidebaritem title="Offline" channels={offlineChannels()} hideUnhideChannelHandler={unhideChannelHandler} deleteChannelHandler={deleteChannelHandler}/>
</div>
<button class="openbtn" on:click={openNav}>☰</button>  

<style>
  .status{
    color:  white;
    font-weight: bold;
  }

  .item{
    color:  white;
    height: 30px;
  }
  body {
    font-family: "Lato", sans-serif;
  }

  .sidebar {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #111;
    overflow-x: hidden;
    /* transition: 0.5s; */
    padding-top: 15px;
    padding-left: 10px;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    font-size: 17px;
  }

  .sidebar::-webkit-scrollbar {
    display: none;
  }

  .sidebar span {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    /* transition: 0.3s; */
  }

  .sidebar span:hover {
    color: #f1f1f1;
  }

  .sidebar .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 30px;
    margin-left: 50px;
  }

  .openbtn {
    font-size: 20px;
    cursor: pointer;
    background-color: #111;
    color: white;
    padding: 10px 15px;
    border: none;
  }

  .openbtn:hover {
    background-color: #444;
  }

  #main {
    /* transition: margin-left .5s; */
    padding: 16px;
  }

  /* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
  @media screen and (max-height: 450px) {
    .sidebar {padding-top: 15px;}
    .sidebar span {font-size: 18px;}
  }
</style>