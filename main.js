window.addEventListener("load", function() {
    main();
  });


let page = window.location.href;


function getRefactoredEpisodeString(websitePage){
  let episodeString = websitePage.split("episode-");
  return episodeString // return example ["https://jut.su/anime/","20.html"]
}

function getEpisodeNum(str) {
	let num = parseInt(str.replace(/[^\d]/g, ''));
  return num; // return example 20
}

function nextSeries(episodeString,intervalFunc){
  clearInterval(intervalFunc);
  let episodeNum = getEpisodeNum(String(episodeString[1]));
  window.location.href = String(episodeString[0])+ "episode-" + String(episodeNum + 1) +".html";
}


function main(){
  let refactoredEpisodeString = getRefactoredEpisodeString(page);

  if (refactoredEpisodeString.length != 1){ //Verification is weird but works
    let video = document.querySelector("#my-player_html5_api");

    video.play();
    video.mute = false;
    
    let checkVideoEnded = setInterval(function() {
      if(video.ended == true){
        nextSeries(refactoredEpisodeString,checkVideoEnded);
      }
    }, 1000);//checks every second if the video is ended
  }
}















