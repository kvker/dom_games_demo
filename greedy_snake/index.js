class Snake {
  // 方向键标记
  direction = 'ArrowRight'

  // 蛇身体
  body
  // 蛇尾巴用来吃到后的位置
  tail

  constructor(body) {
    this.body = body
    this.tail = body.at(-1)
  }

  eat() {
    // 吃到食物后整体移动一位同时补充一个到原来的尾巴位置
    this.body.push(this.tail)
  }

  move() {
    let x, y
    // 按键方向记录下一帧根据这个移动，只有 4 种可能
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
    }
    // 移动前记录下尾巴位置
    let tail = this.body.at(-1)
    this.tail = { x: tail.x, y: tail.y }

    // 蛇身前进处理，反向数组移动
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
  // 场景尺寸
  width = 800
  height = 800
  // TODO: 游戏等级
  level = 1
  // 场景方块数目
  size = 40

  // 食物位置，仅仅记录 x, y 值
  food

  constructor() {
    // 初始化在左上角
    this.snake = new Snake([{ x: 0, y: 0 }])

    this.container = document.querySelector('#container')
    // 方块的间隔
    let gap = this.size - 1
    this.container.style.cssText = `width: ${this.width - gap}px; height: ${this.height - gap}px;)`

    // 绘制棋盘
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

    // 计时器负责每一帧的渲染
    setInterval(() => {
      this.snake.move()
      // 先检查是否吃到食物
      if (this.checkEat()) {
        this.snake.eat()
        this.generateFood()
      }
      // 再检查是否失败
      if (this.checkFail()) {
        alert('You lose!')
        this.restart()
      }
      this.render()
    }, 1000)

    // 初始化监听键盘
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
    // 重新开始游戏等同于重建蛇，重新渲染，并生成食物
    this.snake = new Snake([{ x: 0, y: 0 }])
    this.render()
    this.generateFood()
  }

  /**
   * 撞到墙外或头开向自己身体（含回头）算是失败
   * @returns boolean
   */
  checkFail() {
    let { x, y } = this.snake.body[0]
    let body = this.snake.body
    return this.snake.body.find(({ x, y }) => x < 0 || y < 0 || x > this.size - 1 || y > this.size - 1) || body.find((item, index) => index && item.x === x && item.y === y)
  }

  /**
   * 蛇头跑到事物上判定为吃到食物
   * @returns boolean
   */
  checkEat() {
    let snake_head = this.snake.body[0]
    return snake_head.x === this.food.x && snake_head.y === this.food.y
  }

  generateFood() {
    let x = ~~(Math.random() * this.size)
    let y = ~~(Math.random() * this.size)
    // console.log(x, y)
    // 判断是不是生成的食物刚好在蛇身上
    let is_exist = this.snake.body.find((point) => point.x === x && point.y === y)
    if (is_exist) {
      // 如果生成的食物在蛇身上，重新生成
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
