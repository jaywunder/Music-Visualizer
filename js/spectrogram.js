export default class Spectrogram {
  constructor(state) {
    let nyquist = state.nyquistFrequency

    let valueData = {
      labels: new Array(nyquist),
      datasets: [{
        label: "",
        backgroundColor: [],
        borderWidth: 0,
        data: new Array(nyquist),
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
      labels: new Array(nyquist),
      datasets: [{
        label: "",
        backgroundColor: [],
        borderWidth: 0,
        data: new Array(nyquist),
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

    for (let i = 0; i < nyquist; i++) {
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

  update(state) {
    this.step++

    // update the value graphs
    this.valueGraph.data.datasets[0].data = state.currentFrequencyData
    this.valueGraph.update()
    this.valueGraph.render()

    // render derivative graph
    this.derivativeGraph.data.datasets[0].data = state.currentVelocityData
    this.derivativeGraph.update()
    this.derivativeGraph.render()

    // render derivative line graph
    this.derivativeLineGraph.data.labels.push('')
    for (let i = 0; i < state.velocityHistory.length; i++) {
      let derivatives = state.velocityHistory[i]

      // console.log(this.derivativeLineGraph.data.datasets);
      this.derivativeLineGraph.data.datasets[i].data.push(derivatives[derivatives.length-1])
    }

    this.derivativeLineGraph.update()
    this.derivativeLineGraph.render()
  }
}
