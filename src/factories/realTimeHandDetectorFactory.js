import RealTimeHandDetectorController from '../controllers/RealTimeHandDetectorController.js'
import HandDetectorService from '../services/HandDetectorService.js'
import { Camera } from '../lib/Camera.js'
import { TFJSHandDetector } from '../models/tfjs.js'
import HandDetectorView from '../views/HandDetectorView.js'

const camera = await Camera.create()
const tfjsDetector = await TFJSHandDetector.create()

const factory = {
    initialize() {
        return RealTimeHandDetectorController.initialize({
            service: new HandDetectorService({ 
                model: tfjsDetector
             }), 
            view: new HandDetectorView(), 
            camera
        })
    }
}

export default factory