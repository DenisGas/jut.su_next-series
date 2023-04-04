const nextSeriesBeforeEnd = document.getElementById("nextSeriesBeforeEnd");
const nextSeriesAfterEnd = document.getElementById("nextSeriesAfterEnd");
const skipIntro = document.getElementById("skipIntro");
const nextSeriesBeforeEndLabel = document.getElementById(
  "nextSeriesBeforeEndLabel"
);
const nextSeriesAfterEndLabel = document.getElementById(
  "nextSeriesAfterEndLabel"
);
const skipIntroLabel = document.getElementById("skipIntroLabel");

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
      if (nextSeriesBeforeEndBool == true) {
        nextSeriesBeforeEnd.checked = true;
      } else {
        nextSeriesAfterEnd.checked = true;
      }

      if (skipIntroBool == true) {
        skipIntro.checked = true;
      } else {
        skipIntro.checked = false;
      }
    }
  );
}

storage();

nextSeriesBeforeEndLabel.addEventListener("click", () => {
  chrome.storage.local.set({ nextSeriesBeforeEndBool: true });
  chrome.storage.local.set({ nextSeriesAfterEndBool: false });
});

nextSeriesAfterEndLabel.addEventListener("click", () => {
  chrome.storage.local.set({ nextSeriesBeforeEndBool: false });
  chrome.storage.local.set({ nextSeriesAfterEndBool: true });
});

skipIntroLabel.addEventListener("click", () => {
  if (skipIntro.checked == true) {
    chrome.storage.local.set({ skipIntroBool: true });
  } else {
    chrome.storage.local.set({ skipIntroBool: false });
  }
});
