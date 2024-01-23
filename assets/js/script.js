console.clear();
const { createApp } = Vue;

const App = {
  data() {
    return {
      // App info
      title: "Draw something",
      version: "beta 1.2",
      // WLED JSON
      url: "",
      size: 10,
      x: 1,
      y: 1,
      timer: 0,
      fill: [],
      // 🎛️ Controls
      color: "#ff2500",
      isMouseDown: false,
      xPallete: 4,
      yPallete: 2,
      fillPallete: [ // 🎨 Default color pallet
        "#ff2500",
        "#ff9305",
        "#fdfc00",
        "#20f80f",
        "#0533ff",
        "#ffffff",
        "#929292",
        "#000000"
      ],
      copied: false,
      copiedFailed: false,
      // App state
      loading: true,
      options: false,
      ignore: false,
      demo: true,
    };
  },
  computed: {
    viewBox: function () {
      return `0 0 ${this.size * this.x} ${this.size * this.y}`;
    },
    viewBoxPallete: function () {
      return `0 0 ${this.size * this.xPallete} ${this.size * this.yPallete}`;
    },
    //--------------------------------//
    // Convert fill to correct array for JSON API
    //--------------------------------//
    seg: function () {
      let format = this.fill
        .map((i) => `"${i}"`)
        .join(",")
        .replaceAll("#", "");

      return format;
    },
    // END Convert fill to correct array for JSON API --------------//
    setTimer: function () {
      let string = ``;
      if (this.timer > 0) {
        string = `"nl": {"on": true, "dur": ${this.timer}},`;
      }
      return string;
    },
    //--------------------------------//
    // Create JSON body for POST
    //--------------------------------//
    json: function () {
      return `{"on": true,"bri": 128,${this.setTimer} "v": true, "seg": {"i":[${this.seg}]}}`;
    }
    // END Create JSON body for POST --------------//
  },
  methods: {
    clear: function () {
      this.fill = [];
      this.setupColors();
    },
    //--------------------------------//
    // Create grid and set default color to off
    //--------------------------------//
    setupColors: function () {
      for (let y = 0; y < this.y; y++) {
        for (let x = 0; x < this.x; x++) {
          this.fill.push(`#000000`);
        }
      }
    },
    // END Create grid and set default color to off --------------//
    // Update 🎨 pallete history
    changeColor: function (e) {
      this.color = e.target.getAttribute("fill");
    },
    //--------------------------------//
    // 🖌️ Paint controls
    //--------------------------------//
    // Check if ✊  dragging
    dragColor: function (e) {
      if (this.isMouseDown) {
        this.setColor(e);
      }
    },
    mouseDown: function (e) {
      this.isMouseDown = true;
    },
    mouseUp: function (e) {
      this.isMouseDown = false;
      this.post()
    },
    changeColor: function (e) {
      this.color = e.target.getAttribute("fill");
    },
    // 🪣 fill color
    setColor: function (e) {
      e.target.setAttribute("fill", this.color);
      this.fill[e.target.dataset.number] = this.color;
      localStorage.fill = this.fill.toString();
    },
    // 🖱️ Right click remove color
    rightClick: function (e) {
      this.fill[e.target.dataset.number] = '#000000';
      e.target.setAttribute("fill", '#000000');
      localStorage.fill = this.fill.toString();
    },
    // END 🖌️ Paint controls --------------//

    //--------------------------------//
    // 🐵 Send API request
    //--------------------------------//
    // POST request
    post: function () {
      if (!this.ignore) {
        fetch(this.url, {
          method: "POST",
          body: this.json,
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error("Fetch Error:", error);
          });
      }

    },
    // GET request
    get: function () {
      fetch(this.url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          this.x = data.info.leds.matrix.w;
          this.y = data.info.leds.matrix.h;
          this.options = false;
          this.loading = false;
          if (!localStorage.fill) {
            this.setupColors();
          }
        })
        .catch((error) => {
          this.options = true;
          // this.options = true;
          console.error("Fetch Error:", error);
        });
    },
    // END 🐵 Send API request --------------//
    //--------------------------------//
    // Copy preset 
    //--------------------------------//
    copy: function () {

      if (location.protocol !== 'https:') {
        const element = this.$refs.copy;
        const textToCopy = element.innerText;

        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();

        try {
          document.execCommand('copy');
          this.copied = true;
          console.log('Text copied to clipboard');
        } catch (err) {
          this.copiedFailed = true;
          console.error('Unable to copy text to clipboard', err);
        } finally {
          document.body.removeChild(textarea);
        }
      } else {
        const copyText = this.$refs.copy.innerText;
        console.warn(navigator);
        navigator.clipboard.writeText(copyText).then(() => {
          this.copied = true;
        }, function (err) {
          this.copiedFailed = true;
          console.error("Failed to copy text: ", err);
        });
      }
    },
    // END Copy preset --------------//
    ignoreNotice: function () {
      this.ignore = true;
      this.x = 16;
      this.y = 16;
      this.loading = false;
      this.options = false;
      this.setupColors();
    },
    mapUrlParameters: function () {
      const params = new URLSearchParams(window.location.search);
      params.forEach((value, key) => {
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          this[key] = value;
        }
      });
    }
  },
  watch: {
    url: function (newData) {
      this.get();
    },
    x: function (newData) {
      this.loading = false;
      this.fill = [];
      this.setupColors();
    },
    y: function (newData) {
      this.loading = false;
      this.fill = [];
      this.setupColors();
    },
    //--------------------------------//
    // 💾 Save everything to local storage
    //--------------------------------//
    color: function (newColor) {
      // Update 🎨 pallete history
      if (!this.fillPallete.includes(this.color)) {
        this.fillPallete.pop();
        this.fillPallete.unshift(this.color);
        localStorage.fillPallete = this.fillPallete.toString();
      }
      localStorage.color = newColor;
    },
    timer: function (newData) {
      localStorage.timer = newData;
    }
    // END 💾 Save everything to local storage --------------//
  },
  mounted() {
    const host = window.location.host;
    this.url = `http://${host}/json`;
    if (host === 'mvaneijgen.nl') {
      this.ignoreNotice();
      this.demo = true;
    }
    //--------------------------------//
    // 💾 Get everything from local storage
    //--------------------------------//
    // if (localStorage.url) this.url = localStorage.url; // Enable
    if (localStorage.color) this.color = localStorage.color;
    if (localStorage.fill) this.fill = localStorage.fill.split(",");
    if (localStorage.fillPallete) this.fillPallete = localStorage.fillPallete.split(",");
    if (localStorage.timer) this.timer = localStorage.timer;
    // END 💾 Get everything from local storage  --------------//
    this.mapUrlParameters()
  },
  // created() {
  //   const host = window.location.host;

  // }
};

createApp(App).mount("#app");
