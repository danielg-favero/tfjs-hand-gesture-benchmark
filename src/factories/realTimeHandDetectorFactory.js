import RealTimeHandDetectorController from '../controllers/RealTimeHandDetectorController.js'
import HandDetectorService from '../services/HandDetectorService.js'
import { Camera } from '../lib/Camera.js'
import { TFJSHandDetector } from '../models/tfjs.js'
import { MediaPipeHandDetector } from '../models/mediapipe.js'
import HandDetectorView from '../views/HandDetectorView.js'

const camera = await Camera.create()
const tfjsDetector = await TFJSHandDetector.create()
const mediapipeDetector = await MediaPipeHandDetector.create()

const factory = {
    initialize() {
        return RealTimeHandDetectorController.initialize({
            service: new HandDetectorService({ 
                model: mediapipeDetector
             }), 
            view: new HandDetectorView(), 
            camera
        })
    }
}

export default factory