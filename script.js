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

async function main(){
    //get the list of all the songs
    let songs = await getsongs();
    console.log(songs)

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
    var audio = new Audio(songs[0]);
    // audio.play()

    audio.addEventListener("loadeddata",()=>{
        let duration = audio.duration;
        console.log(audio.duration,audio.currentSrc,audio.currentTime)
        //the duration variable now holds the duration (in seconds) of the audion clip

    });
}

main(); 