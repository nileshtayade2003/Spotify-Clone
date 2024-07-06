let current_song = new Audio();
let songs; 
let curr_folder;

function secondsToMinutesSeconds(seconds)
{
    if(isNaN(seconds) || seconds<0)
        {
            return "00:00";
        }
        
        const minutes = Math.floor(seconds/60);
        const remainingSeconds = Math.floor(seconds%60);

        const formattedMinutes = String(minutes).padStart(2,'0');
        const formattedSeconds = String(remainingSeconds).padStart(2,'0');
        return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder){
    curr_folder = folder;
    let a =await fetch(`http://127.0.0.1:5500/${folder}`);
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.querySelectorAll("a");
    

     songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }    
    }

     //showing all the songs in playlist
     let songul = document.querySelector('.song-list ul');
     songul.innerHTML = "";
     for (const song of songs) {
         songul.innerHTML = songul.innerHTML + `<li>
                 <img class="invert" src="img/music.svg" alt="">
                 <div class="info">
                   <div>${song.replaceAll("%20"," ")}</div>
                   <div>Nilu</div>
                 </div>
                 <div class="playnow">
                   <span>Play now</span>
                   <img class="invert" src="img/play.svg" alt="">
                 </div>
             </li>`;
     }
 
     //play the first song
     // var audio = new Audio(songs[0]);
     // audio.play()
 
     //attaching an event listener to each song
     Array.from(document.querySelector(".song-list").getElementsByTagName('li')).forEach((e)=>{
         e.addEventListener('click',element=>{
             playmusic(e.querySelector('.info').firstElementChild.innerHTML.trim(""));
         })
     })

    return songs;
}

const playmusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/"+track)
    current_song.src =`/${curr_folder}/`+track
    if(!pause)
    {
        current_song.play()
        play.src = 'img/pause.svg'
    }

    document.querySelector('.song-info').innerHTML = decodeURI(track);
    document.querySelector('.song-time').innerHTML = "00:00 / 00:00";

    
}

async function displayalbums(){
    let a =await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');
    let cardContainer = document.querySelector('.card-container')

    let array = Array.from(anchors);

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
       
        if((e.href.includes("/songs")) && (e.href.split("/").slice(-1)[0])!="songs" ){
            let folder = e.href.split("/").slice(-1)[0]
            

            // get the metadata of the folder
            let a =await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
             let response = await a.json();

             cardContainer.innerHTML = cardContainer.innerHTML + `
                        <div  data-folder="${folder}"   class="card">
                        <div class="play">
                            <i class="fa-solid fa-play"></i>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }


     //load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName('card')).forEach(e=>{
        e.addEventListener('click',async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
    })
    })
    
}

async function main(){


    //get the list of all the songs
    await getsongs('songs/ncs');
    // console.log(songs)
    playmusic(songs[0],true);


    //display all the albums on the page
    await displayalbums()

   
   //attach an event listener to play, next and previous
   play.addEventListener('click',()=>{
        if(current_song.paused)
        {
            current_song.play();
            play.src = 'img/pause.svg'
        }
        else{
            current_song.pause();
            play.src = 'img/play.svg'
        }
    })

    //listen for time update function
    current_song.addEventListener('timeupdate',()=>{
        // console.log(current_song.currentTime, current_song.duration)
        document.querySelector('.song-time').innerHTML=`${secondsToMinutesSeconds(current_song.currentTime)} / ${secondsToMinutesSeconds(current_song.duration)}`;

        document.querySelector('.circle').style.left = (current_song.currentTime/current_song.duration) *100 + "%";
    })

    //add an eventlistener to seekbar
    document.querySelector('.seekbar').addEventListener('click',e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector('.circle').style.left = percent +"%";
        current_song.currentTime = ((current_song.duration) *percent)/100;
    })

    //add an event listener for hamberger
    document.querySelector(".hamburger").addEventListener('click',()=>{
        document.querySelector('.left').style.left = '0%';
    })

    //add an event listener to close hamburger
    document.querySelector(".close-hamburger").addEventListener('click',()=>{
        document.querySelector('.left').style.left = '-120%';
    })

    //add event listener to previous
    previous.addEventListener('click',()=>{
        console.log('previous clicked')
        let index = songs.indexOf(current_song.src.split('/').slice(-1)[0])
        // console.log(songs,index)
        if((index-1)>=0){
            playmusic(songs[index-1])
        }
    })

    //add event listener to next
    next.addEventListener('click',()=>{
        console.log('next clicked')
        let index = songs.indexOf(current_song.src.split('/').slice(-1)[0])
        // console.log(songs,index)
        if((index+1)<songs.length){
            playmusic(songs[index+1])
        }
        
    })

    //add an event to volume
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change',(e)=>{
        // console.log(e,e.target,e.target.value)
        current_song.volume = parseInt(e.target.value)/100;
    })


    //add event listener to mute the track
    document.querySelector('.volume img').addEventListener('click',(e)=>{
        if(e.target.src.includes("img/volume.svg"))
        {

            e.target.src= e.target.src.replace("img/volume.svg","img/mute.svg")
            current_song.volume = 0;
            document.querySelector('.range').getElementsByTagName('input')[0].value =0;
        }
        else{
            current_song.volume=.1;
            e.target.src=e.target.src.replace("img/mute.svg","img/volume.svg");
            getElementsByTagName('input')[0].value =10;
        }

    })


   
}

main(); 