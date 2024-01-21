console.clear();
const { createApp } = Vue;

const App = {
  data() {
    return {
      loading: true,
      title: "Draw something",
      version: "1.0",
      url: "",
      url: "http://wled.local/json",
      size: 10,
      x: 1,
      y: 1,
      xPallete: 4,
      yPallete: 2,
      timer: 0,
      color: "#ff2500",
      isMouseDown: false,
      fill: [],
      // 🎨 Default color pallet
      fillPallete: [
        "#ff2500",
        "#ff9305",
        "#fdfc00",
        "#20f80f",
        "#0533ff",
        "#ffffff",
        "#929292",
        "#000000"
      ],
      options: false,
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
      return `{
   "on": true,
   "bri": 128, ${this.setTimer}
   "v": true,
   "seg": {
      "i":[${this.seg}]
   }
}`;
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
      let string = "";
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
      localStorage.fill = this.fill.toString();
      e.target.setAttribute("fill", this.color);
      this.fill[e.target.dataset.number] = this.color;
      if (!this.isMouseDown) {
        this.post()
      }
    },
    // 🖱️ Right click remove color
    rightClick: function (e) {
      e.target.setAttribute("fill", '#000000');
      this.post();
    },
    // END 🖌️ Paint controls --------------//

    //--------------------------------//
    // 🐵 Send API request
    //--------------------------------//
    post: function () {
      console.warn(`Fetching ${this.url}`);
      console.warn(this.json);
      fetch(this.url, {
        method: "POST",
        mode: "cors",
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
    },
    get: function () {
      console.warn(`Fetching ${this.url}`); // ! delete
      fetch(this.url, {
        method: "GET",
        mode: "cors",
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
          this.loading = false;
          this.setupColors();
        })
        .catch((error) => {
          console.error("Fetch Error:", error);
        });
    }
    // END 🐵 Send API request --------------//
  },
  watch: {
    //--------------------------------//
    // 💾 Save everything to local storage
    //--------------------------------//
    color: function (newColor) {
      // Update 🎨 pallete history
      // TODO: Check if color is already in pallete then don't update
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
    // * this.url = `${window.location.host}/json`;

    //--------------------------------//
    // 💾 Get everything from local storage
    //--------------------------------//
    // if (localStorage.url) this.url = localStorage.url; // Enable
    if (localStorage.color) this.color = localStorage.color;
    if (localStorage.fill) this.fill = localStorage.fill.split(",");;
    if (localStorage.fillPallete) this.fillPallete = localStorage.fillPallete.split(",");
    if (localStorage.timer) this.timer = localStorage.timer;
    // END 💾 Get everything from local storage  --------------//
  },
  created() {
    this.get();
  }
};

createApp(App).mount("#app");
