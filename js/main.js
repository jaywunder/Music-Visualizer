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
    this.analyser.fftSize = 128
    this.source = this.context.createMediaElementSource(this.audio)
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)

    // graph variables
    this.frequencyDataStorage = []
    this.velocityDataStorage = []

    // misc other variables
    this.running = true
    this.step = -1

    // call setup and start rendering
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
  }

  setupGraphing() {
    for (let i = 0; i < this.analyser.fftSize; i++) {
      this.frequencyDataStorage.push({
        x: [],
        y: [],
        type: 'scatter'
      })
      this.velocityDataStorage.push({
        x: [],
        y: [],
        type: 'scatter'
      })
    }

    Plotly.newPlot('frequency-graph', this.frequencyDataStorage)
    Plotly.newPlot('velocity-graph', this.velocityDataStorage)
  }

  renderFrame() {
    if ( this.running ) requestAnimationFrame(this.renderFrame.bind(this))
    this.step++

    this.analyser.getByteFrequencyData(this.frequencyData)
    this.addPoints()
    Plotly.redraw('frequency-graph')
    Plotly.redraw('velocity-graph')
  }

  onComplete() {
    this.running = false
  }

  addPoints() {
    this.frequencyData.forEach((frequency, i) => {
      this.frequencyDataStorage[i].x.push(this.step)
      this.frequencyDataStorage[i].y.push(frequency)
      this.velocityDataStorage[i].x.push(this.step)

      if (this.step > 0) {
        let previous = this.frequencyDataStorage[i].y[this.step-1]
        let current = this.frequencyDataStorage[i].y[this.step]
        let velocity = current - previous
        this.velocityDataStorage[i].y.push(velocity)
      } else {
        this.velocityDataStorage[i].y.push(frequency)
      }
    })
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
