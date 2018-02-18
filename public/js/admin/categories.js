class CategoriesList {
  constructor($el, categories) {
    this.$el = document.querySelector('.js-categoriesList')
    this.categories = Helpers.getMeta('categories-last')
    this.isMoving = false

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
    this.moveHandler = this.move.bind(this)

    this.$children
      .forEach($child => {
        $child
          .querySelector('.js-categoryMovable')
          .addEventListener('mousedown', this.startMove.bind(this), false)
        $child
          .querySelector('.js-categoryMovable')
          .addEventListener('mouseup', this.endMove.bind(this), false)
        $child.querySelector('.js-categoryDeleteButton')
          .addEventListener('mouseup', () => this.deleteCategory($child.dataset.id), false)
      })

    this.$input.addEventListener('keypress', this.addCategory.bind(this))
  }

  startMove(event) {
    if (this.isMoving) return

    this.isMoving = true
    this.$currentChild = event.target.parentNode
    this.parentRelatedOriginalPosition = {
      x: this.$currentChild.offsetLeft,
      y: this.$currentChild.offsetTop,
    }
    this.firstCursorPosition = {
      x: event.clientX,
      y: event.clientY,
    }

    const $emptyChild = document.createElement('div')
    $emptyChild.classList.add('categoriesList__child--empty')
    $emptyChild.style.marginLeft = `${Number(this.$currentChild.dataset.depth) * 1}rem`
    this.$emptyChild = this.$el.insertBefore($emptyChild, this.$currentChild)

    this.$currentChild.style.left = this.parentRelatedOriginalPosition.x
    this.$currentChild.style.top = this.parentRelatedOriginalPosition.y
    this.$currentChild.style.width = `${this.$currentChild.clientWidth}px`
    this.$currentChild.classList.add('categoriesList__child--free')

    this.$el.classList.remove('categoriesList--ready')

    document.addEventListener('mousemove', this.moveHandler)

    console.log('startMove')
  }

  move(event) {
    const currentChildNewTop = this.parentRelatedOriginalPosition.y + event.clientY - this.firstCursorPosition.y
    const currentChildDistanceFromFirstChild = currentChildNewTop - this.parentRelatedRefencePosition.y

    if (currentChildDistanceFromFirstChild <= 0) {
      this.$currentChild.style.top = this.parentRelatedRefencePosition.y
      return
    }
    this.$currentChild.style.top = currentChildNewTop

    const currentBelowChildIndex = Math.floor((currentChildNewTop - this.parentRelatedRefencePosition.y) / this.childHeight)
    if (currentBelowChildIndex === this.lastBelowChildIndex) return
    this.lastBelowChildIndex = currentBelowChildIndex

    const $currentBelowChild = this.$children[currentBelowChildIndex]

    console.log('move')
    console.log(this.$children[currentBelowChildIndex].dataset.id)
  }

  endMove(event) {
    if (!this.isMoving) return

    document.removeEventListener('mousemove', this.moveHandler)

    this.isMoving = false

    this.$emptyChild.remove()
    this.$currentChild.classList.remove('categoriesList__child--free')
    this.$currentChild.style.width = 'auto'

    console.log('endMove')
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

  getCategoriesHtml(categories) {
    let html = ''

    categories.forEach(category => {
      html += `
        <div
          class="js-categoryBox categoriesList__child"
          style="margin-left: ${category.depth * 1}rem;"
          data-id=${category.id}
          data-parent=${category.parent}
          data-depth=${category.depth}
        >
          <span class="js-categoryMovable categoriesListChild__text">${category.name}</span>
          <svg class="js-categoryDeleteButton categoriesListChild__deleteButton">
            <use xlink:href="/sprites/open-iconic.svg#trash">
          </svg>
        </div>
      `

      if (category.children.length !== 0) html += this.getCategoriesHtml(category.children)
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
