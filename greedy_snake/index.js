class Snake {
  direction = 1

  constructor(body) {
    this.body = body
  }

  eat(point) {
    for (let i = this.body.length; i > 0; i--) {
      if (i) this.body[i] = this.body[i - 1]
      else this.body[i] = point
    }
  }

  move() {
    let x, y
    switch (this.direction) {
      case 0:
        x = 0
        y = -1
        break
      case 1:
        x = 1
        y = 0
        break
      case 2:
        x = 0
        y = 1
        break
      case 3:
        x = -1
        y = 0
        break

      default:
        break
    }
    this.body.forEach(function (point) {
      point.x += x
      point.y += y
    })
    console.log(this.body[0])
    game.render()
  }
}

class Game {
  width = 800
  height = 800
  level = 1
  size = 40

  constructor() {
    this.snake = new Snake([{ x: 0, y: 0 }])
    this.container = document.querySelector('#container')
    let gap = this.size - 1
    this.container.style.cssText = `width: ${this.width - gap}px; height: ${this.height - gap}px;)`
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.style.width = ~~(this.width / (this.size + 1)) + 'px'
        cell.style.height = ~~(this.height / (this.size + 1)) + 'px'
        cell.setAttribute('data-y', i)
        cell.setAttribute('data-x', j)
        fragment.append(cell)
      }
    }
    this.container.append(fragment)

    setInterval(() => {
      this.snake.move()
    }, 1000)
  }

  start() {
    this.restart()
  }

  restart() {
    this.snake = new Snake([{ x: 0, y: 0 }])
    this.render()
  }

  check() {
    let fail_cell = this.snake.body.find(({ x, y }) => x < 0 || y < 0 || x > this.size - 1 || y > this.size - 1)
    if (fail_cell) {
      alert('You lose!')
      this.restart()
    }
  }

  render() {
    for (const point of this.snake.body) {
      for (const cell of this.container.children) {
        let { x, y } = cell.dataset
        if (x == point.x && y == point.y) cell.classList.add('snake')
        else cell.classList.remove('snake')
      }
    }
    this.check()
  }
}

let game = new Game()

game.start()
