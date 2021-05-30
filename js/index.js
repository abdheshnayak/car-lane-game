var gameObj = new Game();

this.gameObj.startAnimating(50);

document.getElementById("play").addEventListener(
  "click",
  (e) => {
    this.gameObj.startAnimating(50);
  },
  this
);
