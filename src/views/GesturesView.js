export default class GesturesView {
    #gesturesLists = document.getElementById("gestures-lists")

    createGestureImage(src) {
        const img = document.createElement('img')
        img.src = src

        return img
    }

    createGestureImageCaptionContainer() {
        const scoreCaption = document.createElement('p')
        scoreCaption.className = 'score-caption'
        scoreCaption.innerText = 'Score: '

        const handednessCaption = document.createElement('p')
        handednessCaption.className = 'handedness-caption'
        handednessCaption.innerText = 'Mão: ' 

        const captionContainer = document.createElement('div')
        captionContainer.appendChild(scoreCaption)
        captionContainer.appendChild(handednessCaption)

        return captionContainer
    }

    createGestureImageContainer(src) {
        const gestureImageContainer = document.createElement('div')
        gestureImageContainer.className = 'imageContainer'

        const gestureImage = this.createGestureImage(src)
        const gestureCaption = this.createGestureImageCaptionContainer()

        gestureImageContainer.appendChild(gestureImage)
        gestureImageContainer.appendChild(gestureCaption)

        return gestureImageContainer
    }

    createGestureImageContainersGrid() {
        const gestureImageContainersGrid = document.createElement('div')
        gestureImageContainersGrid.className = 'gestures-images-grid'

        return gestureImageContainersGrid
    }
    
    createGestureList(id, title, imagesSrc) {
        const grid = this.createGestureImageContainersGrid()

        const gestureList = document.createElement('section')
        gestureList.id = id

        const heading = document.createElement('h3')
        heading.innerText = title

        
        for(let src of imagesSrc) {
            let imageContainer = this.createGestureImageContainer(src)
            grid.appendChild(imageContainer)
        }

        gestureList.appendChild(heading)
        gestureList.appendChild(grid)

        return gestureList
    }

    addGestureList(id, title, imagesSrc) {
        this.#gesturesLists.appendChild(this.createGestureList(id, title, imagesSrc))
    }
}