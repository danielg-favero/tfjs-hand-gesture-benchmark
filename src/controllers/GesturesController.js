export default class GesturesController {
    #view
    #service

    constructor({ view, service }) {
        this.#view = view
        this.#service = service
    }

    init() {
        const data = this.#service.init()

        this.#view.addGestureList('click', 'Clique', data.click)
        this.#view.addGestureList('go-back', 'Voltar para trás', data.goBack)
        this.#view.addGestureList('move', 'Mover', data.move)
        this.#view.addGestureList('scroll-down', 'Scroll Down', data.scrollDown)
        this.#view.addGestureList('scroll-up', 'Scroll Up', data.scrollUp)
    }

    static initialize(deps) {
        const controller = new GesturesController(deps)
        return controller.init()
    }
}