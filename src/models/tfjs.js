const handPoseDetection = window.handPoseDetection

export class TFJSHandDetector {
  static async create() {
    const detector = new TFJSHandDetector();
    await detector.setup();

    return detector;
  }

  async setup() {
    try {
      console.log('Iniciando Detector')
      this.detector = await TFJSHandDetector.createDetector();
      console.log('Dectector inicializado')
    } catch (err) {
      throw new Error(`Houve um erro ao criar o detector de mãos: ${err}`);
    }
  }

  static async createDetector() {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detector = await handPoseDetection.createDetector(model, {
      runtime: 'tfjs',
      modelType: 'lite',
      maxHands: 2,
    });

    return detector;
  }

  async estimateHands(video) {
    const detector = this.detector;

    let hands = [];

    try {
      hands = await detector.estimateHands(video, { flipHorizontal: true });

      return hands;
    } catch (err) {
      detector.dispose();
      this.detector = undefined;
      throw new Error(`Houve um erro ao detectar as mãos: ${err}`);
    }
  }
}