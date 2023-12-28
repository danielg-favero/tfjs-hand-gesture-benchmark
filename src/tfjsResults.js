import { Camera } from './Camera.js'
import { TFJSHandDetector } from './models/tfjs.js'

let camera
let tfjsDetector
let results
let lastVideoTime = -1
let rightScore = 0
let leftScore = 0

const rightScoreText = document.querySelector('#right-score')
const leftScoreText = document.querySelector('#left-score')

const videoResults = async () => {
    const results = await tfjsDetector.estimateHands(camera)
    
    if(results && results.length){
        if(results[0] && results[0].handedness === 'Right') {
          rightScore = results[0].score
        }
        if(results[1] && results[1].handedness === 'Right') {
          rightScore = results[1].score
        }
        if(results[0] && results[0].handedness === 'Left') {
          leftScore = results[0].score
        }
        if(results[1] && results[1].handedness === 'Left') {
          leftScore = results[1].score
        }
      }

    rightScoreText.innerHTML = `${rightScore.toFixed(4) * 100}%`
    leftScoreText.innerHTML = `${leftScore.toFixed(4) * 100}%`

    requestAnimationFrame(videoResults)
}

const staticImagesResults = async () => {
    const images = document.querySelectorAll('.imageContainer img')
    const scoresTexts = document.querySelectorAll('.imageContainer .scores')
    const handsTexts = document.querySelectorAll('.imageContainer .hands')
    let avg = 0;
    let sum = 0;
  
    for (let i = 0; i < images.length; i++) {
      const results = await tfjsDetector.estimateHands(images[i])
  
      scoresTexts[i].innerHTML = `${results[0].score.toFixed(4) * 100}%` 
      handsTexts[i].innerHTML = results[0].handedness
      sum += results[0].score.toFixed(4) * 100

      if(i % 19 === 0 && i !== 0) {
        avg = sum / 20;
        console.log(avg)
        sum = 0;
        avg = 0;
      }
    }
  }
  
const main = async () => {
    camera = await Camera.create()
    tfjsDetector = await TFJSHandDetector.create()

    Camera.draw(camera)
    Camera.play(camera)

    await videoResults()
    await staticImagesResults()
}

main()