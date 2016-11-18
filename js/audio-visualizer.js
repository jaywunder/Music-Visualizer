import * as PIXI from 'pixi.js'

const NUM_BINS = 512 / 2 / 2

export default class AudioVisualizer {
  constructor() {
    this.renderer = PIXI.autoDetectRenderer(1080, 350, { backgroundColor : 0x1099bb })
    this.stage = new PIXI.Container()
    this.graphics = new PIXI.Graphics()

    this.bins = []

    document.getElementById('canvas-container').appendChild(this.renderer.view)

    const texture = PIXI.Texture.fromImage('assets/bunny.png')
    this.bunny = new PIXI.Sprite(texture)
    this.bunny.anchor.x = 0.5
    this.bunny.anchor.y = 0.5
    this.bunny.position.x = 200
    this.bunny.position.y = 150

    this.graphics.position.x = 0
    this.graphics.position.y = 0

    this.stage.addChild(this.bunny)
    this.stage.addChild(this.graphics)
    this.animate()

    // TODO: REMOVE LATER
    let graphData = {
      labels: new Array(NUM_BINS),
      datasets: [{
        label: "",
        backgroundColor: [],
        borderWidth: 0,
        data: new Array(NUM_BINS),
      }]
    }

    let graphCtx = document.getElementById('graph-canvas').getContext('2d')
    this.graphGraph = new Chart(graphCtx, {
      type: 'bar',
      data: graphData,
      options: {
        responsive: false,
        scales: {
          yAxes: [{
            ticks: {
              max: 10,
              min: 0,
              stepSize: 1
            }
          }]
        }
      }
    })
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.renderer.render(this.stage);
  }

  /*
    Variables: Value, Velocity, Acceleration

    Divide numbers into bins based on their velocity

    Something with particles????

    Make nodes freely come and go
  */

  update(state) {
    let graphData = []
    for (let i = 0; i < NUM_BINS; i++) graphData.push(0)

    this.bunny.rotation += 0.1;

    this.graphics.clear()

    const canvasWidth = 1080
    const canvasHeight = 350
    const frequencyData = state.currentFrequencyData
    const velocityData = state.currentVelocityData

    const width = canvasWidth / state.nyquistFrequency
    const circleRadius = width * 0.2
    const padding = width * 0.1

    for (let frequency = 0; frequency < frequencyData.length; frequency++) {
      const amplitude = frequencyData[frequency]
      const velocity = velocityData[frequency]

      const radius = circleRadius * (1 + amplitude / 255)
      const color = 0xFFFFFF * (1 + frequency / state.nyquistFrequency)
      const angle = frequency / frequencyData.length * Math.PI * 2

      this.graphics.beginFill(color, 0.5)
      this.graphics.drawCircle(frequency * width + (width / 2), width, radius)
      this.graphics.drawCircle(
        Math.cos(angle) * canvasWidth / 2.5 + canvasWidth / 2,
        Math.sin(angle) * canvasHeight / 2.5 + canvasHeight / 2,
        radius * 2
      )
      this.graphics.endFill()

      graphData[this.frequencyToInt(frequency, amplitude, velocity)]++
    }

    this.graphGraph.data.datasets[0].data = graphData
    this.graphGraph.update()
    this.graphGraph.render()
  }

  frequencyToInt(frequency, amplitude, velocity) {
    // For an explanation of this equation, look at the
    // documentation for this function.
    const k1 = 100
    const k2 = 0.1
    const exp = 1.2

    // return Math.floor((Math.pow(frequency, exp) + k1 * velocity / amplitude) * k2)
    return Math.floor(velocity / amplitude * 100)
  }
}
