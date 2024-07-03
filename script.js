let current_song = new Audio();

function secondsToMinutesSeconds(seconds)
{
    if(isNaN(seconds) || seconds<0)
        {
            return "ivalid input";
        }
        
        const minutes = Math.floor(seconds/60);
        const remainingSeconds = Math.floor(seconds%60);

        const formattedMinutes = String(minutes).padStart(2,'0');
        const formattedSeconds = String(remainingSeconds).padStart(2,'0');
        return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(){
    let a =await fetch("http://127.0.0.1:5500/songs");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.querySelectorAll("a");
    console.log(as)

    let songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href.split('/songs/')[1]);
        }    
    }

    return songs;
}

const playmusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/"+track)
    current_song.src = "/songs/"+track
    if(!pause)
    {
        current_song.play()
        play.src = 'pause.svg'
    }

    document.querySelector('.song-info').innerHTML = decodeURI(track);
    document.querySelector('.song-time').innerHTML = "00:00 / 00:00";

}

async function main(){

    

    //get the list of all the songs
    let songs = await getsongs();
    // console.log(songs)
    playmusic(songs[0],true);

    //showing all the songs in playlist
    let songul = document.querySelector('.song-list ul');
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20"," ")}</div>
                  <div>Nilu</div>
                </div>
                <div class="playnow">
                  <span>Play now</span>
                  <img class="invert" src="play.svg" alt="">
                </div>
            </li>`;
    }

    //play the first song
    // var audio = new Audio(songs[0]);
    // audio.play()

    //attaching an event listener to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName('li')).forEach((e)=>{
        e.addEventListener('click',element=>{
            console.log(e.querySelector('.info').firstElementChild.innerHTML);
            playmusic(e.querySelector('.info').firstElementChild.innerHTML.trim(""));
        })
    })

   //attach an event listener to play, next and previous
   play.addEventListener('click',()=>{
        if(current_song.paused)
        {
            current_song.play();
            play.src = 'pause.svg'
        }
        else{
            current_song.pause();
            play.src = 'play.svg'
        }
    })

    //listen for time update function
    current_song.addEventListener('timeupdate',()=>{
        // console.log(current_song.currentTime, current_song.duration)
        document.querySelector('.song-time').innerHTML=`${secondsToMinutesSeconds(current_song.currentTime)} / ${secondsToMinutesSeconds(current_song.duration)}`;
    })
}

main(); 