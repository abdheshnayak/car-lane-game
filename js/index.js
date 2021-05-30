var gameObj = new Game();

document.getElementById("play").addEventListener(
  "click",
  (e) => {
    this.gameObj.startAnimating(50);
  },
  this
);
