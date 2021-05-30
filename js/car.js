function Car(x, y, carDesign, MainObj) {
  that = this;

  that.carDesign = carDesign;

  // console.log(carDesign);

  that.left = 15;
  that.right = 85;

  that.x = x;
  that.y = y;

  that.putCar = () => {
    var car = document.createElement("span");
    car.classList.add("car", "enemy-car", that.carDesign);

    car.style.left = getX(that.x, true) + "%";
    car.style.top = that.y + "%";

    that.car = car;

    var road = document.getElementById("road");

    road.appendChild(car);
  };

  that.run = (that, smooth, carList) => {
    that.y += smooth;

    if (MainObj.bullet) {
      if (findCollison(that, MainObj.bullet)) {
        // console.log("collision");
        destroy(that);
        that.destroyBullet();
      }
    }
    if (getY(that.y) > getY(100) + that.car.clientWidth / 2) {
      moveToUp(that, carList, smooth);
    }

    that.car.style.top = that.y + "%";
  };

  that.destroyBullet = () => {
    MainObj.bullet.car.parentElement.removeChild(MainObj.bullet.car);
    MainObj.bullet = null;
    // console.log("bullet destroyed");
  };

  that.init = () => {
    that.putCar();
  };

  that.init();
}
