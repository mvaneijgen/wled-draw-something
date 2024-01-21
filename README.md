# WLED Draw Something
Draw and send pixel art direcly to your WLED 2D Matrix 

## About
I've made this tool so I could send pixel art to my SO, just as a fun way to leave a digital note at a at a random time in the day.

## Road map
[] Drag on mobile
[] minify .html file

## Tools used
This tool is build using Vue.js and there is some SCSS to easily write CSS

## Build process
I use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass) to work on the app localy.

And there is a `build.js` file which creates a `drawsomething.html` with inline CSS and JS. Use Yarn or NPM to install the dependencies and then use `node build.js` to genrate the file in the `/dist` folder
