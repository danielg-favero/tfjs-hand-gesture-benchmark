const MAX_Z_INDEX = '2147483647'
const CAMERA_DISPLAY_WIDTH = '360px'
const CAMERA_DISPLAY_HEIGHT = '640px'

export class Camera {
  constructor() {
    this.video = document.getElementById('camera');
  }

  static #getVideoConfig() {
    return {
      audio: false,
      video: {
        width: 640,
        height: 360,
        frameRate: {
          ideal: 60,
        },
      },
    };
  }

  static draw(video) {
    video.height = video.videoHeight;
    video.width = video.videoWidth;
    video.style.width = video.videoWidth;
    video.style.width = video.videoWidth;
  }
  
  static play(video) {
    video.play();
  }

  static pause(video) {
    video.pause();
  }

  static async create() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'API do Browser navigator.mediaDevices.getUserMedia não está disponível',
      );
    }

    const stream = await navigator.mediaDevices.getUserMedia(
      this.#getVideoConfig(),
    );
    
    const camera = new Camera();
    camera.video.srcObject = stream;

    // Permissão da Câmera
    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve(camera.video);
      };
    });

    return camera.video;
  }
}