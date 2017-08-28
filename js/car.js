// eslint-disable-next-line no-unused-vars 
class Car {
  // eslint-disable-next-line max-statements
  constructor (options) {
    // list of all cars
    this.cars = options.cars
    // each car must receive a unique id
    this.id = this.cars.length
    // register this car
    this.cars.push(this)
    // dom element representing this car
    this.element = options.element
    // a car is following another car
    this.precedentCarId = this.id + 1
    // px per meter scale
    this.pxPerMeter = options.pxPerMeter || 2
    // calculations per second
    this.fps = 30
    // car's dimensions (in meters)
    this.width = 2.0
    this.length = 4.5

    // state of the car x, y in meters, speed in km
    this.state = {
      speed: 0,
      targetSpeed: 0,
      x: this.id * this.length + this.id * 2,
      y: options.y || 52,
      distance: 0,
      previousDistance: 0
    }

    // add the car in the dom
    this.buildCar()
    this.addEvents()

    // start the main calculations
    this.drive()

    // init the speed module
    this.adaptSpeed()

    if (this.id !== 7) {
      this.autoDrive()
    }
  }

  buildCar () {
    const car = document.createElement('div')
    car.setAttribute('class', 'car')
    car.setAttribute('id', `car${this.id}`)
    car.style.left = `${this.state.x}px`
    car.style.top = `${this.state.y}px`
    car.style.width = `${parseInt(this.length * this.pxPerMeter)}px`
    car.style.height = `${parseInt(this.width * this.pxPerMeter)}px`
    car.appendChild(document.createTextNode(`${this.id}`))
    this.element = car
    document.getElementById('simulator').appendChild(car)
  }

  addEvents () {
    this.element.addEventListener('click', () => {
      console.log('click')
      this.init()
      if (!this.state.started) {
        this.state.started = true
      }
    })
  }

  init () {
    this.setTargetSpeed(30)
    setTimeout(() => this.setTargetSpeed(0), 7000)
  }

  registerCar (id) {
    console.log('id', id)
    this.cars[`car${id}`] = this
  }

  setPrecedentCarId (id) {
    this.precedentCarId = id
  }

  drive () {
    // calculations
    this.getDistanceFromPrecedentCar()

    // update the position
    this.state.x +=
      this.getSpeedInMeterPerSec(this.state.speed) / this.fps * this.pxPerMeter

    // animate cars on screen
    this.animate()

    // refresh and refresh and refresh...
    setTimeout(() => this.drive(), 1000 / this.fps)
  }

  setTargetSpeed (speed) {
    this.state.targetSpeed = speed
  }

  adaptSpeed () {
    const { targetSpeed, speed } = this.state

    if (targetSpeed === speed) {
      //
    } else if (targetSpeed > speed) {
      this.state.speed += 0.5
    } else if (targetSpeed < speed) {
      this.state.speed += -0.5
    }
    setTimeout(() => this.adaptSpeed(), 100)
  }

  animate () {
    // console.log('animate', this.state.x)
    const { speed, targetSpeed } = this.state
    let color = speed > targetSpeed ? '#db9d9d' : '#4cff00'
    color = speed === targetSpeed ? '#fff' : color

    this.element.style.backgroundColor = color
    this.element.style.left = `${this.state.x * this.pxPerMeter}px`
    this.element.innerHTML = `${parseInt(this.state.speed)}
    <br>tS:${parseInt(this.state.targetSpeed)}
    <br>d:${this.state.distance}`
    //   car${this.id}<br>
    //   cS:${parseInt(this.state.speed)}<br>
    //   tS:${parseInt(this.state.targetSpeed)}<br>
    //   d: ${this.state.distance}`
  }

  autoDrive () {
    const { speed, distance } = this.state

    if (speed > 0 && distance > 0) {
      //  console.log(speed / distance)
      if (speed / distance > 0.622) {
        this.setTargetSpeed(0)
        return true
      }
    } else if (distance > 10) {
      this.setTargetSpeed(30)
    }
    // } else if (distance <= 20) {
    //   this.setTargetSpeed(0)
    // }
    setTimeout(() => this.autoDrive(), 100)
  }

  getDistanceFromPrecedentCar () {
    if (this.precedentCarId !== undefined) {
      const precedentCar = this.cars[this.precedentCarId]
      if (precedentCar) {
        this.state.previousDistance = this.state.distance
        this.state.distance = parseInt(precedentCar.state.x - this.state.x)
      }
    }
  }

  getSpeedInMeterPerSec (speedInKm) {
    return speedInKm * 1000 / 3600
  }
}
