export default class Spectogram {
  constructor(fftSize) {
    this.fftSize = fftSize
    let data = {
      labels: new Array(this.fftSize / 2), // TODO: LABELS
      datasets: [{
        label: "",
        backgroundColor: ['rgba(54, 162, 235, 0.2)'],
        borderWidth: 0,
        data: new Array(this.fftSize / 2),
      }]
    }

    let ctx = document.getElementById('chartjs').getContext('2d')
    this.chart = new Chart(ctx, {
      type: 'bar',
      data,
      options: {
        responsive: false
      }
    });

  }

  update(frequencyData) {
    this.chart.data.datasets[0].data = frequencyData
    this.chart.update()
    this.chart.render()
  }
}
