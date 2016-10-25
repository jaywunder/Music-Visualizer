import Chart from 'chart.js'
Chart.defaults.global.animation.duration = 50

import AudioGrapher from './audio-grapher.js'
import AudioVisualizer from './audio-visualizer.js'
import Spectrogram from './spectrogram.js'

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

class AudioMaster {
  constructor() {
    const FFT_SIZE = 1024 / 2 / 16 // 256
    this.audio = new AudioWrapper(FFT_SIZE, this.onComplete.bind(this))
    this.spectrogram = new Spectrogram(FFT_SIZE)

    // this.grapher = new AudioGrapher(FFTSIZE)
    // this.visual = new AudioVisualizer()
    this.running = true

    this.renderFrame()
  }

  renderFrame() {
    if ( this.running ) requestAnimationFrame(this.renderFrame.bind(this))

    let frequencyData = this.audio.getFrequencyData()
    // console.log(frequencyData);
    this.spectrogram.update(frequencyData)

    // this.grapher.addFrequencyData(frequencyData)
    // this.visual.update(frequencyData)
    // Plotly.redraw('frequency-graph')
    // Plotly.redraw('velocity-graph')
  }

  onComplete() {
    this.running = false
  }
}

new AudioMaster()

// let data = {
//   labels: ["January", "February", "March", "April", "May", "June", "July"],
//   datasets: [
//     {
//       label: "",
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)'
//       ],
//       borderColor: [
//         'rgba(255,99,132,1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)'
//       ],
//       borderWidth: 0,
//       data: [65, 59, 80, 81, 56, 55, 40],
//     }
//   ]
// };
//
// let ctx = document.getElementById('chartjs').getContext('2d')
// let myBarChart = new Chart(ctx, {
//   type: 'bar',
//   data,
//   // options
// });
