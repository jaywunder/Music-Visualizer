export default class AudioGrapher {
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
