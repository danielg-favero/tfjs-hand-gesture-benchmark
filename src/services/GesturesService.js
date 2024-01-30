export const DEFAULT_IMAGE_QUANTITY = 20

export default class GesturesService {
    #dataFolder

    constructor({ dataFolder }) {
        this.#dataFolder = dataFolder
    }
    
    loadData(keyword, qty) {
        const sources = []

        for(let i = 0; i < qty; i++) {
            sources.push(`${this.#dataFolder}/${keyword}/${i + 1}.jpg`)
        }
        
        return sources
    }
    
    init() {
        const click = this.loadData('click', DEFAULT_IMAGE_QUANTITY)
        const goBack = this.loadData('go-back', DEFAULT_IMAGE_QUANTITY)
        const move = this.loadData('move', DEFAULT_IMAGE_QUANTITY)
        const scrollDown = this.loadData('scroll-down', DEFAULT_IMAGE_QUANTITY)
        const scrollUp = this.loadData('scroll-up', DEFAULT_IMAGE_QUANTITY)

        return {
            click,
            goBack,
            move,
            scrollDown,
            scrollUp
        }
    }
}