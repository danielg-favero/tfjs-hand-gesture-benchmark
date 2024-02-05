const { HAND_CONNECTIONS, drawConnectors, drawLandmarks } = window

export default class HandDetectorView {
    #webcamCanvas = document.getElementById('output-canvas')
    #webcamCanvasCtx = this.#webcamCanvas.getContext('2d')

    updateScore(id, score) {
        const el = document.getElementById(id)
        el.innerText = `${score.toFixed(4) * 100}%`
    }

    drawHandsToWebCam(results) {
        this.#clearScreen()
        this.#drawHands(results, this.#webcamCanvasCtx)
    }

    #drawHands(results, ctx) {
        for(const landmarks of results.landmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                color: "#FF0000",
                lineWidth: 5
            })
            drawLandmarks(ctx, landmarks, {
                color: "#0000FF",
                lineWidth: 2
            })
        }
    }

    #clearScreen() {
        this.#webcamCanvasCtx.clearRect(0, 0, this.#webcamCanvas.width, this.#webcamCanvas.height);
    }

    loop(fn) {
        requestAnimationFrame(fn)
    }
}