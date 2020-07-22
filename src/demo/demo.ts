let vizpan = new Vizpan('testboard');

vizpan.add(new Rectangle(
    {
        fill: 'blue',
        x: 0,
        y: 0,
        width: 150,
        height: 100,
        angle: 45
    }
));

vizpan.add(new Rectangle(
    {
        fill: 'green',
        x: 650,
        y: 0,
        width: 150,
        height: 100,
        angle: -5
    }
));

vizpan.add(new Rectangle(
    {
        fill: 'red',
        x: 0,
        y: 500,
        width: 150,
        height: 100,
        stroke: 'pink',
        strokeWidth: 4,
        angle: 90
    }
));

vizpan.add(new Rectangle(
    {
        fill: 'yellow',
        x: 650,
        y: 500,
        width: 150,
        height: 100,
        angle: 45
    }
));


vizpan.add(new Triangle(
    {
        fill: 'Aquamarine',
        x: 350,
        y: 300,
        width: 150,
        height: 100,
        angle: -20
    }
));
vizpan.add(new Ellipse(
    {
        fill: 'Brown',
        x: 500,
        y: 300,
        width: 150,
        height: 100,
        stroke: 'lime',
        strokeWidth: 3,
        angle: 45
    }
));
vizpan.add(new Ellipse(
    {
        fill: 'Gold',
        x: 400,
        y: 400,
        width: 100,
        height: 150,
        angle: -15
    }
));
vizpan.add(new Triangle(
    {
        fill: 'DarkOrchid',
        x: 500,
        y: 400,
        width: 100,
        height: 150,
        stroke: 'white',
        strokeWidth: 2,
        angle: 15
    }
));


vizpan.add(new VizImage(
    {
        x: 100,
        y: 100,
        url: 'https://raw.githubusercontent.com/marxvdl/gifroller/master/example-input.png',
        width: 294,
        height: 262,
        angle: -5
    }
));