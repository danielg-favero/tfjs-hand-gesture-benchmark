export default class RealTimeHandDetectorController {
    #service
    #view
    #camera

    constructor({ service, view, camera }) {
        this.#service = service
        this.#view = view
        this.#camera = camera
    }

    async init() {
        return this.#loop()
    }

    async #estimateHands() {
      const results = await this.#service.estimateHands(this.#camera.video)
      let rightScore = ''
      let leftScore = ''

      console.log(results)

      if(!results || !results.length) return

      if(results[0] && results[0].handedness === 'Right') {
        rightScore = results[0].score
      }
      if(results[1] && results[1].handedness === 'Right') {
        rightScore = results[1].score
      }
      if(results[0] && results[0].handedness === 'Left') {
        leftScore = results[0].score
      }
      if(results[1] && results[1].handedness === 'Left') {
        leftScore = results[1].score
      }

      if (leftScore) this.#view.updateScore("camera-left-score", leftScore)
      if (rightScore) this.#view.updateScore("camera-right-score", rightScore)
    }

    static async initialize(deps) {
        const controller = new RealTimeHandDetectorController(deps)
        return controller.init()
    }

    async #loop() {
        await this.#estimateHands()
        this.#view.loop(this.#loop.bind(this))
    }
}