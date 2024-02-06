import HandDetectorController from "./HandDetectorController.js"

export default class EstimateStaticHandDetectorController extends HandDetectorController {
  #totalResults
  #processedResults

  constructor({ service, view }) {
    super({ service, view })

    this.#totalResults = {}
    this.#processedResults = 0
  }

  insertIntoTotalResults(gesture, value) {
    this.#totalResults[gesture].push(value)
}
  
  async #estimateHandsFromImage(id, img) {
    const results = await this.#results(img)
    
    const { rightScore, leftScore, hand } = this.parseResults(results)

    this.view.updateGestureImageCaptionContainer(id, { 
      score: rightScore || leftScore,
      handedness: hand
    })

    return results
  }

  #onEstimateButtonClick() {
    for (const [gesture, images] of Object.entries(this.view.gesturesImagesList)) {
      this.#totalResults[gesture] = []
      Promise.all(images.map(async (image, i) => {
        let results = await this.#estimateHandsFromImage(i + this.view.gesturesImagesList[gesture].length * this.#processedResults, image)
        this.insertIntoTotalResults(gesture, results)
      }))
      this.#processedResults++
    }

    this.#processedResults = 0
  }

  #onDownloadButtonClick() {
    for (const [gesture, images] of Object.entries(this.#totalResults)) {
      this.view.onDownloadButtonClick(images, gesture)
    }
  }
  
  init() {
    this.view.estimateButtonClickFn(() => this.#onEstimateButtonClick())
    this.view.downloadButtonClickFn(() => this.#onDownloadButtonClick())
  }

  async #results(img) {
    const results = await this.results(img)
    return results
  }

  static async initialize(deps) {
    const controller = new EstimateStaticHandDetectorController(deps)
    return controller.init()
  }
}