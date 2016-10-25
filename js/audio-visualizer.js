export default class AudioVisualizer {
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
