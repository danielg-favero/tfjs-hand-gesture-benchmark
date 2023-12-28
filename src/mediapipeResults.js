import { Camera } from './Camera.js'
import { MediaPipeHandDetector } from './models/mediapipe.js'

let camera
let mediapipeDetector
let results
let lastVideoTime = -1
let rightScore = 0
let leftScore = 0

const rightScoreText = document.querySelector('#right-score')
const leftScoreText = document.querySelector('#left-score')

const videoResults = async () => {
  if (mediapipeDetector.runningMode === "IMAGE") {
    mediapipeDetector.runningMode = "VIDEO";
    await mediapipeDetector.detector.setOptions({ runningMode: "VIDEO" });
  }

  let startTimeMs = performance.now();
  if (lastVideoTime !== camera.currentTime) {
    lastVideoTime = camera.currentTime;
    results = mediapipeDetector.detector.detectForVideo(camera, startTimeMs);
  }

  if(results.handednesses && results.handednesses.length){
    if(results.handednesses[0][0].categoryName === 'Right') {
      rightScore = results.handednesses[0][0].score
    }
    if(results.handednesses[0][0].categoryName === 'Left') {
      leftScore = results.handednesses[0][0].score
    }
  }
  
  rightScoreText.innerHTML = `${rightScore.toFixed(4) * 100}%`
  leftScoreText.innerHTML = `${leftScore.toFixed(4) * 100}%`

  requestAnimationFrame(videoResults);
}

const staticImagesResults = async () => {
  await mediapipeDetector.detector.setOptions({ runningMode: "IMAGE" });

  const images = document.querySelectorAll('.imageContainer img')
  const scoresTexts = document.querySelectorAll('.imageContainer .scores')
  const handsTexts = document.querySelectorAll('.imageContainer .hands')
  let avg = 0;
  let sum = 0;

  for(let i = 0; i < images.length; i++) {
    const results = mediapipeDetector.detector.detect(images[i])

    scoresTexts[i].innerHTML = `${results.handednesses[0][0].score.toFixed(4) * 100}%` 
    handsTexts[i].innerHTML = results.handednesses[0][0].categoryName

    sum += results.handednesses[0][0].score.toFixed(4) * 100

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
  mediapipeDetector = await MediaPipeHandDetector.create()
  
  Camera.draw(camera)
  Camera.play(camera)

  await videoResults()
  await staticImagesResults()
}

main()