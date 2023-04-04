window.addEventListener("load", function () {
  storage();
});

function storage() {
  chrome.storage.local.get(
    ["nextSeriesBeforeEndBool", "nextSeriesAfterEndBool", "skipIntroBool"],
    (result) => {
      let nextSeriesBeforeEndBool = result.nextSeriesBeforeEndBool;
      let nextSeriesAfterEndBool = result.nextSeriesAfterEndBool;
      let skipIntroBool = result.skipIntroBool;

      if (
        nextSeriesBeforeEndBool == undefined ||
        nextSeriesAfterEndBool == undefined ||
        skipIntroBool == undefined
      ) {
        chrome.storage.local.set({ nextSeriesBeforeEndBool: true });
        chrome.storage.local.set({ nextSeriesAfterEndBool: false });
        chrome.storage.local.set({ skipIntroBool: true });
        return storage();
      }

      main(nextSeriesBeforeEndBool, nextSeriesAfterEndBool, skipIntroBool);
    }
  );
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  // console.log(changes, namespace);
  storage();
});

function getRefactoredEpisodeString(websitePage) {
  if (websitePage.includes("episode-")) {
    let urlString = websitePage.split("episode-");
    urlString.push("episode-");
    return urlString;
  }
  if (websitePage.includes("film-")) {
    let urlString = websitePage.split("film-");
    urlString.push("film-");
    return urlString;
  }
  return null;
}

function getEpisodeNum(str) {
  let num = parseInt(str.replace(/[^\d]/g, ""));
  return num; // return example 20
}

function nextSeries(episodeString, intervalFunc) {
  clearInterval(intervalFunc);
  let episodeNum = getEpisodeNum(String(episodeString[1]));

  window.location.href =
    String(episodeString[0]) +
    String(episodeString[2]) +
    String(episodeNum + 1) +
    ".html";
}

function skipIntro(element, intervalFunc) {
  clearInterval(intervalFunc);
  element.click();
}

function main(nextSeriesBeforeEndBool, nextSeriesAfterEndBool, skipIntroBool) {
  let page = window.location.href;
  let refactoredEpisodeString = getRefactoredEpisodeString(page);

  if (refactoredEpisodeString != null) {
    let video = document.querySelector("#my-player_html5_api");
    let nextSerBtn = document.querySelector(".vjs-overlay-bottom-right");
    let skipIntroBtn = document.querySelector(".vjs-overlay-bottom-left");

    video.play();
    video.mute = false;

    if (skipIntroBtn) {
      if (skipIntroBool == true) {
        let checkSkipIntroBtnVisible = setInterval(function () {
          if (skipIntroBtn.classList.contains("vjs-hidden") != true) {
            skipIntro(skipIntroBtn, checkSkipIntroBtnVisible);
          }
        }, 2000);
      }
    } else {
      console.log("skipIntroBtn не найден.");
    }

    if (nextSerBtn) {
      if (nextSeriesBeforeEndBool == true) {
        let checkVideoEnded = setInterval(function () {
          if (nextSerBtn.classList.contains("vjs-hidden") != true) {
            nextSeries(refactoredEpisodeString, checkVideoEnded);
          }
        }, 3000);
      }
      if (nextSeriesAfterEndBool == true) {
        let checkVideoEnded = setInterval(function () {
          if (video.ended == true) {
            nextSeries(refactoredEpisodeString, checkVideoEnded);
          }
        }, 3000);
      }
    } else {
      console.log("nextSerBtn не найден.");
    }
  }
}
