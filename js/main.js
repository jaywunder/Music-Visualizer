class AudioGrapher {
  constructor(fftSize) {
    // https://plot.ly/javascript/plotlyjs-function-reference/
    this.fftSize = fftSize
    this.step = -1
    this.frequencyDataStorage = []
    this.velocityDataStorage = []

    for (let i = 0; i < this.fftSize; i++) {
      this.frequencyDataStorage.push({
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        hoverinfo: 'none'
      })
      this.velocityDataStorage.push({
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        hoverinfo: 'none'
      })
    }

    Plotly.newPlot('frequency-graph', this.frequencyDataStorage)
    Plotly.newPlot('velocity-graph', this.velocityDataStorage)
  }

  addFrequencyData(frequencyData) {
    this.step++

    frequencyData.forEach((frequency, i) => {
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

class AudioWrapper {
  constructor(fftSize, onComplete) {
    this.audio = new Audio()
    this.context = new AudioContext()
    this.analyser = this.context.createAnalyser()
    this.analyser.fftSize = fftSize
    this.source = this.context.createMediaElementSource(this.audio)
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)

    this.audio.src = './assets/ride4u.mp3'
    this.audio.autoplay = true
    document.body.appendChild(this.audio)

    this.source.connect(this.analyser)
    this.analyser.connect(this.context.destination)
    this.audio.onended = onComplete
  }

  get fftSize() { return this.analyser.fftSize }

  getFrequencyData() {
    this.analyser.getByteFrequencyData(this.frequencyData)

    return this.frequencyData
  }
}

class AudioVisualizer {
  constructor() {
    this.renderer = PIXI.autoDetectRenderer(800, 600,{ backgroundColor : 0x1099bb });
    this.stage = new PIXI.Container();
    this.graphics = new PIXI.Graphics()
    document.getElementById('canvas-container').appendChild(this.renderer.view);


    // this.texture = PIXI.Texture.fromImage('assets/img/bunny.png');
    // this.bunny = new PIXI.Sprite(texture);
    // bunny.anchor.x = 0.5;
    // bunny.anchor.y = 0.5;
    // bunny.position.x = 200;
    // bunny.position.y = 150;

    this.stage.addChild(this.bunny);

    this.update()

    let $this = this;
    function animate() {
        requestAnimationFrame(animate);

        // just for fun, let's rotate mr rabbit a little
        $this.bunny.rotation += 0.1;

        // render the container
        $this.renderer.render($this.stage);
    }
  }

  update(frequencyData) {

  }
}

class AudioMaster {
  constructor() {
    this.audio = new AudioWrapper(32, this.onComplete.bind(this))
    this.grapher = new AudioGrapher(this.audio.fftSize)
    this.spectogram = new Spectogram()
    // this.visual = new AudioVisualizer()
    this.running = true

    this.renderFrame()
  }

  renderFrame() {
    if ( this.running ) requestAnimationFrame(this.renderFrame.bind(this))

    let frequencyData = this.audio.getFrequencyData()
    this.grapher.addFrequencyData(frequencyData)
    // this.visual.update(frequencyData)
    Plotly.redraw('frequency-graph')
    Plotly.redraw('velocity-graph')
  }

  onComplete() {
    this.running = false
  }
}

new AudioMaster()

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
