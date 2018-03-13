import BaseState from './BaseState'

export default class extends BaseState {
  init() {
    super.init()
    this.currentLevel = 2
    this.nextLevelString = 'Level3'
    this.useSkeletons = true
    this.useOrcs = true
    this.objective = 15
  }
}