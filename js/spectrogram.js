export default class Spectrogram {
  constructor(fftSize) {
    this.fftSize = fftSize

    this.frequencyHistory = []
    this.derivativeData = []
    this.step = 0

    for (let i = 0; i < this.fftSize / 2; i++) {
      this.derivativeData.push([0])
      this.frequencyHistory.push([0])
    }

    let valueData = {
      labels: new Array(this.fftSize / 2),
      datasets: [{
        label: "",
        backgroundColor: [],
        borderWidth: 0,
        data: new Array(this.fftSize / 2),
      }]
    }

    let valueCtx = document.getElementById('value-canvas').getContext('2d')
    this.valueGraph = new Chart(valueCtx, {
      type: 'bar',
      data: valueData,
      options: {
        responsive: false,
        scales: {
          yAxes: [{
            ticks: {
              max: 256,
              min: 0,
              stepSize: 32
            }
          }]
        }
      }
    })

    let derivativeData = {
      labels: new Array(this.fftSize / 2),
      datasets: [{
        label: "",
        backgroundColor: [],
        borderWidth: 0,
        data: new Array(this.fftSize / 2),
      }]
    }

    let derivativeCtx = document.getElementById('derivative-canvas').getContext('2d')
    this.derivativeGraph = new Chart(derivativeCtx, {
      type: 'bar',
      data: derivativeData,
      options: {
        responsive: false,
        scales: {
          yAxes: [{
            ticks: {
              max: 10,
              min: -10,
              stepSize: 2
            }
          }]
        }
      }
    })

    let derivativeLineData = {
      labels: [],
      datasets: []
    }

    for (let i = 0; i < this.fftSize / 2; i++) {
      derivativeLineData.labels.push('')
      derivativeLineData.datasets.push({
        label: "",
        data: [],
      })
    }

    let derivativeLineCtx = document.getElementById('derivative-line-canvas').getContext('2d')
    this.derivativeLineGraph = new Chart(derivativeLineCtx, {
      type: 'line',
      data: derivativeLineData,
      options: {
        responsive: false,
        scales: {
          yAxes: [{
            ticks: {
              max: 60,
              min: -60,
              stepSize: 20
            }
          }]
        }
      }
    })
  }

  update(frequencyData) {
    this.step++

    // update the value graphs
    this.valueGraph.data.datasets[0].data = frequencyData
    this.valueGraph.update()
    this.valueGraph.render()

    // update derivative data
    for (let i = 0;  i < frequencyData.length; i++) {
      let current = frequencyData[i]
      let previous = this.frequencyHistory[i][this.step - 1]

      this.derivativeData[i].push(current - previous)
      this.frequencyHistory[i].push(current)
    }

    // render derivative graph
    this.derivativeGraph.data.datasets[0].data = this.derivativeData.map(
      (item) => item[this.step]
    )
    this.derivativeGraph.update()
    this.derivativeGraph.render()

    // render derivative line graph
    this.derivativeLineGraph.data.labels.push('')
    for (let i = 0; i < this.derivativeData.length; i++) {
      let derivatives = this.derivativeData[i]

      // console.log(this.derivativeLineGraph.data.datasets);
      this.derivativeLineGraph.data.datasets[i].data.push(derivatives[derivatives.length-1])

      // debugger
    }
    this.derivativeLineGraph.update()
    this.derivativeLineGraph.render()
  }
}
