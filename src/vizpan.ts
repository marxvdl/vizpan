class Vizpan {

    private components: Component[];
    private fabricCanvas: fabric.Canvas;

    public scale = 1;
    public translateX = 0;
    public translateY = 1;

    /**
     * Builds the main Vizpan object for given canvas id
     * @param canvasElement The id string of a canvas element
     */
    constructor(private canvasElement: string) {

        //Fabric.js setup and settings
        this.fabricCanvas = new fabric.Canvas(
            canvasElement,
            {
                selection: false,
                hoverCursor: 'default'
            }
        );

        //EasyPZ setup
        let outer = this;        
        new EasyPZ(
            document.body,

            //The Pan and Zoom function
            (transform: { scale: number; translateX: number; translateY: number; }) => {
                outer.translateX = transform.translateX;
                outer.translateY = transform.translateY;
                outer.scale = transform.scale;

                for (let comp of outer.components) {
                    comp.updateFabricObject();
                }

                outer.fabricCanvas.renderAll();

                console.log(transform);
            },

            //EasyPZ settings
            {
                minScale: 0.1,
                maxScale: 5,
                bounds: {
                    top: -this.fabricCanvas.getHeight() / 2,
                    bottom: this.fabricCanvas.getHeight() / 2,
                    right: this.fabricCanvas.getWidth() / 2,
                    left: -this.fabricCanvas.getWidth() / 2                    
                    
                }
            }
        );

  

        this.components = [];
    }



    /**
     * Inserts a component into the canvas
     * @param component
     */
    public add(component: Component): void {
        component.owner = this;
        component.updateFabricObject();
        this.components.push(component);
        this.fabricCanvas.add(component.fabricObject);
    }

}