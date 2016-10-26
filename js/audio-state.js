export default class AudioState {
  constructor(fftSize) {
    this.fftSize = fftSize
    this.nyquistFrequency = this.fftSize / 2

    this.step = 0
    this.frequencyHistory = []
    this.velocityHistory = []
    this.accelerationHistory = []

    for (let i = 0; i < this.nyquistFrequency; i++) {
      this.frequencyHistory.push([0])
      this.velocityHistory.push([0])
      this.accelerationHistory.push([0])
    }
  }

  update(frequencyData) {
    this.step++

    // update derivative data
    for (let i = 0;  i < frequencyData.length; i++) {
      let currentFrequency = frequencyData[i]
      let currentVelocity = currentFrequency - this.frequencyHistory[i][this.step - 1]
      let currentAcceleration = currentVelocity - this.velocityHistory[i][this.step - 1]

      this.frequencyHistory[i].push(currentFrequency)
      this.velocityHistory[i].push(currentVelocity)
      this.accelerationHistory[i].push(currentAcceleration)
    }
  }

  // An array of all the last items of each frequency array
  get currentFrequencyData() {
    const output = []
    for (let i = 0; i < this.frequencyHistory.length; i++) {
      let frequencyData = this.frequencyHistory[i]
      output.push(frequencyData[frequencyData.length - 1])
    }
    return output
  }

  // An array of all the last items of each velocity array
  get currentVelocityData() {
    const output = []
    for (let i = 0; i < this.velocityHistory.length; i++) {
      let frequencyData = this.velocityHistory[i]
      output.push(frequencyData[frequencyData.length - 1])
    }
    return output
  }

  // An array of all the last items of each acceleration array
  get currentAccelerationData() {
    const output = []
    for (let i = 0; i < this.accelerationHistory.length; i++) {
      let frequencyData = this.accelerationHistory[i]
      output.push(frequencyData[frequencyData.length - 1])
    }
    return output
  }
}
