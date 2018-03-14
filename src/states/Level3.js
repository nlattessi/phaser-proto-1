import BaseState from './BaseState'

export default class extends BaseState {
  init() {
    super.init()
    this.currentLevel = 3
    this.nextLevelString = 'Level1'
    this.useSkeletons = false
    this.useOrcs = false
    this.useBlueDragons = true
    this.objective = 2
  }

  nextLevel() {
    this.gameOver = true

    var msg = "Game finished! Congrats!! =D";
    var endText = this.game.add.text(this.game.width / 2, this.game.height / 2 - 60, msg, {
      font: "72px serif",
      fill: "#fff"
    });
    endText.anchor.setTo(0.5, 0);
    this.showNextLevel = this.game.time.now + Phaser.Timer.SECOND * 2;
  }
}