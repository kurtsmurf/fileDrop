const dropArea = document.getElementById('drop-area')

  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
  arr = [...files]
  arr.forEach(handleFile)
}

const audioContext = new AudioContext()
const audioBuffers = []
const out = audioContext.createGain()
const comp = audioContext.createDynamicsCompressor()
const analyser = audioContext.createAnalyser()
out.connect(comp).connect(analyser).connect(audioContext.destination)

const fileRepresentation = (fileName) => {
  const root = document.createElement('div')
  root.classList.add('file')

  const icon = document.createElement('img')
  icon.classList.add('file-icon')
  icon.src = 'images/audio-file.svg'

  const label = document.createElement('span')
  label.classList.add('file-label')
  label.innerText = fileName

  root.appendChild(icon)
  root.appendChild(label)

  return root
}

function handleFile(file) {
  let reader = new FileReader()
  reader.onloadend = (e) => {
    let arrayBuffer = e.target.result
    audioContext.decodeAudioData(arrayBuffer)
      .then(audioBuffer => {
        audioBuffers.push(audioBuffer)
        const visualFile = fileRepresentation(file.name)
        document.querySelector('.desktop').appendChild(visualFile)
      })
  }
  reader.readAsArrayBuffer(file)
}

const playableKeys = {
  "0": { "index": 9, "row": 3 },
  "1": { "index": 0, "row": 3 },
  "2": { "index": 1, "row": 3 },
  "3": { "index": 2, "row": 3 },
  "4": { "index": 3, "row": 3 },
  "5": { "index": 4, "row": 3 },
  "6": { "index": 5, "row": 3 },
  "7": { "index": 6, "row": 3 },
  "8": { "index": 7, "row": 3 },
  "9": { "index": 8, "row": 3 },
  "z": { "index": 0, "row": 0 },
  "x": { "index": 1, "row": 0 },
  "c": { "index": 2, "row": 0 },
  "v": { "index": 3, "row": 0 },
  "b": { "index": 4, "row": 0 },
  "n": { "index": 5, "row": 0 },
  "m": { "index": 6, "row": 0 },
  ",": { "index": 7, "row": 0 },
  ".": { "index": 8, "row": 0 },
  "/": { "index": 9, "row": 0 },
  "a": { "index": 0, "row": 1 },
  "s": { "index": 1, "row": 1 },
  "d": { "index": 2, "row": 1 },
  "f": { "index": 3, "row": 1 },
  "g": { "index": 4, "row": 1 },
  "h": { "index": 5, "row": 1 },
  "j": { "index": 6, "row": 1 },
  "k": { "index": 7, "row": 1 },
  "l": { "index": 8, "row": 1 },
  ";": { "index": 9, "row": 1 },
  "'": { "index": 10, "row": 1 },
  "q": { "index": 0, "row": 2 },
  "w": { "index": 1, "row": 2 },
  "e": { "index": 2, "row": 2 },
  "r": { "index": 3, "row": 2 },
  "t": { "index": 4, "row": 2 },
  "y": { "index": 5, "row": 2 },
  "u": { "index": 6, "row": 2 },
  "i": { "index": 7, "row": 2 },
  "o": { "index": 8, "row": 2 },
  "p": { "index": 9, "row": 2 },
  "[": { "index": 10, "row": 2 },
  "]": { "index": 11, "row": 2 },
  "-": { "index": 10, "row": 3 },
  "=": { "index": 11, "row": 3 }
}

const getBufSrc = (audioBuffer) => {
  const sourceNode = audioContext.createBufferSource()
  sourceNode.buffer = audioBuffer

  const stereoPanner = audioContext.createStereoPanner()
  stereoPanner.pan.value = Math.random() * 2 - 1

  sourceNode.connect(stereoPanner).connect(out)
  return sourceNode
}

const play = (playbackRate = 1) => {
  const tone = getBufSrc(audioBuffers[0])
  tone.playbackRate.value = playbackRate
  tone.start()
}

const noteIndex = (char, rowOffset = 3) => {
  playableKey = playableKeys[char]
  if (!playableKey) return
  return playableKey.index + playableKey.row * rowOffset
}

tones = {}

const handleKeyDown = (e) => {
  if (!playableKeys[e.key]) return

  const playbackRate = Math.pow(2, noteIndex(e.key) / 12)
  const tone = getBufSrc(audioBuffers[0])
  tone.playbackRate.value = playbackRate
  tone.loop = true
  tone.start()

  tones[e.key] = tones[e.key] || []
  tones[e.key].push(tone)
}

const handleKeyUp = (e) => {
  if (!playableKeys[e.key]) return

  tones[e.key].forEach(tone => tone.stop())
}

document.addEventListener('keydown', handleKeyDown)
document.addEventListener('keyup', handleKeyUp)