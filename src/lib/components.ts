/**
 * Set of parameters that apply to all components.
 */
interface ComponentParameters {
    x: number;
    y: number;
    width: number;
    height: number;
    angle?: number;
}

/**
 * Generic superclass for visual stuff that can be inserted
 * into the Vizpan canvas.
 */
abstract class Component {
    public parameters: ComponentParameters;

    public vizpan: Vizpan;
    public fabricObject: fabric.Object = null;

    constructor(params: ComponentParameters) {
        this.parameters = params;
    }

    /**
     * Generates pixel-based fabric.js positional properties based on the
     * logical Vizpan properties, adjusted for pan and zoom.
     */
    protected generateBaseFabricOptions(): fabric.IObjectOptions {

        // Set the base properties first
        const fabricOptions: fabric.IObjectOptions = {
            selectable: false,
            left: this.vizpan.scale * this.parameters.x + this.vizpan.translateX,
            top: this.vizpan.scale * this.parameters.y + this.vizpan.translateY,
            width: this.parameters.width,
            height: this.parameters.height,
            scaleX: this.vizpan.scale,
            scaleY: this.vizpan.scale,
        };

        // Add any subclass-specific properties
        this.setAdditionalFabricOptions(fabricOptions);

        // Accont for any necessary adjustments for pan and zoom properties
        this.adjustForPanZoom(fabricOptions);

        return fabricOptions;
    }

    /**
     * Adds new, subclass-specific options to the internal Fabric object.
     * @param fabricOptions
     */
    // tslint:disable-next-line: no-empty
    protected setAdditionalFabricOptions(fabricOptions: fabric.IObjectOptions) { }

    /**
     * If necessary, modifiy the Fabric.js properties to account for variations in pan and zoom.
     * @param fabricProperties
     */
    // tslint:disable-next-line: no-empty
    protected adjustForPanZoom(fabricOptions: fabric.IObjectOptions) { }

    /**
     * Generates a new internal Fabric.js object according to the component parameters.
     */
    public abstract createFabricObject(): void;

    /**
     * Updates the existing internal Fabric.js object according to the component parameters.
     */
    public updateFabricObject(): void {
        const fabricOptions = this.generateBaseFabricOptions();
        this.fabricObject.set(fabricOptions);
        this.adjustAngle();
    }

    /**
     * Helper method that adjusts the object rotation on its center.
     */
    protected adjustAngle(): void {
        if (this.parameters.angle !== undefined) {
            this.fabricObject.set('angle', undefined);
            this.fabricObject.rotate(this.parameters.angle);
        }
    }

}

/**
 * Shared parameters of geometrical shapes.
 */
interface ShapeParameters extends ComponentParameters {
    fill?: string,
    stroke?: string,
    strokeWidth?: number
}

/**
 * Generic geometric shape.
 */
abstract class Shape extends Component {
    public parameters: ShapeParameters;

    constructor(options: ShapeParameters) {
        super(options);
    }

    /**
     * Adds the Shape parameters to the Fabric options object
     * @param fabricOptions
     */
    protected setAdditionalFabricOptions(fabricOptions: fabric.IObjectOptions) {
        if (this.parameters.fill !== undefined)
            fabricOptions.fill = this.parameters.fill;

        if (this.parameters.stroke !== undefined)
            fabricOptions.stroke = this.parameters.stroke;

        if (this.parameters.strokeWidth !== undefined)
            fabricOptions.strokeWidth = this.parameters.strokeWidth;
    }

    /**
     * Creates a new object for a subclass of Shape
     */
    public createFabricObject(): void {
        const fabricOptions = this.generateBaseFabricOptions();
        this.fabricObject = this.createSpecificFabricObject(fabricOptions);
        this.adjustAngle();
        this.vizpan.fabricCanvas.add(this.fabricObject);
    }

    protected abstract createSpecificFabricObject(fabricProps: fabric.IObjectOptions): fabric.Object;

}


/**
 * A rectangle.
 */
class Rectangle extends Shape {
    protected createSpecificFabricObject(fabricProps: fabric.IObjectOptions): fabric.Object {
        return new fabric.Rect(fabricProps);
    }
}

/**
 * A triangle.
 */
class Triangle extends Shape {
    protected createSpecificFabricObject(fabricProps: fabric.IObjectOptions): fabric.Object {
        return new fabric.Triangle(fabricProps);
    }
}

/**
 * An ellipse
 */
class Ellipse extends Shape {
    protected createSpecificFabricObject(fabricProps: fabric.IObjectOptions): fabric.Object {
        return new fabric.Ellipse(fabricProps);
    }

    protected adjustForPanZoom(fabricProps: fabric.IObjectOptions) {
        const options = fabricProps as fabric.IEllipseOptions;
        options.rx = options.width / 2;
        options.ry = options.height / 2;
    }
}

/**
 * Parameters for bitmap objects.
 */
interface ImageParameters extends ComponentParameters {
    url: string
}

/**
 * An image
 */
class VizImage extends Component {
    public parameters: ImageParameters;

    constructor(options: ImageParameters) {
        super(options);
    }

    /**
     * Creates the image component.
     */
    public createFabricObject(): void {
        const outer = this;

        const fabricOptions = this.generateBaseFabricOptions();

        fabric.Image.fromURL(
            this.parameters.url,
            oImg => {
                oImg.set(fabricOptions);
                outer.fabricObject = oImg;
                outer.adjustAngle();
                outer.vizpan.fabricCanvas.add(oImg);
            }
        );
    }
}