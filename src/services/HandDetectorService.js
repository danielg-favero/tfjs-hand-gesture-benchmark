export default class HandDetectorService {
    #model

    constructor({ model }) {
        this.#model = model
    }

    async estimateHands(src) {
        return this.#model.estimateHands(src)
    }
}