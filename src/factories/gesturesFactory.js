import GesturesController from "../controllers/GesturesController.js"
import GesturesService from "../services/GesturesService.js"
import GesturesView from "../views/GesturesView.js"

const factory = {
    initialize() {
        return GesturesController.initialize({ 
            view: new GesturesView(),
            service: new GesturesService({
                dataFolder: '/src/data'
            })
         })
    }
}

export default factory