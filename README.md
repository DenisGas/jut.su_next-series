# jut.su Next-Series

Chrome extension for [Jut.su](https://jut.su/) which makes video auto-play, auto-skip anime intro, and auto-open next series after the end of the current one.

## Features:

- Automatically plays video ✌️
- Automatically skip anime intro 🔥
- Open next episode 🤩
- One click to FullScreen(Overlay) 👍

## How to install/use extension

To use the extension on your phone, you can use the kiwi browser.

### Install (ZIP edition)

1. Install zip and unpack to a convenient location.

   Click on latest release.

   ![Latest Release img](./img/relise_img.png)

   Click on jut.su_next-series_v\*.zip file (not source code).

   ![Zip](./img/zip.png)

2. Open the chrome://extensions page.
3. Turn on developer mode in the top right corner.
4. Click Load unpacked extension.
5. Find and select the extension folder.

### Use

![ExtensionUi](./img/UI.png)

1. "Следующая серия до титров" - auto-transition to the next series on credits, before the video end.
2. "Следующая серия после конца серии" - auto-transition to the next series after the video end.
3. "Пропускать заставку" - skip anime intro.
4. "Видео с самого начала" - starts the series from the beginning
5. "One click to fullScreen" - create overlay which, when clicked, opens the video in full screen.

## Some Error

1.  Console error after page reload  
    ![GoogleErrorImg](./img/G_Error.png)

    Due to Google's policy that video auto-play does not work before the user has interacted with the site.

    After reloading the page, video auto-play does not work. But the next series will start.
