import BaseState from './BaseState'

export default class extends BaseState {
  init() {
    super.init()
    this.currentLevel = 1
    this.nextLevelString = 'Level2'
    this.useSkeletons = true
    this.objective = 20
  }

  scoreIncreased() {
    if (this.score === 6) {
      this.skeletonRate = 1200
    } else if (this.score === 12) {
      this.skeletonRate = 1000
    } else if (this.score === 17) {
      this.skeletonRate = 900
    }
  }
}
