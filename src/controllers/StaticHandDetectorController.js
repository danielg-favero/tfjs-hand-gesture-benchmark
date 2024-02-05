import HandDetectorController from "./HandDetectorController.js"

export default class StaticHandDetectorController extends HandDetectorController {
  totalResults = []

  constructor({ service, view }) {
    super({ service, view })
  }
  
  async #estimateHandsFromImage(id, img) {
    const results = await this.#results(img)
    const { rightScore, leftScore, hand } = this.parseResults(results)
    this.totalResults.push(results)

    this.view.updateGestureImageCaptionContainer(id, { 
      score: rightScore || leftScore,
      handedness: hand
    })
  }

  #onEstimateButtonClick() {
    this.view.imagesList.forEach((img, i) => {
      this.#estimateHandsFromImage(i, img)
    })
  }
  
  #onAugmentButtonClick() {
    console.log(this.view.imagesList)
  }

  #onDownloadButtonClick() {
    this.view.onDownloadButtonClick(this.totalResults, 'results')
  }
  
  init() {
    this.view.estimateButtonClickFn(() => this.#onEstimateButtonClick())
    this.view.augmentButtonClickFn(() => this.#onAugmentButtonClick())
    this.view.downloadButtonClickFn(() => this.#onDownloadButtonClick())
  }

  async #results(img) {
    const results = await this.results(img)
    return results
  }

  static async initialize(deps) {
    const controller = new StaticHandDetectorController(deps)
    return controller.init()
  }
}