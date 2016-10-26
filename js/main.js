import Chart from 'chart.js'
Chart.defaults.global.animation.duration = 50

import AudioGrapher from './audio-grapher.js'
import AudioVisualizer from './audio-visualizer.js'
import Spectrogram from './spectrogram.js'
import AudioState from './audio-state.js'
import AudioWrapper from './audio-wrapper.js'

class AudioMaster {
  constructor() {
    const FFT_SIZE = 1024 / 2 / 16 // 256

    this.state = new AudioState(FFT_SIZE)

    this.audio = new AudioWrapper(this.state, this.onComplete.bind(this))
    this.spectrogram = new Spectrogram(this.state)

    // this.grapher = new AudioGrapher(FFTSIZE)
    // this.visual = new AudioVisualizer(FFT_SIZE)
    this.running = true

    this.renderFrame()
  }

  renderFrame() {
    if ( this.running ) requestAnimationFrame(this.renderFrame.bind(this))

    let frequencyData = this.audio.getFrequencyData()
    this.state.update(frequencyData)

    this.spectrogram.update(this.state)

    // this.visual.update(frequencyData)
  }

  onComplete() {
    this.running = false
  }
}

new AudioMaster()
