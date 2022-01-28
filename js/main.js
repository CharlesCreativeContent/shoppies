let Shoppies = {
    proxy: "https://cors-anywhere.herokuapp.com/",
    find: ()=>{
      document.getElementById('loading').src = 'https://static.wixstatic.com/media/5d146b_3ddf641633024d5fa73b7974131fbaea~mv2.gif'
      document.getElementById('myList').classList.toggle('loadingToggle')
      document.querySelector('ul').classList.toggle('loadingToggle')
      Shoppies.availabilites = []
      document.querySelector('ul').innerHTML = ''
      Shoppies.input = document.querySelector('input').value
      document.querySelector('input').value = ''
      fetch(Shoppies.proxy+`http://www.omdbapi.com/?s=${Shoppies.input}&apikey=4406d2fa`, {mode: 'cors'})
      .then(response => response.json())
      .then(data => {
        console.log(data)
        Shoppies.titles = data.Search.sort((a,b)=>parseInt(b.Year.slice(0,4))-parseInt(a.Year.slice(0,4))).map(x=>x.Title)
        Shoppies.years = data.Search.sort((a,b)=>parseInt(b.Year.slice(0,4))-parseInt(a.Year.slice(0,4))).map(x=>x.Year.slice(0,4))
        Shoppies.ids = data.Search.sort((a,b)=>parseInt(b.Year.slice(0,4))-parseInt(a.Year.slice(0,4))).map(x=>x.imdbID)
        Shoppies.imgs = data.Search.sort((a,b)=>parseInt(b.Year.slice(0,4))-parseInt(a.Year.slice(0,4))).map(x=>x.Poster)
        Shoppies.youtubeNames = data.Search.sort((a,b)=>parseInt(b.Year.slice(0,4))-parseInt(a.Year.slice(0,4))).map(x=>`${x.Title} ${x.Year.slice(0,4)} Movie Trailer`)

        let allAvailabilities = Promise.all(
          Shoppies.titles.map((z,i)=>{
            return fetch(Shoppies.proxy+`https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${z}`, {
              "method": "GET",
              "headers": {
                "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
                "x-rapidapi-key": "84e7a29794msh94419e852b59e91p10e7cbjsn04b5bacebd18"
              }})
            .then(response => response.json()).then(y=>{
            console.log(y)
            Shoppies.availabilities.push(y)
            let start = `<li class="listItem"><img src="${Shoppies.imgs[i]}"/><h2>${Shoppies.titles[i]} (${Shoppies.years[i]})</h2><a onclick='Shoppies.nominate(${i})'><img src='img/thumbsup.png'/></a>`
            document.querySelector('ul').innerHTML += `${start}${y.results.length!==0?`<a target="_blank" href="`+y.results[0].locations.map(x=>`${x.url}"><img src="${x.icon}`).join(`"/></a><a target="_blank" href="`)+`"/></a>`:''}<a onclick='Shoppies.getTrailers(${i})'><img src="img/trailer.jpg"/></a></li>`
            Shoppies.addEvents()
            document.getElementById('loading').src = ''
            document.getElementById('myList').className = ''
            document.querySelector('ul').className = ''
          }).catch(err => console.log(err))
        }))
  })},

  nominate: (num)=>{
    if (!Shoppies.votes.includes(Shoppies.ids[num])){
      document.querySelectorAll('ul li')[num].classList.toggle('animate__flipOutY')
      let listItem = document.createElement('li')
      let start = `<img src="${Shoppies.imgs[num]}"/><h2>${Shoppies.titles[num]} (${Shoppies.years[num]})</h2><a><img src='img/thumbsupIn.png'/></a>`
      listItem.innerHTML = `${start}${Shoppies.availabilities[num].results.length!==0? `<a target="_blank" href="`+Shoppies.availabilities[num].results[0].locations.map(x=>`${x.url}"><img src="${x.icon}`).join(`"/></a><a target="_blank" href="`)+`"/></a>`:''}<a onclick='Shoppies.getTrailers(${num})'><img src="img/trailerIn.png"/></a></li>`
      Shoppies.votes.push(Shoppies.ids[num])
    setTimeout(()=>{
      document.querySelectorAll('ul li')[num].style.display='none'
      document.getElementById('myList').appendChild(listItem)
      Shoppies.addEvents()
      Shoppies.save()
      Shoppies.banner()
    },650)
  }},

  denominated: e=>{
    document.querySelector('body').style.top = '0px'
    document.querySelector('header').style.display = 'none'
    const index = [...document.getElementById('myList').children].indexOf(e.target.parentElement.parentElement);
    Shoppies.votes.splice(index,1)
    e.target.parentElement.parentElement.classList.toggle('animate__flipOutY')
    setTimeout(()=>{
    var element = document.querySelectorAll('ol li')[index]
    document.getElementById('myList').removeChild(element)
    Shoppies.save()
  },650)
  },

  availabilities: [],

  votes: [],

  getTrailers: (num)=>{
    fetch(`https://youtube-search-and-download.p.rapidapi.com/search?query=${Shoppies.youtubeNames[num].split(" ").join("%20")}%20Trailer&type=v&duration=s&sort=r`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "youtube-rest-api.p.rapidapi.com",
        'x-rapidapi-key': '84e7a29794msh94419e852b59e91p10e7cbjsn04b5bacebd18'
        }})
    .then(response => response.json())
    .then(data => {
        console.log(data)
        window.open(`https://youtube.com/watch?v=${data.contents[0].video.videoId}`, '_blank')
      // if(data.playlistData.length){
      //   window.open(`https://youtube.com/watch?v=${data.playlistData[0].endpointVideoId}`, '_blank')
      //   }else{
      //   window.open(`https://youtube.com/watch?v=${data.videoData[0].videoId}`, '_blank')
      //   }
      })
    },

  banner: ()=>{
    if(document.querySelectorAll('ol li').length>=5){

      document.querySelector('header').style.display = 'block'
      document.querySelector('header').classList.toggle('animate__heartBeat')
      setTimeout(()=>{
      document.querySelector('header').classList.toggle('animate__heartBeat')
      },2000)
      document.querySelector('body').style.position = 'relative'
      document.querySelector('body').style.top = '25px'
      confetti.start();
      setTimeout(()=>{
        confetti.stop()
      }, 2500)
    }
  },

  highlight: (e)=>{
    e.target.classList.toggle('hover')
    e.target.classList.toggle('animate__heartBeat')

  },

  thumbsDown: (e)=>{
    e.target.src = "img/thumbsDown.png"
    e.target.style.backgroundImage = "radial-gradient(farthest-corner at 50% 50%, red 0%, #fff 100%)"
    e.target.addEventListener('mouseleave', Shoppies.thumbsUp);
    e.target.addEventListener('click', Shoppies.denominated)
  },

  thumbsUp: (e)=>{
    e.target.style.backgroundImage = ""
    e.target.style.backgroundColor = "rgba(0, 76, 63,0.80)"
    e.target.src = "img/thumbsupIn.png"
  },

  save: ()=>{
    localStorage.setItem('list', `${document.getElementById('myList').innerHTML}`);
    localStorage.setItem('votes', Shoppies.votes.join('|'));
  },

  load:()=>{
    if (localStorage.getItem('list')!=null){
      document.getElementById('myList').innerHTML = localStorage.getItem('list')
      Shoppies.votes = localStorage.getItem('votes').split('|')
      Shoppies.addEvents()
      Shoppies.banner()
    }
  },

  addEvents: ()=>{
  document.querySelectorAll('a img').forEach(x=>{
    x.addEventListener('mouseenter', Shoppies.highlight);
    x.addEventListener('mouseleave', Shoppies.highlight);
  })
  document.querySelectorAll('ol [src="img/thumbsupIn.png"]').forEach(x=>{
    x.addEventListener('mouseenter', Shoppies.thumbsDown);
  })
  document.querySelectorAll('ol [src="img/thumbsDown.png"]').forEach(x=>{
    x.addEventListener('mouseleave', Shoppies.thumbsUp);
  })},

}

Shoppies.load()
