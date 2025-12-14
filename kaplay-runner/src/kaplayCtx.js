import kaplay from "kaplay";

// initialized canvas
const k = kaplay({
  width: 1920,
  height: 1080,
  // keep aspect ratio
  letterbox: true,
  // background color
  background: [0, 0, 0],
  // Don't set kaplay globally
  global: false,
  touchToMouse: true,
  buttons: {
    jump: {
      keyboard: ["space"],
      mouse: "left",
    },
  },
  debugKey: "d",
  debug: true,
});

export default k;
