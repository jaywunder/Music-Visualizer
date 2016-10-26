export default class AudioWrapper {
  constructor(state, onComplete) {
    const fftSize = state.fftSize

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
