define('@weex-component/ui-button', function (require, exports, module) {

;
  module.exports = {
    data: function () {return {
      type: 'default',
      size: 'large',
      value: '',
      click: null,
      disabled: false
    }},
    methods: {
      clicked: function(ev) {
        if (this.disabled) return;
        this.click(ev);
      }
    }
  }


;module.exports.style = {
  "btn": {
    "marginBottom": 0,
    "alignItems": "center",
    "justifyContent": "center",
    "borderWidth": 1,
    "borderStyle": "solid",
    "borderColor": "#333333"
  },
  "btn-default": {
    "color": "rgb(51,51,51)"
  },
  "btn-primary": {
    "backgroundColor": "rgb(40,96,144)",
    "borderColor": "rgb(40,96,144)"
  },
  "btn-success": {
    "backgroundColor": "rgb(92,184,92)",
    "borderColor": "rgb(76,174,76)"
  },
  "btn-info": {
    "backgroundColor": "rgb(91,192,222)",
    "borderColor": "rgb(70,184,218)"
  },
  "btn-warning": {
    "backgroundColor": "rgb(240,173,78)",
    "borderColor": "rgb(238,162,54)"
  },
  "btn-danger": {
    "backgroundColor": "rgb(217,83,79)",
    "borderColor": "rgb(212,63,58)"
  },
  "btn-link": {
    "borderColor": "rgba(0,0,0,0)",
    "borderRadius": 0
  },
  "btn-txt-default": {
    "color": "rgb(51,51,51)"
  },
  "btn-txt-primary": {
    "color": "rgb(255,255,255)"
  },
  "btn-txt-success": {
    "color": "rgb(255,255,255)"
  },
  "btn-txt-info": {
    "color": "rgb(255,255,255)"
  },
  "btn-txt-warning": {
    "color": "rgb(255,255,255)"
  },
  "btn-txt-danger": {
    "color": "rgb(255,255,255)"
  },
  "btn-txt-link": {
    "color": "rgb(51,122,183)"
  },
  "btn-sz-large": {
    "width": 300,
    "height": 100,
    "paddingTop": 25,
    "paddingBottom": 25,
    "paddingLeft": 40,
    "paddingRight": 40,
    "borderRadius": 15
  },
  "btn-sz-middle": {
    "width": 240,
    "height": 80,
    "paddingTop": 15,
    "paddingBottom": 15,
    "paddingLeft": 30,
    "paddingRight": 30,
    "borderRadius": 10
  },
  "btn-sz-small": {
    "width": 170,
    "height": 60,
    "paddingTop": 12,
    "paddingBottom": 12,
    "paddingLeft": 25,
    "paddingRight": 25,
    "borderRadius": 7
  },
  "btn-txt-sz-large": {
    "fontSize": 45
  },
  "btn-txt-sz-middle": {
    "fontSize": 35
  },
  "btn-txt-sz-small": {
    "fontSize": 30
  }
}

;module.exports.template = {
  "type": "div",
  "classList": function () {return ['btn', 'btn-' + (this.type), 'btn-sz-' + (this.size)]},
  "events": {
    "click": "clicked"
  },
  "style": {},
  "children": [
    {
      "type": "text",
      "classList": function () {return ['btn-txt', 'btn-txt-' + (this.type), 'btn-txt-sz-' + (this.size)]},
      "attr": {
        "value": function () {return this.value}
      }
    }
  ]
}

;})

// module

define('@weex-component/videoDemo', function (require, exports, module) {

;
  module.exports = {
    data: function () {return {
      playStatus: 'play'
    }},
    methods: {
      pause: function() {
        this.playStatus = 'pause'
      },
      play: function() {
        this.playStatus = 'play'
      },
      onpause: function() {
        this.$call('modal', 'toast', {'message': 'video pause'});
      },
      onstart: function() {
        this.$call('modal', 'toast', {'message': 'video start'});
      },
      onfinish: function() {
        this.$call('modal', 'toast', {'message': 'video finish'});
      },
      onfail: function() {
        this.$call('modal', 'toast', {'message': 'video fail'});
      }
    }
  };


;module.exports.style = {
  "video": {
    "width": 750,
    "height": 460,
    "marginBottom": 80
  }
}

;module.exports.template = {
  "type": "scroller",
  "children": [
    {
      "type": "video",
      "classList": [
        "video"
      ],
      "events": {
        "pause": "onpause",
        "start": "onstart",
        "finish": "onfinish",
        "fail": "onfail"
      },
      "attr": {
        "src": "http://g.tbcdn.cn/ali-wireless-h5/res/0.0.6/toy.mp4",
        "autoPlay": "true",
        "playStatus": function () {return this.playStatus}
      }
    },
    {
      "type": "div",
      "style": {
        "flexDirection": "row",
        "justifyContent": "center"
      },
      "children": [
        {
          "type": "ui-button",
          "attr": {
            "value": "Pause",
            "click": function () {return this.pause}
          }
        },
        {
          "type": "ui-button",
          "attr": {
            "value": "Play",
            "click": function () {return this.play},
            "type": "primary"
          },
          "style": {
            "marginLeft": 20
          }
        }
      ]
    }
  ]
}

;})

// require module
bootstrap('@weex-component/videoDemo', {"transformerVersion":"0.1.8"})