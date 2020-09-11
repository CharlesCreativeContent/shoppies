let Shoppies = {
      find: ()=>{
      document.querySelector('ul').innerHTML = ''
      Shoppies.input = document.querySelector('input').value
      document.querySelector('input').value = ''
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(proxyurl+`http://www.omdbapi.com/?s=${Shoppies.input}&apikey=8ce696ca`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
      Shoppies.titles = data.Search.sort((a,b)=>parseInt(b.Year.slice(0,4))-parseInt(a.Year.slice(0,4))).filter(x=>x.Type ===`movie`).map(x=>x.Title)
      Shoppies.years = data.Search.sort((a,b)=>parseInt(b.Year.slice(0,4))-parseInt(a.Year.slice(0,4))).filter(x=>x.Type ===`movie`).map(x=>x.Year.slice(0,4))
      Shoppies.ids = data.Search.sort((a,b)=>parseInt(b.Year.slice(0,4))-parseInt(a.Year.slice(0,4))).filter(x=>x.Type ===`movie`).map(x=>x.imdbID)
      Shoppies.imgs = data.Search.sort((a,b)=>parseInt(b.Year.slice(0,4))-parseInt(a.Year.slice(0,4))).filter(x=>x.Type ===`movie`).map(x=>x.Poster)
      Shoppies.youtubeNames = data.Search.sort((a,b)=>parseInt(b.Year.slice(0,4))-parseInt(a.Year.slice(0,4))).filter(x=>x.Type===`movie`).map(x=>`${x.Title} ${x.Year.slice(0,4)} ${x.Type} Trailer`)

      let allAvailabilities = Promise.all(
        Shoppies.titles.map((x,i)=>{
          return fetch(proxyurl+`https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${x}`, {
          "method": "GET",
          "headers": {
            "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
            "x-rapidapi-key": "3ae1d00c97msh298612aebb81230p11684djsn405007844583"
          }})
          .then(response => response.json()).then(y=>{
            Shoppies.availabilities.push(y)
            document.querySelector('ul').innerHTML += `<li class="listItem"><img src="${Shoppies.imgs[i]}"/><h2>${Shoppies.titles[i]} (${Shoppies.years[i]})</h2><a onclick='Shoppies.nominate(${i})'><img src='img/thumbsup.png'/></a><a target="_blank" href="${y.results[0].locations.map(x=>`${x.url}"><img src="${x.icon}`).join(`"/></a><a target="_blank" href="`)}"/></a><a onclick='Shoppies.getTrailers(${i})'><img src="img/trailer.jpg"/></a></li>`
          }).catch(err => console.log(err))
        }))
  })},

  nominate: (num)=>{
    if (!Shoppies.votes.includes(Shoppies.ids[num])&&document.querySelectorAll('ol li').length<=4){
    Shoppies.votes.push(Shoppies.ids[num])
    let listItem = document.createElement('li')
    listItem.innerHTML = `<img src="${Shoppies.imgs[num]}"/><h2>${Shoppies.titles[num]} (${Shoppies.years[num]})</h2><a onclick='Shoppies.denominate(${document.querySelectorAll('ol li').length})'><img src='img/thumbsupIn.png'/></a><a target="_blank" href="${Shoppies.availabilities[num].results[0].locations.map(x=>`${x.url}"><img src="${x.icon}`).join(`"/></a><a target="_blank" href="`)}"/></a><a onclick='Shoppies.getTrailers(${num})'><img src="img/trailerIn.png"/></a></li>`
    console.log(listItem)
    document.getElementById('myList').appendChild(listItem)
    if(document.querySelectorAll('ol li').length===5){
      document.querySelector('header').style.display = 'block'
      document.querySelector('body').style.position = 'relative'
      document.querySelector('body').style.top = '25px'
    }
  }
  },
denominate:(num)=>{
document.querySelector('body').style.top = '0px'
    document.querySelector('header').style.display = 'none'
Shoppies.votes.splice(num,1)
    var element = document.querySelectorAll('ol li')[num]
    element.parentNode.removeChild(element);
},
availabilities: [],
votes: [],
saveList: ()=>{
localStorage.setItem(
  Shoppies.savedList,
  JSON.stringify(
    document.querySelector('ol').innerHTML
  )
);
  return null
},
  getTrailers: (num)=>{ fetch(`https://youtube-rest-api.p.rapidapi.com/search?q=${Shoppies.youtubeNames[num]}`, {
 "method": "GET",
 "headers": {
   "x-rapidapi-host": "youtube-rest-api.p.rapidapi.com",
   "x-rapidapi-key": "3ae1d00c97msh298612aebb81230p11684djsn405007844583"
 }
}).then(response => response.json())
.then(data => {
 console.log(data)
 if(data.playlistData.length){
   window.open(`https://youtube.com/watch?v=${data.playlistData[0].endpointVideoId}`, '_blank')
 }else{
   window.open(`https://youtube.com/watch?v=${data.videoData[0].videoId}`, '_blank')
 }
})
},
}

Shoppies.savedList =
  JSON.parse(localStorage.getItem(Shoppies.savedList)) == null
    ? ''
    : JSON.parse(localStorage.getItem(Shoppies.savedList));
  //
  window.onbeforeunload = Shoppies.saveList;
