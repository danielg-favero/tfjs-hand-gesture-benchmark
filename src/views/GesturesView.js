export default class GesturesView {
    #gesturesNodesLists = document.getElementById("gestures-lists")
    downloadButton = document.getElementById("download")
    estimateButton = document.getElementById("estimate")
    gesturesImagesList = {}

    constructor() {
        window.totalImages = 0
    }

    insertIntoGesturesImagesList(gesture, img) {
        this.gesturesImagesList[gesture].push(img)
    }

    createGestureImage(src, id) {
        const img = document.createElement('img')
        img.src = src
        img.id = id

        return img
    }

    createGestureImageCaptionContainer(id) {
        const scoreCaption = document.createElement('p')
        scoreCaption.className = 'score-caption'
        scoreCaption.id = `score-caption-${id}`
        scoreCaption.innerText = 'Score: '

        const handednessCaption = document.createElement('p')
        handednessCaption.className = 'handedness-caption'
        handednessCaption.id = `handedness-caption-${id}`
        handednessCaption.innerText = 'Mão: ' 

        const captionContainer = document.createElement('div')
        captionContainer.appendChild(scoreCaption)
        captionContainer.appendChild(handednessCaption)

        return captionContainer
    }

    createGestureImageContainer(id) {
        const gestureImageContainer = document.createElement('div')
        gestureImageContainer.className = 'imageContainer'

        const gestureCaption = this.createGestureImageCaptionContainer(id)
        gestureImageContainer.appendChild(gestureCaption)

        return gestureImageContainer
    }

    createGestureImageContainersGrid() {
        const gestureImageContainersGrid = document.createElement('div')
        gestureImageContainersGrid.className = 'gestures-images-grid'

        return gestureImageContainersGrid
    }

    createGestureImageContainerHeader(id, title) {
        const header = document.createElement('div')
        header.classList = 'flex space-between width-full'

        const headerTitle = document.createElement('h3')
        headerTitle.innerText = title

        const editButton = document.createElement('button')
        editButton.innerHTML = 'Editar'
        editButton.classList = 'secondary'
        editButton.id = id + '-edit'
        editButton.disabled = true

        header.appendChild(headerTitle)
        header.appendChild(editButton)

        return header
    }
    
    createGestureList(id, title, imagesSrc) {
        const grid = this.createGestureImageContainersGrid()

        const gestureList = document.createElement('section')
        gestureList.classList = 'flex-col gap-16'
        gestureList.id = id

        const header = this.createGestureImageContainerHeader(id, title)
        
        for(let src of imagesSrc) {
            let image = this.createGestureImage(src, window.totalImages)
            this.insertIntoGesturesImagesList(id, image)

            let imageContainer = this.createGestureImageContainer(window.totalImages)
            imageContainer.insertBefore(image, imageContainer.firstChild)

            grid.appendChild(imageContainer)

            window.totalImages++
        }

        gestureList.appendChild(header)
        gestureList.appendChild(grid)

        return gestureList
    }

    addGestureList(gesture, title, imagesSrc) {
        this.gesturesImagesList[gesture] = []
        this.#gesturesNodesLists.appendChild(this.createGestureList(gesture, title, imagesSrc))
    }

    estimateButtonClickFn(fn) {
        this.estimateButton.addEventListener('click', fn)
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