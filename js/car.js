function Car(x, y, carDesign, MainObj) {
  that = this;

  that.carDesign = carDesign;

  // console.log(carDesign);

  that.left = 15;
  that.right = 85;

  that.x = x;
  that.y = y;

  that.getX = (value, percent) => {
    var left = value === 1 ? 15 : value === 2 ? 50 : 85;
    if (percent) {
      return left;
    }
    const road = document.getElementById("road");
    const fullWidth = road.clientWidth;
    const result = (left * fullWidth) / 100;
    return result;
  };

  that.getY = (value) => {
    const road = document.getElementById("road");
    const fullHeight = road.clientHeight;
    const result = (value * fullHeight) / 100;
    return result;
  };

  that.putCar = () => {
    var car = document.createElement("span");
    car.classList.add("car", "enemy-car", that.carDesign);

    car.style.left = that.getX(that.x, true) + "%";
    car.style.top = that.y + "%";

    that.car = car;

    var road = document.getElementById("road");

    road.appendChild(car);
  };
  that.findCollison = (car1, car2) => {
    if (car1 == car2) {
      // console.log(true);
      return;
    }
    var rect1 = {
      x: that.getX(car1.x),
      y: that.getY(car1.y),
      width: car1.car.clientHeight,
      height: car1.car.clientWidth,
    };

    var rect2 = {
      x: that.getX(car2.x),
      y: that.getY(car2.y),
      width: car2.car.clientHeight,
      height: car2.car.clientWidth,
    };

    if (
      Math.abs(rect1.x - rect2.x) <
        Math.abs(rect1.width / 2 + rect2.width / 2) &&
      Math.abs(rect1.y - rect2.y) <
        Math.abs(rect1.height / 2 + rect2.height / 2)
    ) {
      // console.log(rect1, rect2);
      return true;
      // collision detected!
    }
  };

  that.checkYCollison = (cars, y, smooth) => {
    // console.log(smooth);
    for (var i = 0; i < cars.length; i++) {
      var car = cars[i];
      if (
        Math.abs(that.getY(car.y) - that.getY(y)) <
        Math.abs(car.car.clientWidth * (3 + smooth / 10))
      ) {
        // console.log("collision");
        return true;
      }
    }
  };

  that.moveToUp = (car, carList, smooth) => {
    if (!that.checkYCollison(carList, -5, smooth)) {
      // console.log("moved");
      car.y = -5;
      car.x = Math.floor(Math.random() * 3);

      car.car.style.left = that.getX(car.x, true) + "%";

      // console.log(CARS);
      car.car.removeAttribute("class");
      car.car.classList.add(
        "car",
        "enemy-car",
        "car-" + (Math.floor(Math.random() * 40) + 1)
      );

      var score = document.getElementById("score");
      score.innerText = Number(score.innerText) + 1;

      if (
        Number(localStorage.getItem("high-score")) < Number(score.innerText)
      ) {
        localStorage.setItem("high-score", score.innerText);
      }
      document.getElementById("score-2").innerText = score.innerText;

      if (Number(score.innerText) % 15 == 0) {
        MainObj.bulletCount += 1;
      }
    }
  };

  that.moveXaxis = (car, pos) => {
    car.x = pos;
    car.car.style.left = that.getX(pos) + "px";
  };

  that.moveYaxis = (car, dir) => {
    if (dir < 0 && car.x > 1) {
      car.x -= 1;
      car.car.style.left = that.getX(car.x) + "px";
    } else if (dir > 0 && car.x < 3) {
      car.x += 1;
      car.car.style.left = that.getX(car.x) + "px";
    }
  };

  that.run = (that, smooth, carList) => {
    // carList.forEach((car) => {
    //   if (that.findCollison(that, car)) {
    //     // console.log("collision");
    //   }
    // });

    that.y += smooth;

    if (MainObj.bullet) {
      if (that.findCollison(that, MainObj.bullet)) {
        // console.log("collision");
        that.destroy(that);
        that.destroyBullet();
      }
    }
    if (that.getY(that.y) > that.getY(100) + that.car.clientWidth / 2) {
      that.moveToUp(that, carList, smooth);
    }

    that.car.style.top = that.y + "%";
  };

  that.destroyBullet = () => {
    MainObj.bullet.car.parentElement.removeChild(MainObj.bullet.car);
    MainObj.bullet = null;
    // console.log("bullet destroyed");
  };

  that.destroy = (that) => {
    that.y = 105;
    that.car.style.top = that.y + "%";
  };

  that.init = () => {
    that.putCar();
  };

  that.init();
}
