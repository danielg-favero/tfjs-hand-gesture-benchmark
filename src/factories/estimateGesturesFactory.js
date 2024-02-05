import HandDetectorService from '../services/HandDetectorService.js'
import { MediaPipeHandDetector } from '../models/mediapipe.js'
import StaticHandDetectorController from '../controllers/StaticHandDetectorController.js'
import EstimateHandsView from '../views/EstimateHandsView.js'

const mediapipeDetector = await MediaPipeHandDetector.create()

const factory = {
    initialize() {
        return StaticHandDetectorController.initialize({
            service: new HandDetectorService({ 
                model: mediapipeDetector
             }), 
            view: new EstimateHandsView(), 
        })
    }
}

export default factory