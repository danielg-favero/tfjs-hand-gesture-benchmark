import {
  HandLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

export class MediaPipeHandDetector {
  static async create() {
    const detector = new MediaPipeHandDetector();
    await detector.setup();

    return detector;
  }

  async setup() {
    try {
      console.log('Iniciando Detector MediaPipe')
      this.detector = await MediaPipeHandDetector.createDetector();
      console.log('Dectector MediaPipe inicializado')
    } catch (err) {
      throw new Error(`Houve um erro ao criar o detector de mãos: ${err}`);
    }
  }

  static async createDetector() {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    const detector = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2
    });

    return detector
  }

  static setOptions(options) {
    this.detector.setOptions(options)
  }

  async estimateHands(img) {
    const detector = this.detector;

    let hands = [];

    try {
      hands = await detector.detect(img);

      return hands;
    } catch (err) {
      detector.dispose();

      throw new Error(`Houve um erro ao detectar as mãos: ${err}`);
    }
  }
}