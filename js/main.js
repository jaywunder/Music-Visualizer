const sequentialArray = function (length) {
  let array = []
  for (let i = 0; i < length; i++) {
    array.push(i)
  }
  return array
}


class AudioVisualiser {
  constructor() {
    // audio variables
    this.audio = new Audio()
    this.context = new AudioContext()
    this.analyser = this.context.createAnalyser()
    this.analyser.fftSize = 32
    this.source = this.context.createMediaElementSource(this.audio)
    // this.source = this.context.createOscillator()
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)

    // graph variables
    this.frequencyDataStorage = []

    this.setupAudio()
    this.setupGraphing()

    this.renderFrame()
  }

  setupAudio() {
    this.audio.src = './assets/ride4u.mp3'
    this.audio.autoplay = true
    document.body.appendChild(this.audio)

    this.source.connect(this.analyser)
    this.analyser.connect(this.context.destination)
    this.audio.onended = this.onComplete.bind(this)

    // in case I want to use an oscillator
    // this.source.type = 'square';
    // this.source.frequency.value = 2000; // value in hertz
    // this.source.connect(this.analyser);
    // this.source.connect(this.context.destination);
    // this.source.start();
  }

  setupGraphing() {
    setTimeout(this.onComplete.bind(this), 3000)
    for (let i = 0; i < this.analyser.fftSize; i++) {
      this.frequencyDataStorage.push([])
    }
  }

  renderFrame() {
    requestAnimationFrame(this.renderFrame.bind(this))

    this.analyser.getByteFrequencyData(this.frequencyData)
    this.addPoints()
  }

  onComplete() {
    this.renderGraph()
  }

  addPoints() {
    this.frequencyData.forEach((frequency, i) => {
      this.frequencyDataStorage[i].push(frequency)
    })
  }

  renderGraph() {
    let graphData = []
    for (let i in this.frequencyDataStorage) {
      graphData.push({
        x: sequentialArray(this.frequencyDataStorage[i].length),
        y: this.frequencyDataStorage[i],
        type: 'scatter'
      })
    }

    Plotly.newPlot('graph', graphData)
  }
}

new AudioVisualiser()

// trace1 = {
//   x: [1,2,3,4],
//   y: [1,2,3,4],
//   type: 'scatter'
// }
//
// trace2 = {
//   x: [2,3,4],
//   y: [1,2,3],
//   type: 'scatter'
// }
//
// Plotly.newPlot('graph', [trace1, trace2])
