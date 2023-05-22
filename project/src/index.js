$fx.params([
  {
    id: "iteration",
    name: "🔀",
    type: "number",
    default: 100,
    options: {
      min: 0,
      max: 999,
      step: 1,
    },
  },
  {
    id: "palette",
    name: "palette",
    type: "select",
    default: "8",
    options: {
      options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    }
  },
  {
    id: "background",
    name: "background",
    type: "select",
    default: "light",
    options: {
      options: ["light", "color 1", "color 2", "dark"],
    }
  },
  {
    id: "colDist",
    name: "col dist",
    type: "select",
    default: "reduced 1",
    options: {
      options: ["mono", "reduced 1", "reduced 2", "full palette", "micro"],
    }
  },
]);


// $fx.features({
//   "Palette": $fx.getParam("palette"),
//   "Background": $fx.getParam("background"),
//   "Strategy": $fx.getParam("strategy"),
// })
