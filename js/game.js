function Game() {
  const roadAnimator = document.getElementById("road-animator");

  var obj = this;

  obj.startAnimating = startAnimating;
  obj.putCar = putCar;
  obj.update = update;
  obj.animate = animate;
  obj.startAnimating = startAnimating;
  obj.init = init;
  obj.mainCar;
  obj.CarList;
  obj.bullet;
  obj.bulletCount;

  function handleOrientation(e) {
    var x = Math.floor(e.gamma); // In degree in the range [-180,180)

    // document.getElementById("ori").innerText = x;

    if (obj.mainCar.car.classList.contains("crash")) return;

    if (x < -10) {
      moveXaxis(obj.mainCar, 1);
    } else if (x > 10) {
      moveXaxis(obj.mainCar, 3);
    } else if (x > -7 && x < 7) {
      moveXaxis(obj.mainCar, 2);
    }
  }

  obj.CARS = Array(40)
    .fill(null)
    .map((_, index) => "car-" + (index + 2));

  const getCarClass = (cars) => {
    return cars[Math.floor(Math.random() * cars.length)];
  };

  function init() {
    roadAnimator.classList.remove("animate");
    roadAnimator.classList.add("animate");
    document.getElementById("background").classList.remove("animate");
    document.getElementById("background").classList.add("animate");

    document.getElementById("score").innerText = "0";

    this.mainCar = new Car(2, 75, "car-4", this);

    document.getElementById("background").addEventListener("click", (e) => {
      if (this.bullet || this.bulletCount <= 0) {
        return;
      }
      this.bulletCount -= 1;

      this.bullet = new Car(this.mainCar.x, 65, "bullet", this);
    });

    this.bulletCount = 3;
    this.CarList = [];
    if (document.getElementById("button-mode").checked) {
      window.removeEventListener("deviceorientation", handleOrientation);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }
  }

  document.getElementById("left-btn").addEventListener(
    "click",
    (e) => {
      if (this.mainCar.car.classList.contains("crash")) return;

      moveYaxis(obj.mainCar, -1);
    },
    obj
  );
  document.getElementById("right-btn").addEventListener(
    "click",
    (e) => {
      if (this.mainCar.car.classList.contains("crash")) return;
      moveYaxis(obj.mainCar, 1);
    },
    obj
  );

  document.addEventListener("keypress", (e) => {
    if (obj.mainCar.car.classList.contains("crash")) return;

    if (e.key == "a") {
      moveYaxis(obj.mainCar, -1);
    } else if (e.key == "d") {
      moveYaxis(obj.mainCar, 1);
    } else if (e.key == "u") {
      if (this.bullet || this.bulletCount <= 0) {
        return;
      }
      this.bulletCount -= 1;
      this.bullet = new Car(this.mainCar.x, 65, "bullet", this);
    }
  });

  var stop = false;
  var frameCount = 0;
  var fps, fpsInterval, startTime, now, then, elapsed;

  // initialize the timer variables and start the animation

  function putCar() {
    if (obj.CarList.length <= 0) {
      obj.CarList.push(new Car(1, 0, getCarClass(obj.CARS), this));
    }
    if (obj.CarList.length > 4) {
      // console.log("full");
      return;
    }
    for (var i = 0; i < obj.CarList.length; i++) {
      if (obj.CarList[i].y > 100) {
        return;
      }
    }

    for (var i = 0; i < obj.CarList.length; i++) {
      let car = obj.CarList[i];

      if (!checkYCollison(obj.CarList, -5, 0.25)) {
        obj.CarList.push(
          new Car(
            Math.floor(Math.random() * 3),
            -5,
            getCarClass(obj.CARS),
            this
          )
        );

        return;
      }
    }
  }

  const stopGame = () => {
    this.stop = true;
  };

  obj.roadSpeed = 1;

  function update(progress) {
    // Update the state of the world for the elapsed time since last render

    document.getElementById("high-score").innerHTML =
      localStorage.getItem("high-score-car-lane-game") || 0;

    document.getElementById("bullet-count").innerText = obj.bulletCount;

    if (progress % 15 == 0) {
      obj.roadSpeed = (1 - (progress / 15) * 0.15).toFixed(2);
      if (obj.roadSpeed > 0.3)
        roadAnimator.style = "animation-duration: " + obj.roadSpeed + "s;";
    }

    document.getElementById("time").innerText = progress;
    // console.log(progress, 0.25 * (1 + (1 * progress) / 100));
    obj.putCar();

    if (obj.bullet) {
      if (obj.bullet.y < -5) {
        obj.bullet.destroyBullet();
      } else {
        obj.bullet.run(
          obj.bullet,
          -0.5 * (1 + (1 * progress) / 10),
          obj.CarList
        );
      }
    }

    obj.CarList.forEach((car, index) => {
      var sp = 0.25 * (1 + progress / 10);
      if (sp > 1.5) {
        sp = 1.5;
      }
      car.run(car, sp, obj.CarList);
      if (findCollison(car, obj.mainCar)) {
        // console.log(car, obj.mainCar);
        stop = true;

        roadAnimator.classList.remove("animate");
        document.getElementById("background").classList.remove("animate");

        document.getElementById("menu-splash").classList.remove("hide");
        obj.mainCar.car.classList.add("crash");

        // alert(game)
      }
    });
  }

  function startAnimating(fps) {
    var road = (document.getElementById("road").innerHTML = "");
    document.getElementById("menu-splash").classList.add("hide");

    obj.init();
    stop = false;
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    // console.log(that);
    obj.animate();
  }
  function animate() {
    // request another frame

    if (stop) {
      return;
    }
    // console.log("running");

    requestAnimationFrame(animate);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)

      then = now - (elapsed % fpsInterval);

      timeInterval = Math.floor(
        (new Date(then).getTime() - new Date(startTime).getTime()) / 1000
      );
      obj.update(timeInterval);
      // Put your drawing code here
    }
  }

  // obj.startAnimating(50);
}
