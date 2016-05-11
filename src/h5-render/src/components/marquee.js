'use strict'

var config = require('../config')
var Component = require('./component')
var ComponentManager = require('../componentManager')
var LazyLoad = require('../lazyLoad')

function Marquee (data) {
  this.interval = Number(data.attr.interval) || 5 * 1000
  this.transitionDuration = Number(data.attr.transitionDuration) || 500
  this.delay = Number(data.attr.delay) || 0
  Component.call(this, data)
}

Marquee.prototype = Object.create(Component.prototype)

Marquee.prototype.create = function () {
  var node = document.createElement('div')
  node.classList.add('weex-container')
  node.style.overflow = 'hidden'
  // fix page shaking during slider's playing
  node.style.webkitTransform = 'translate3D(0,0,0)'
  node.addEventListener('webkitTransitionEnd', this.end.bind(this), false)
  return node
}

Marquee.prototype.createChildren = function () {
  // first run:
  // - create each child
  // - append to parentNode
  // - find current and next
  // - set current and next shown and others hidden
  var children = this.data.children
  var parentRef = this.data.ref
  var instanceId = this.data.instanceId
  var items = []
  var componentManager = this.getComponentManager()

  var fragment, isFlex, child, node, i

  if (children && children.length) {
    fragment = document.createDocumentFragment()
    isFlex = false
    for (i = 0; i < children.length; i++) {
      children[i].scale = this.data.scale
      children[i].instanceId = instanceId
      child = componentManager.createElement(children[i])
      child.parentRef = parentRef
      this.initChild(child)
      // append and push
      items.push(child)
      fragment.appendChild(child.node)
      if (!isFlex && child.data.style.hasOwnProperty('flex')) {
        isFlex = true
      }
    }
    this.node.appendChild(fragment)
  }

  // set items
  this.items = items

  // reset the clock for first transition
  this.reset()
}

Marquee.prototype.initChild = function (child) {
  var node = child.node
  node.style.position = 'absolute'
  node.style.top = '0'
  node.style.left = '0'
}

Marquee.prototype.appendChild = function (data) {
  // dom + items
  var componentManager = ComponentManager.getInstance(this.data.instanceId)
  var child = componentManager.createElement(data)
  this.initChild(child)
  this.node.appendChild(child.node)
  this.items.push(child)
  this.reset()
  return child // @todo redesign Component#appendChild(component)
}

Marquee.prototype.insertBefore = function (child, before) {
  // dom + items
  var index = this.items.indexOf(before)
  this.items.splice(index, 0, child)
  this.initChild(child)
  this.node.insertBefore(child.node, before.node)
  this.reset()
}

Marquee.prototype.removeChild = function (child) {
  // dom + items
  var index = this.items.indexOf(child)
  this.items.splice(index, 1)
  this.node.removeChild(child.node)
  this.reset()
}

/**
 * status: {
 *   current: {translateY: 0, shown: true},
 *   next: {translateY: height, shown: true},
 *   others[]: {shown: false}
 *   index: index
 * }
 */
Marquee.prototype.reset = function () {
  var interval = this.interval - 0
  var delay = this.delay - 0
  var items = this.items
  var self = this

  var loop = function () {
    self.next()
    self.timerId = setTimeout(loop, self.interval)
  }

  // reset display and transform
  items.forEach(function (item, index) {
    var node = item.node
    // set non-current(0)|next(1) item hidden
    node.style.display = index > 1 ? 'none' : ''
    // set next(1) item translateY
    // TODO: it supposed to use item.data.style
    // but somehow the style object is empty.
    // This problem relies on jsframework's bugfix.

    // node.style.transform = index === 1
    //     ? 'translate3D(0,' + config.scale * item.data.style.height + 'px,0)'
    //     : ''
    // node.style.webkitTransform = index === 1
    //     ? 'translate3D(0,' + config.scale * item.data.style.height + 'px,0)'
    //     : ''
    node.style.transform = index === 1
        ? 'translate3D(0,' + self.data.scale * self.data.style.height + 'px,0)'
        : ''
    node.style.webkitTransform = index === 1
        ? 'translate3D(0,' + self.data.scale * self.data.style.height + 'px,0)'
        : ''
  })

  setTimeout(function () {
    // reset current, next, index
    self.currentItem = items[0]
    self.nextItem = items[1]
    self.currentIndex = 0

    items.forEach(function (item, index) {
      var node = item.node
      // set transition
      node.style.transition = 'transform '
          + self.transitionDuration
          + 'ms ease'
      node.style.webkitTransition = '-webkit-transform '
          + self.transitionDuration
          + 'ms ease'
    })

    clearTimeout(self.timerId)

    if (items.length > 1) {
      self.timerId = setTimeout(loop, delay + interval)
    }
  }, 13)

}

/**
 * next:
 * - current: {translateY: -height}
 * - next: {translateY: 0}
 */
Marquee.prototype.next = function () {
  // - update state
  //   - set current and next transition
  //   - hide current when transition end
  //   - set next to current
  //   - find new next
  var next = this.nextItem.node
  var current = this.currentItem.node
  this.transitionIndex = this.currentIndex

  // Use setTimeout to fix the problem that when the
  // page recover from backstage, the slider will
  // not work any longer.
  setTimeout(function () {
    next.style.transform = 'translate3D(0,0,0)'
    next.style.webkitTransform = 'translate3D(0,0,0)'
    current.style.transform = 'translate3D(0,-'
        + this.data.scale * this.data.style.height
        + 'px,0)'
    current.style.webkitTransform = 'translate3D(0,-'
        + this.data.scale * this.data.style.height
        + 'px,0)'
    this.fireEvent('change')
  }.bind(this), 300)
}

Marquee.prototype.fireEvent = function (type) {
  var length = this.items.length
  var nextIndex = (this.currentIndex + 1) % length
  var evt = document.createEvent('HTMLEvents')
  evt.initEvent(type, false, false)
  evt.data = {
    prevIndex: this.currentIndex,
    index: nextIndex
  }
  this.node.dispatchEvent(evt)
}

/**
 * end:
 * - old current: {shown: false}
 * - old current: {translateY: 0}
 * - index++ % length
 * - new current = old next
 * - new next = items[index+1 % length]
 * - new next: {translateY: height}
 * - new next: {shown: true}
 */
Marquee.prototype.end = function (e) {
  var target = e.target
  var items = this.items
  var length = items.length
  var current, next
  var currentIndex, nextIndex

  currentIndex = this.transitionIndex

  if (isNaN(currentIndex)) {
    return
  }
  delete this.transitionIndex

  current = this.currentItem.node
  current.style.display = 'none'
  current.style.webkitTransform = ''

  currentIndex = (currentIndex + 1) % length
  nextIndex = (currentIndex + 1) % length

  this.currentIndex = currentIndex
  this.currentItem = this.nextItem
  this.nextItem = items[nextIndex]

  setTimeout(function () {
    next = this.nextItem.node
    // TODO: it supposed to use this.nextItem.data.style
    // but somehow the style object is empty.
    // This problem relies on jsframework's bugfix.

    next.style.webkitTransform = 'translate3D(0,'
        + this.data.scale * this.data.style.height
        + 'px,0)'
    next.style.display = ''
    LazyLoad.loadIfNeeded(next)
  }.bind(this))
}

Marquee.prototype.attr = {
  interval: function (value) {
    this.interval = value
  },
  transitionDuration: function (value) {
    this.transitionDuration = value
  },
  delay: function (value) {
    this.delay = value
  }
}

Marquee.prototype.clearAttr = function () {
  this.interval = 5 * 1000
  this.transitionDuration = 500
  this.delay = 0
}

module.exports = Marquee
