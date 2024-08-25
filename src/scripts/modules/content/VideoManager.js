// VideoManager.js
class VideoManager {
    constructor(videoElement, videoData) {
      this.videoElement = videoElement;
      this.videoData = videoData;
    }
  
    extractVideoData() {
      const scripts = document.querySelectorAll("script");
      let videoData = {};
      scripts.forEach((script) => {
        const hasPviewId = /pview_id\s*=\s*".*?";/;
        if (hasPviewId.test(script.innerText)) {
          let code = script.innerText;
          const base64StartIndex = code.indexOf("Base64.decode(") + 15;
          const base64EndIndex = code.indexOf(")");
  
          const base64String = code
            .substring(base64StartIndex, base64EndIndex)
            .trim();
          const decodedString = atob(base64String.replace(/"/g, ""));
  
          decodedString
            .split(";")
            .filter((line) => line.trim() !== "")
            .forEach((line) => {
              const [key, value] = line.trim().split("=");
              if (key && value) {
                videoData[key.trim()] = value.trim().replace(/"/g, "");
              }
            });
        }
      });
      return videoData;
    }
  
    static async findVideoElement() {
      return new Promise((resolve) => {
        const checkVideoElemOnPage = setInterval(() => {
          const video = document.getElementById("my-player_html5_api");
          if (video) {
            clearInterval(checkVideoElemOnPage);
            resolve(video);
          }
        }, 100);
      });
    }
  }
  
export default VideoManager;