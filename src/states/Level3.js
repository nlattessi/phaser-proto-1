import BaseState from './BaseState'

export default class extends BaseState {
  init() {
    super.init()
    this.currentLevel = 3
    this.nextLevelString = ''
    this.useSkeletons = false
    this.useOrcs = false
    this.useBlueDragons = true
    this.objective = 10
  }
}