# WLED Draw Something
Draw and send pixel art direcly to your WLED 2D Matrix.

## [Try the demo](https://mvaneijgen.nl/wled-draw-something/) 🚀
Note: the demo page can't access your API due to HTTPS Mixed Content

[![-AHuRUJW-0g](https://img.youtube.com/vi/-AHuRUJW-0g/0.jpg)](https://www.youtube.com/watch?v=-AHuRUJW-0g)

## Use the tool
You can open the `drawsomething.html` file into any browser set the correct API endpoint, this looks like this `http://[device_ip_address]/json` or upload the `drawsomething.html` to your WLED environment, see below.

## Install into your WLED environment
Go to [releases](https://github.com/mvaneijgen/wled-draw-something/releases/) and download the latest released file `drawsomething.html`. Within your 

### Steps
1. Download the `drawsomething.html` from [releases](https://github.com/mvaneijgen/wled-draw-something/releases/) 
1. Go to the URL `http://[device_ip_address]/edit`
1. Upload the `drawsomething.html` file using the UI
1. Go to `http://[device_ip_address]/drawsomething.html`

## About
I've made this tool so I could send pixel art to my SO, just as a fun way to leave a digital note at a at a random time in the day.

## Road map
- [x] ~~Version 1~~ 🎉
- [ ] Drag on mobile
- [ ] minify .html file
- [ ] Setup proper JSON object
- [ ] Load current image
- [ ] Undo/redo
- [ ] Propper build step, complile scss, setup local server and run `node build.js` on changes (was looking in to Vite.js)

## Tools used
This tool is build using Vue.js and there is some SCSS to easily write CSS

## Build process
I use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass) to work on the app localy.

And there is a `build.js` file which creates a `drawsomething.html` with inline CSS and JS. Use Yarn or NPM to install the dependencies and then use `node build.js` to genrate the file in the `/dist` folder