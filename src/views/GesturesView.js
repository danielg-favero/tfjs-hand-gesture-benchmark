export default class GesturesView {
    #gesturesLists = document.getElementById("gestures-lists")

    constructor() {
        window.totalImages = 0
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

    createGestureImageContainer(src, id) {
        const gestureImageContainer = document.createElement('div')
        gestureImageContainer.className = 'imageContainer'

        const gestureImage = this.createGestureImage(src, id)
        const gestureCaption = this.createGestureImageCaptionContainer(id)

        gestureImageContainer.appendChild(gestureImage)
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
            let imageContainer = this.createGestureImageContainer(src, window.totalImages)
            grid.appendChild(imageContainer)

            window.totalImages++
        }

        gestureList.appendChild(header)
        gestureList.appendChild(grid)

        return gestureList
    }

    addGestureList(id, title, imagesSrc) {
        this.#gesturesLists.appendChild(this.createGestureList(id, title, imagesSrc))
    }
}