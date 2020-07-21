/**
 * Set of properties that apply to all components.
 */
interface ComponentProperties {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Generic superclass for visual stuff that can be inserted 
 * into the Vizpan canvas.
 */
abstract class Component {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public owner: Vizpan;

    public fabricObject: fabric.Object = null;

    constructor(props: ComponentProperties) {
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
    }

    /**
     * Generates pixel-based fabric.js positional properties based on the 
     * logical Vizpan properties, adjusted for pan and zoom.
     */
    protected generateFabricProperties(): fabric.IObjectOptions {
        console.log(this.width, this.owner.scale,  this.width * this.owner.scale);
        
        return {
            selectable: false,
            left: (this.x + this.owner.translateX) * this.owner.scale,
            top: (this.y + this.owner.translateY) * this.owner.scale,
            width: this.width * this.owner.scale,
            height: this.height * this.owner.scale            
        };
    }

    public abstract updateFabricObject(): void

}

/**
 * Specific properties of rectangles.
 */
interface RectangleProperties extends ComponentProperties {
    fill: string
}

/**
 * A rectangle.
 */
class Rectangle extends Component {
    private fill: string;

    constructor(props: RectangleProperties) {
        super(props);
        this.fill = props.fill;
    }

    public updateFabricObject(): void {
        let props = this.generateFabricProperties();
        props.fill = this.fill;

        if (this.fabricObject === null) {
            this.fabricObject = new fabric.Rect(props);
        }
        else {
            this.fabricObject.set(props);
        }
    }
}