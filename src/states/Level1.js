import BaseState from './BaseState'

export default class extends BaseState {
  init() {
    super.init()
    this.currentLevel = 1
    this.nextLevelString = 'Level2'
    this.useSkeletons = true
  }
}
