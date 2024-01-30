export default class HandDetectorView {
    updateScore(id, score) {
        const el = document.getElementById(`#${id}`)
        el.innerText = `${score.toFixed(4) * 100}%`
    }

    loop(fn) {
        requestAnimationFrame(fn)
    }
}