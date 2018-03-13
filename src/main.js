import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import PreloaderState from './states/Preloader'
import TutorialState from './states/Tutorial'
import Level1State from './states/Level1'
import Level2State from './states/Level2'
import Level3State from './states/Level3'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    // super(width, height, Phaser.CANVAS, 'content', null)
    super(config.tileSize * 20, config.tileSize * 15, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Preloader', PreloaderState, false)
    this.state.add('Tutorial', TutorialState, false)
    this.state.add('Level1', Level1State, false)
    this.state.add('Level2', Level2State, false)
    this.state.add('Level3', Level3State, false)

    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    if (!window.cordova) {
      this.state.start('Boot')
    }
  }
}

window.game = new Game()

if (window.cordova) {
  var app = {
    initialize: function () {
      document.addEventListener(
        'deviceready',
        this.onDeviceReady.bind(this),
        false
      )
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
      this.receivedEvent('deviceready')

      // When the device is ready, start Phaser Boot state.
      window.game.state.start('Boot')
    },

    receivedEvent: function (id) {
      console.log('Received Event: ' + id)
    }
  }

  app.initialize()
}
