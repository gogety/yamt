// run in https://www.twitch.tv/directory/following/channels to get channels
var results = []
document.querySelectorAll(".tw-link").forEach(e=>{
  const href = e.href?.split("/");
  href && href[3] && (results.push(href[3]))
})
results
//JSON.stringify(results)//.replace(/[\[\]"]+/g,'').replace(/,/g,', ');