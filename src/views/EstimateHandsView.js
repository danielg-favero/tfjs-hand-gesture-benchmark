export default class EstimateHandsView {
    imagesList = []
    estimateButton = document.getElementById("estimate")
    downloadButton = document.getElementById("download")
    augmentButton = document.getElementById("augment")

    constructor() {
        for(let i = 0; i < window.totalImages; i++) {
            let img = document.getElementById(i)
            this.imagesList.push(img)
        }
    }

    estimateButtonClickFn(fn) {
        this.estimateButton.addEventListener('click', fn)
    }

    augmentButtonClickFn(fn) {
        this.augmentButton.addEventListener('click', fn)
    }

    downloadButtonClickFn(fn) {
        this.downloadButton.addEventListener('click', fn)
    }
    
    onDownloadButtonClick(file, fileName) {
        const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
        const anchorElement = document.createElement('a');
        anchorElement.setAttribute("href", dataString);
        anchorElement.setAttribute("download", `${fileName}.json`);
        anchorElement.click()
    }

    updateGestureImageCaptionContainer(id, data) {
        const scoreCaption = document.getElementById(`score-caption-${id}`)
        scoreCaption.innerText = `Score: ${data.score.toFixed(3) * 100}%`
        
        const handednessCaption = document.getElementById(`handedness-caption-${id}`)
        handednessCaption.innerText = `Mão: ${data.handedness}`
    }
}