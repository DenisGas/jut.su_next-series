<div align=center>
   <img width=150 src=https://github.com/DenisGas/jut.su_next-series/blob/main/img/icon.png alt='logo' />
   <h1>jut.su Next-Series</h1>
</div>

<div align=center>
   
![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/godmnckhgkgojikjpiahppfnmhgkfpjp)
![GitHub release (with filter)](https://img.shields.io/github/v/release/DenisGas/jut.su_next-series)
![GitHub all releases](https://img.shields.io/github/downloads/DenisGas/jut.su_next-series/total)
![GitHub Repo stars](https://img.shields.io/github/stars/DenisGas/jut.su_next-series)
![GitHub](https://img.shields.io/github/license/DenisGas/jut.su_next-series)

</div>

Chrome extension for [Jut.su](https://jut.su/) which makes video auto-play, auto-skip anime intro, and auto-open next series after the end of the current one.

If you want the anime to go full screen automatically, I made a [python script](https://github.com/DenisGas/watch_jut.su) that does that.

## Features:

- Automatically plays video ✌️
- Automatically skip anime intro 🔥
- Open next episode 🤩
- One click to FullScreen(Overlay) 👍
- Video hotkey work (Press "F" to fullScreen) ❤️

## How to install/use extension

To use the extension on your phone, you can use the Kivi Browser.

### Install (Chrome store)

[download from chrome store](https://chromewebstore.google.com/detail/jutsu-next-series/godmnckhgkgojikjpiahppfnmhgkfpjp)

### Use

![ExtensionUi](./img/UI.png)

1. "Следующая серия до титров" - auto-transition to the next series on credits, before the video end.
2. "Следующая серия после конца серии" - auto-transition to the next series after the video end.
3. "Пропускать заставку" - skip anime intro.
4. "Видео с самого начала" - starts the series from the beginning
5. "One click to fullScreen" - create overlay which, when clicked, opens the video in full screen.

## Some Error

-  After reloading the page, the autoplay video does not work
   
    - **Console error**\
       ![GoogleErrorImg](./img/G_Error.png)

       Due to Google's policy that video auto-play does not work before the user has interacted with the site.

       After reloading the page, video auto-play does not work. But the next series will start.
    
    - **Fix**
       Also, if you make a [PWA from the site](https://support.google.com/chrome_webstore/answer/3060053#zippy=%2Cadd-an-app-from-the-chrome-web-store), even after restarting the site, autoplay will work (checked Chrome and Edge)
