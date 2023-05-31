// run in https://www.twitch.tv/directory/following/channels to get channels
var results = []
document.querySelectorAll(".tw-link").forEach(e=>{
  const href = e.href?.split("/");
  href && href[3] && (results.push(href[3]))
})
results
//JSON.stringify(results)//.replace(/[\[\]"]+/g,'').replace(/,/g,', ');





async function scan_channels(){
  console.log("Starting cleanup")
  
  if (window.offlineChannels){
    window.offlineChannels.forEach((channel)=>add_channel(channel));
  }
  window.offlineChannels = []
  
  await new Promise(r => setTimeout(r,100));
  
  globalThis.promises = []
  
  $(".twitch-embed").each(function () {
    // Get the twitch object provided to us when we create the iFrame
    var t = $(this);
    var twitchObject = t.data("embed")
  
    // if the channel is empty or null, then the iframe is not ready yet
    if (!twitchObject.getChannel()){ //not ready yet
      globalThis.promises.push(new Promise((resolve)=>{
        twitchObject.addEventListener(Twitch.Embed.VIDEO_READY, ()=>{
          var channelName = twitchObject.getChannel();
          // console.log (`${channelName} is ${twitchObject.getPlayerState().playback}`)
          setTimeout(()=>{
            // if the channel's playback status is Idle, it means it's offline
            if (twitchObject.getPlayerState().playback != "Playing" && twitchObject.getPlayerState().playback != "Buffering"){
              console.log (`${channelName} is ${twitchObject.getPlayerState().playback}`)
              const index = globalThis.channels.indexOf(channelName)
              if (index > -1){
                // console.log(`Removing ${channelName}`)
                // remove from channels list and add to offlineChannels to be re-added later
                globalThis.channels.splice(index,1)
                if (window.offlineChannels.indexOf(channelName) == -1){
                  window.offlineChannels.push(channelName)
                }
              }
            }
            resolve();
          },15000)
        })
      }));
    }
    else{
      var channelName = twitchObject.getChannel() //already there from a previous scan;
      // if the channel's playback status is Idle, it means it's offline
      if (twitchObject.getPlayerState().playback != "Playing"){
        const index = globalThis.channels.indexOf(channelName)
        if (index > -1){
          // remove from channels list and add to offlineChannels to be re-added later
          globalThis.channels.splice(index,1)
          if (window.offlineChannels.indexOf(channelName) == -1){
            window.offlineChannels.push(channelName)
          }
        }
      }
    }
  });
  Promise.all(globalThis.promises).then(()=>{console.log(`all done ! ${new Date()}`);generate_Layout();})
};
setInterval(scan_channels,600000);
scan_channels();