'use strict'

function loadByXHR(config, callback) {
  if (!config.source) {
    callback(new Error('xhr loader: missing config.source.'))
  }
  var xhr = new XMLHttpRequest()
  xhr.open('GET', config.source)
  xhr.onload = function () {
    callback(null, this.responseText)
  }
  xhr.onerror = function (error) {
    callback(error)
  }
  xhr.send()
}

function loadByJsonp(config, callback) {
  if (!config.source) {
    callback(new Error('jsonp loader: missing config.source.'))
  }
  var callbackName = config.jsonpCallback || 'weexJsonpCallback'
  window[callbackName] = function (code) {
    if (code) {
      callback(null, code)
    } else {
      callback(new Error('load by jsonp error'))
    }
  }
  var script = document.createElement('script')
  script.src = decodeURIComponent(config.source)
  script.type = 'text/javascript'
  document.body.appendChild(script)
}

function loadBySourceCode(config, callback) {
  // src is the jsbundle.
  // no need to fetch from anywhere.
  if (config.source) {
    callback(null, config.source)
  } else {
    callback(new Error('source code laoder: missing config.source.'))
  }
}

var callbackMap = {
  xhr: loadByXHR,
  jsonp: loadByJsonp,
  source: loadBySourceCode
}

function load(options, callback) {
  var loadFn = callbackMap[options.loader]
  loadFn(options, callback)
}

function registerLoader(name, loaderFunc) {
  if (typeof loaderFunc === 'function') {
    callbackMap[name] = loaderFunc
  }
}

module.exports = {
  load: load,
  registerLoader: registerLoader
}
