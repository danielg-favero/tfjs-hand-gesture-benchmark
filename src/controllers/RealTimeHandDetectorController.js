import HandDetectorController from "./HandDetectorController.js"

export default class RealTimeHandDetectorController extends HandDetectorController {
    #camera

    constructor({ service, view, camera }) {
      super({ service, view })
      this.#camera = camera
    }

    async init() {
        return this.#loop()
    }

    drawHandsToWebCam(results) {
      this.view.drawHandsToWebCam(results)
    }

    async #results(img) {
      const results = await this.results(img)
      this.drawHandsToWebCam(results)
      this.setResults(results)
    }

    async #loop() {
        await this.#results(this.#camera.video)
        this.view.loop(this.#loop.bind(this))
    }

    static async initialize(deps) {
      const controller = new RealTimeHandDetectorController(deps)
      return controller.init()
  }
}