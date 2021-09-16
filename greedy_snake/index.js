class Snake {
  direction = 'ArrowRight'

  body
  tail

  constructor(body) {
    this.body = body
    this.tail = body.at(-1)
  }

  eat() {
    console.log(this.body)
    this.body.push(this.tail)
    console.log(this.body)
  }

  move() {
    let x, y
    switch (this.direction) {
      case 'ArrowUp':
        x = 0
        y = -1
        break
      case 'ArrowRight':
        x = 1
        y = 0
        break
      case 'ArrowDown':
        x = 0
        y = 1
        break
      case 'ArrowLeft':
        x = -1
        y = 0
        break

      default:
        break
    }
    let tail = this.body.at(-1)
    this.tail = { x: tail.x, y: tail.y }

    let head = this.body[0]
    for (let i = this.body.length - 1; i >= 0; i--) {
      if (i) {
        this.body[i] = this.body[i - 1]
      } else {
        this.body[i] = {
          x: head.x + x,
          y: head.y + y,
        }
      }
    }
  }
}

class Game {
  width = 800
  height = 800
  level = 1
  size = 40

  food

  constructor() {
    this.snake = new Snake([{ x: 0, y: 0 }])
    this.container = document.querySelector('#container')
    let gap = this.size - 1
    this.container.style.cssText = `width: ${this.width - gap}px; height: ${this.height - gap}px;)`
    const fragment = document.createDocumentFragment()
    // 绘制棋盘
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
      if (this.checkEat()) {
        this.snake.eat()
        this.generateFood()
      }
      if (this.checkFail()) {
        alert('You lose!')
        this.restart()
      }
      this.render()
    }, 1000)

    this.listenKeyboard()
  }

  listenKeyboard() {
    document.addEventListener('keydown', (e) => {
      this.snake.direction = e.key
    })
  }

  start() {
    this.restart()
  }

  restart() {
    this.snake = new Snake([{ x: 0, y: 0 }])
    this.render()
    this.generateFood()
  }

  checkFail() {
    let { x, y } = this.snake.body[0]
    let body = this.snake.body
    return this.snake.body.find(({ x, y }) => x < 0 || y < 0 || x > this.size - 1 || y > this.size - 1) || body.find((item, index) => index && item.x === x && item.y === y)
  }

  checkEat() {
    let snake_head = this.snake.body[0]
    return snake_head.x === this.food.x && snake_head.y === this.food.y
  }

  generateFood() {
    let x = ~~(Math.random() * 5)
    let y = ~~(Math.random() * 5)
    // console.log(x, y)
    let is_exist = this.snake.body.find((point) => point.x === x && point.y === y)
    if (is_exist) {
      this.generateFood()
    } else {
      for (const cell of this.container.children) {
        let dataset = cell.dataset
        if (x === +dataset.x && y === +dataset.y) {
          cell.classList.add('food')
          this.food = { x, y }
        } else {
          cell.classList.remove('food')
        }
      }
    }
  }

  render() {
    for (const cell of this.container.children) {
      cell.classList.remove('snake')
      for (const point of this.snake.body) {
        let { x, y } = cell.dataset
        if (+x === point.x && +y === point.y) cell.classList.add('snake')
      }
    }
  }
}

let game = new Game()

game.start()
