class CategoriesList {
  constructor($el, categories) {
    this.$el = document.querySelector('.js-categoriesList')
    this.categories = Helpers.getMeta('categories-last')
    this.isMoving = false

    this.moveHandler = this.move.bind(this)
    this.endMoveHandler = this.endMove.bind(this)

    this.render()
  }

  reset() {
    this.$children = this.$el.querySelectorAll('.js-categoryBox')
    this.childHeight = this.$children[0].clientHeight
    this.parentRelatedRefencePosition = {
      x: this.$children[0].offsetLeft,
      y: this.$children[0].offsetTop,
    }

    this.$input = this.$el.querySelector('.js-categoryInput')
  }

  bindEvents() {
    this.$children
      .forEach($child => {
        $child
          .querySelector('.js-categoryMovable')
          .addEventListener('mousedown', this.startMove.bind(this), false)
        $child
          .querySelector('.js-categoryMovable')
          .addEventListener('mouseup', this.endMove.bind(this), false)
        $child.querySelector('.js-categoryDeleteButton')
          .addEventListener('click', () => this.deleteCategory($child.dataset.id), false)
      })

    this.$input.addEventListener('keypress', this.addCategory.bind(this))
  }

  startMove(event) {
    if (this.isMoving) return

    this.isMoving = true
    this.$selectedChild = event.target.parentNode
    this.parentRelatedOriginalPosition = {
      x: this.$selectedChild.offsetLeft,
      y: this.$selectedChild.offsetTop,
    }
    this.firstCursorPosition = {
      x: event.clientX,
      y: event.clientY,
    }

    this.$target = document.createElement('div')
    this.$target.classList.add('categoriesList__child--empty')
    this.$target.style.marginLeft = `${Number(this.$selectedChild.dataset.depth) * 1}rem`
    this.$el.insertBefore(this.$target, this.$selectedChild)

    this.$selectedChild.style.left = this.parentRelatedOriginalPosition.x
    this.$selectedChild.style.top = this.parentRelatedOriginalPosition.y
    this.$selectedChild.style.width = `${this.$selectedChild.clientWidth}px`
    this.$selectedChild.classList.add('categoriesList__child--free')

    this.$el.classList.remove('categoriesList--ready')

    document.addEventListener('mousemove', this.moveHandler)
    document.addEventListener('mouseup', this.endMoveHandler, { once: true })

    console.log('startMove')
  }

  move(event) {
    const currentChildNewTop = this.parentRelatedOriginalPosition.y + event.clientY - this.firstCursorPosition.y
    let currentChildDistanceFromFirstChild = currentChildNewTop - this.parentRelatedRefencePosition.y

    if (currentChildDistanceFromFirstChild <= 0) {
      this.$selectedChild.style.top = this.parentRelatedRefencePosition.y
      currentChildDistanceFromFirstChild = 0
    } else if (currentChildDistanceFromFirstChild >= (this.$children.length - 1) * this.childHeight) {
      this.$selectedChild.style.top = this.parentRelatedRefencePosition.y + (this.$children.length - 1) * this.childHeight
      currentChildDistanceFromFirstChild = (this.$children.length - 1) * this.childHeight
    } else {
      this.$selectedChild.style.top = currentChildNewTop
    }

    const targetIndex = Math.floor(currentChildDistanceFromFirstChild / this.childHeight)
    const targetDepth = targetIndex === 0 ? 0 : Number(event.clientX - this.firstCursorPosition.x > 16)

    if (targetIndex !== this.targetIndex || targetDepth !== this.targetDepth) {
      this.targetDepth = targetDepth
      this.targetIndex = targetIndex
      this.moveTarget()
    }
  }

  moveTarget() {
    const $targetChild = this.$children[this.targetIndex]
    this.$target.remove()

    let targetRealDepth = 0

    if (this.targetIndex !== 0) {
      const $targetPreviousChild = this.$children[this.targetIndex - 1]
      targetRealDepth = (Number($targetPreviousChild.dataset.depth) + this.targetDepth) * 1
    }

    // this.$selectedChild.style.marginLeft = `${targetRealDepth * 1}rem`
    this.$target.style.marginLeft = `${targetRealDepth * 1}rem`

    this.$el.insertBefore(this.$target, $targetChild)
  }

  endMove(event) {
    if (!this.isMoving) return

    document.removeEventListener('mousemove', this.moveHandler)

    this.processTarget()

    this.$target.remove()
    this.$selectedChild.classList.remove('categoriesList__child--free')
    this.$selectedChild.style.width = 'auto'

    this.isMoving = false

    console.log('endMove')
  }

  processTarget() {
    const data = {
      parent: null,
      position: 0,
    }

    if (this.targetIndex !== 0) {
      const $targetPreviousChild = this.$children[this.targetIndex - 1]
      if (this.targetDepth === 0) {
        if ($targetPreviousChild.dataset.parent === undefined) {
          data.parent = null
        } else {
          data.parent = $targetPreviousChild.dataset.parent
        }
        data.position = Number($targetPreviousChild.dataset.position) + 1
      } else {
        data.parent = $targetPreviousChild.dataset.id
        data.position = 0
      }
    }

    this.updateCategory(this.$selectedChild.dataset.id, data)
  }

  async addCategory(event) {
    if (event.keyCode !== 13 || event.target.value.length === 0) return

    try {
      const { data } = await window.axios.post('/api/category', { name: event.target.value })
      this.categories = data
    }
    catch (err) {
      console.error(err.message)
    }

    this.render()
  }

  async updateCategory(id, categoryData) {
    console.log(categoryData)
    try {
      const { data } = await window.axios.put(`/api/category/${id}`, categoryData)
      this.categories = data
    }
    catch (err) {
      console.error(err.message)
    }

    this.render()
  }

  async deleteCategory(id) {
    try {
      const { data } = await window.axios.delete(`/api/category/${id}`)
      this.categories = data
    }
    catch (err) {
      console.error(err.message)
    }

    this.render()
  }

  getCategoriesHtml(categories, index = 0) {
    let html = ''

    categories.forEach(category => {
      html += `
        <div
          class="js-categoryBox categoriesList__child"
          style="margin-left: ${category.depth * 1}rem;"
          data-id="${category.id}"
          ${category.parent !== undefined ? 'data-parent="' + category.parent + '"' : ''}
          data-name="${category.name}"
          data-position="${category.position}"
          data-depth="${category.depth}"
        >
          <span class="js-categoryMovable categoriesListChild__text">${category.name}</span>
          <svg class="js-categoryDeleteButton categoriesListChild__deleteButton">
            <use xlink:href="/sprites/open-iconic.svg#trash">
          </svg>
        </div>
      `

      index++

      if (category.children.length !== 0) html += this.getCategoriesHtml(category.children, index)
    })

    return html
  }

  render() {
    this.$el.innerHTML = `
      ${this.getCategoriesHtml(this.categories)}
      <input class="js-categoryInput categoriesList__input" placeholder="New Category">
    `

    this.reset()
    this.bindEvents()
  }
}

new CategoriesList()
