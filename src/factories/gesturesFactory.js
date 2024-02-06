import GesturesController from "../controllers/GesturesController.js"
import GesturesService from "../services/GesturesService.js"
import GesturesView from "../views/GesturesView.js"
import EstimateStaticHandDetectorController from '../controllers/EstimateStaticHandDetectorController.js'
import HandDetectorService from '../services/HandDetectorService.js'
import { MediaPipeHandDetector } from '../models/mediapipe.js'

const mediapipeDetector = await MediaPipeHandDetector.create()

const view = new GesturesView()

const gesturesContainerFactory = {
    initialize() {
        return GesturesController.initialize({ 
            view,
            service: new GesturesService({
                dataFolder: '/src/data'
            }),
         })
    }
}

const estimateHandsFactory = {
    initialize() {
        return EstimateStaticHandDetectorController.initialize({
            service: new HandDetectorService({ 
                model: mediapipeDetector
             }), 
            view, 
        })
    }
}


export default {
    estimateHandsFactory,
    gesturesContainerFactory
}