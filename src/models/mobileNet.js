import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"
import { Camera } from './Camera.js'

let mobileNet
let xs = null;
let ys = null;
let labels = []
let model
let isPredicting
let predictedClass
let camera

const gestureMap = [
  'click',
  'go-back',
  'move',
  'scroll-up',
  'scroll-down'
]

async function loadMobilenet() {
  const mobileNetModel = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json');
  
  const layer = mobileNetModel.getLayer('conv_pw_13_relu');

  const inputLayer = tf.layers.input({ shape: [100, 100, 3] });

  const x = layer.apply(inputLayer);

  mobileNet = tf.model({
    inputs: inputLayer,
    outputs: x
  });
}

function cropImage(img) {
  const size = Math.min(img.shape[0], img.shape[1]);

  const centerHeight = img.shape[0] / 2;
  const centerWidth = img.shape[1] / 2;

  const beginHeight = centerHeight - (size / 2);
  const beginWidth = centerWidth - (size / 2);
  return tf.slice(img, [
    beginHeight, 
    beginWidth, 
    0
  ], 
  [
    size, 
    size, 
    3
  ]);
}

function preProcess(webcamImage) {
  // Inverter a imagem horizontalmente
  const reversedImage = tf.reverse(webcamImage, 1);
  
  // Alterar a imagem para um canal de 3 cores (RGB)
  const croppedImage = cropImage(reversedImage);
  
  const batchedImage = tf.expandDims(croppedImage, 0);

  // Normalizar a imagem entre valores de 0 - 1
  const normalizedImage = tf.div(batchedImage, tf.scalar(127))
  return tf.sub(normalizedImage, tf.scalar(1))
}

function capture(img) {
  return tf.tidy(() => {
    // Criar um tf.Tensor para a imagem da câmera
    const webcamImage = tf.browser.fromPixels(img);

    // Pré-processar a imagem
    return preProcess(webcamImage) 
 });
}

function addSample(sample, label) {
  if(xs === null) {
    xs = tf.keep(sample)
  } else {
    const oldX = xs
    xs = tf.keep(oldX.concat(sample, 0))
    oldX.dispose()
  }
  labels.push(label)
}

function encodeLabels(numClasses) {
  for (let i = 0; i < labels.length; i++) {
    const y = tf.tidy(() => {
        return tf.oneHot(
          tf.tensor1d([labels[i]]).toInt(), 
          numClasses
        )}
      );
      
      if (ys == null) {
          ys = tf.keep(y);
      } else {
          const oldY = ys;
          ys = tf.keep(oldY.concat(y, 0));
          oldY.dispose();
          y.dispose();
      }
  }
}

async function train() {
  encodeLabels(5);
  model = await tf.sequential({
    layers: [
      tf.layers.flatten({
        inputShape: mobileNet.outputs[0].shape.slice(1)
      }),
      tf.layers.dense({ units: 100, activation: 'relu' }),
      tf.layers.dense({ units: 5, activation: 'softmax' })
    ]
  });
  
  await model.compile({
    optimizer: tf.train.adam(0.0001), 
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });
  
  const infos = await model.fit(xs, ys, {
    epochs: 20,
    callbacks: {
      onTrainBegin: async () => {
        console.log("Começando o treino do modelo")
      },
      onTrainEnd: async () => {
        isTrained = true
        console.log("Fim do Treino")
      },
      onEpochBegin: async (epoch) => {
        console.log(`Início da Época ${epoch}`)
      },
      onBatchEnd: async (bach, logs) => {
        console.log(`Início do lote ${bach}: ${JSON.stringify(logs)}`)
      }
    }
  });

  console.log(infos)
  predictButton.disabled = false
  trainButton.classList.add('success')
}

async function evaluate(testImages, testLabels) {
  let correctPredictions = 0;

  for (let i = 0; i < testImages.length; i++) {
    const img = capture(testImages[i]);
    const activation = mobileNet.predict(img);
    const predictions = model.predict(activation);
    const predictedClass = predictions.as1D().argMax().dataSync()[0];

    if (predictedClass === testLabels[i]) {
      correctPredictions++;
    }

    await tf.nextFrame();
  }

  const accuracy = correctPredictions / testImages.length;
  console.log('Acurácia do modelo:', accuracy);
}


async function predict() {
  while (isPredicting) {
      predictedClass = tf.tidy(() => {
          const img = capture(camera);
          const activation = mobileNet.predict(img);
          const predictions = model.predict(activation);
          return predictions.as1D().argMax();
      });
      mobileNetPredictionContainer.innerHTML = gestureMap[(await predictedClass.data())[0]]
      predictedClass.dispose();
      await tf.nextFrame();
  }
}

function setPredicting(predicting) {
  isPredicting = predicting;
  predict();
}

function preprocess() {
  const clickImages = document.querySelectorAll('#click .imageContainer img')
  const goBackImages = document.querySelectorAll('#go-back .imageContainer img')
  const moveImages = document.querySelectorAll('#move .imageContainer img')
  const scrollDownImages = document.querySelectorAll('#scroll-down .imageContainer img')
  const scrollUpImages = document.querySelectorAll('#scroll-up .imageContainer img')
  
  console.log("Pré-processando imagens de Click")
  for(let image of clickImages) {
    const preProcessedImage = capture(image)
    addSample(mobileNet.predict(preProcessedImage), 0)
  }
  clickStatus.innerHTML = '(Pré-processado)'
  clickStatus.classList.remove('loaded')
  clickStatus.classList.add('success')

  console.log("Pré-processando imagens de Go Back")
  for(let image of goBackImages) {
    const preProcessedImage = capture(image)
    addSample(mobileNet.predict(preProcessedImage), 1)
  }
  goBackStatus.innerHTML = '(Pré-processado)'
  goBackStatus.classList.remove('loaded')
  goBackStatus.classList.add('success')

  console.log("Pré-processando imagens de Move")
  for(let image of moveImages) {
    const preProcessedImage = capture(image)
    addSample(mobileNet.predict(preProcessedImage), 2)
  }
  moveStatus.innerHTML = '(Pré-processado)'
  moveStatus.classList.remove('loaded')
  moveStatus.classList.add('success')

  console.log("Pré-processando imagens de ScrollDown")
  for(let image of scrollDownImages) {
    const preProcessedImage = capture(image)
    addSample(mobileNet.predict(preProcessedImage), 3)
  }
  scrollDownStatus.innerHTML = '(Pré-processado)'
  scrollDownStatus.classList.remove('loaded')
  scrollDownStatus.classList.add('success')

  console.log("Pré-processando imagens de ScrollUp")
  for(let image of scrollUpImages) {
    const preProcessedImage = capture(image)
    addSample(mobileNet.predict(preProcessedImage), 4)
  }
  scrollUpStatus.innerHTML = '(Pré-processado)'
  scrollUpStatus.classList.remove('loaded')
  scrollUpStatus.classList.add('success')

  trainButton.disabled = false
}

const main = async () => {
  tf.setBackend('webgl');

  await loadMobilenet();
  
  camera = await Camera.create()
  Camera.draw(camera)
  Camera.play(camera)
}

const preprocessButton = document.querySelector('#preprocess')
preprocessButton.addEventListener('click', async () => {
  preprocess()
})

const trainButton = document.querySelector('#train')
trainButton.disabled = true
trainButton.addEventListener('click', async () => {
  await train()
})

const predictButton = document.querySelector('#predict')
predictButton.disabled = true
predictButton.addEventListener('click', () => {
  setPredicting(!isPredicting)
  isPredicting ? predictButton.classList.add('success') : predictButton.classList.remove('success')
})

const clickStatus = document.querySelector('#click .status')
const goBackStatus = document.querySelector('#go-back .status')
const moveStatus = document.querySelector('#move .status')
const scrollDownStatus = document.querySelector('#scroll-down .status')
const scrollUpStatus = document.querySelector('#scroll-up .status')

const mobileNetPredictionContainer = document.querySelector('.predictions #mobilenet span')

clickStatus.innerHTML = '(Carregado)'
clickStatus.classList.add('loaded')

goBackStatus.innerHTML = '(Carregado)'
goBackStatus.classList.add('loaded')

moveStatus.innerHTML = '(Carregado)'
moveStatus.classList.add('loaded')

scrollDownStatus.innerHTML = '(Carregado)'
scrollDownStatus.classList.add('loaded')

scrollUpStatus.innerHTML = '(Carregado)'
scrollUpStatus.classList.add('loaded')

main()