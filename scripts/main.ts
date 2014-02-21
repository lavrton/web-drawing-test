declare var _: any;
declare var Kinetic: any;
declare var fabric: any;
declare var SVG: any;
declare var createjs;
declare var Graphics;
declare var FPSMeter;
declare var Hammer;
declare var $: any;

var STAGE_WIDTH = $(window).width() * 3/4;
var STAGE_HEIGHT = 500;
var NODE_NUMBER = 100;
var CONNECTOR_NUMBER = 30;
var CONNECTOR_WIDTH = 5;

var nodeImg = new Image();
nodeImg.src = "data:image/png;base64,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";

class HTMLStage {
    $stageContainer;
    stage;
    nodes = [];
    connectors = [];
    constructor() {
        this.$stageContainer = $("<div>").appendTo("body").css({
            border : "2px black solid",
            display : "inline-block",
            position: "relative"
        });
        this.stage = this.createStage();
        _.times(NODE_NUMBER, () => {
            var node = this.addNode();
            this.nodes.push(node);
            this.setNodePosition(node);
        });
        _.times(CONNECTOR_NUMBER, () => {
            var n1 = this.nodes[_.random(1, this.nodes.length - 1)];
            var n2 = this.nodes[_.random(1, this.nodes.length - 1)];
            if (n1 === n2) {
                n2 = this.nodes[0];
            }
            var connector = this.addConnector(n1, n2);
            this.updateConnectorPosition(connector);
            this.connectors.push(connector);
        });
        this.addSpecialNode();
        this.draw();
    }

    moveNodes(dx, dy) {
        _.each(this.nodes, (node) => {
            this.moveNode(node, dx, dy);
        });
        _.each(this.connectors, (connector) => {
            this.updateConnectorPosition(connector);
        });
        this.draw();
    }

    createStage () {
         var stage = SVG(this.$stageContainer[0]).size(STAGE_WIDTH, STAGE_HEIGHT);
         return stage;
    }


    addConnector(n1, n2) {
        var connector = this.stage.line(0, 0, 100, 150).fill("#008000").stroke({ color : "green", width: CONNECTOR_WIDTH });
        connector.click(function() {
            this.stroke({ color: 'black' })
        })
        connector.node1 = n1;
        connector.node2 = n2;
        return connector;
    }

    draw () {
    }

    onNodeMove() {
        _.each(this.connectors, (connector) => {
            this.updateConnectorPosition(connector);
        });
        this.draw();
    }

    updateConnectorPosition (connector) {
        var p1 = this.getNodePosition(connector.node1);
        var p2 = this.getNodePosition(connector.node2);
        connector.plot(p1.x, p1.y, p2.x, p2.y);
    }

    getRandomPosition() {
        return {
            x : _.random(0 + nodeImg.width / 2, STAGE_WIDTH - nodeImg.width / 2),
            y : _.random(0 + nodeImg.height / 2, STAGE_HEIGHT - nodeImg.height / 2)
        }
    }

    addNode () {
        var node = $("<img src='" + nodeImg.src + "'>").appendTo(this.$stageContainer).css({
            position : "absolute",
            "z-index" : 2
        });
        var startX = 0;
        var startY = 0;
        var hammertime = Hammer(node[0]).on("dragstart", (event) => {
            startX = 0;
            startY = 0;
        }).on("drag", (event) => {
                var dx = - startX + event.gesture.deltaX;
                var dy = - startY + event.gesture.deltaY;
                this.moveNode(node, dx, dy);
                startX = event.gesture.deltaX;
                startY = event.gesture.deltaY;
                this.onNodeMove();
                event.gesture.preventDefault();
        });
        return node;
    }

    setNodePosition(node, pos = this.getRandomPosition()) {
        var poss = {
            x : pos.x - nodeImg.width / 2,
            y : pos.y - nodeImg.height / 2
        };
        node[0].style.left = poss.x + "px";
        node[0].style.top = poss.y + "px";
        node.pos = pos;
    }

    getNodePosition(node) {
        return <any>{
            x : parseInt(node[0].style.left) + nodeImg.width / 2,
            y : parseInt(node[0].style.top) + nodeImg.height / 2,
        } 
    }

    moveNode(node, dx, dy) {
        var pos = this.getNodePosition(node);
        this.setNodePosition(node, {
            x : pos.x + dx,
            y : pos.y + dy
        });
    }

    addSpecialNode() {
        var spec = $("<div>").appendTo(this.$stageContainer).css({
            position : "absolute",
            "background-color" : "#FF0000",
            width : 40,
            height : 40,
            top : STAGE_HEIGHT / 2,
            left : STAGE_WIDTH / 2,
            "z-index" : 3
        });
        var startX = 0;
        var startY = 0;
        var hammertime = Hammer(spec[0]).on("dragstart", (event) => {
            event.preventDefault();
            startX = 0;
            startY = 0;
        }).on("drag", (event) => {
            event.gesture.preventDefault();
            var dx = - startX + event.gesture.deltaX;
            var dy = - startY + event.gesture.deltaY;
            startX = event.gesture.deltaX;
            startY = event.gesture.deltaY;
            this.moveNodes(dx, dy);
            this.moveNode(spec, dx, dy);
        });
    }

}

class HTMLKineticStage extends HTMLStage {
    layer : any;
    createStage () {
        var stage = new Kinetic.Stage({
            container : this.$stageContainer[0],
            width : STAGE_WIDTH,
            height : STAGE_HEIGHT
        });
        var layer = new Kinetic.Layer();
        stage.add(layer);
        this.layer = layer;
        return stage;
    }

    draw() {
        this.layer.batchDraw();
    }
    updateConnectorPosition(connector) {
        var p1 = this.getNodePosition(connector.node1);
        var p2 = this.getNodePosition(connector.node2);
        connector.setPoints([p1.x, p1.y, p2.x, p2.y]);
    }
    addConnector(node1, node2) {
        var connector = new Kinetic.Line({
            stroke : "green",
            strokeWidth : CONNECTOR_WIDTH
        });
        connector.node1 = node1;
        connector.node2 = node2;
        connector.on("click tap", () => {
            connector.setStroke("blak");
            this.draw();
        });
        this.layer.add(connector);
        connector.moveToBottom();
        return connector;
    }
}


class PureKineticStage extends HTMLKineticStage {
    stage : any;   

    addNode () {
        var node = new Kinetic.Image({
            image : nodeImg,
            draggable : true,
            offset : {
                x : nodeImg.width / 2,
                y : nodeImg.height / 2
            }
        });
        node.on("dragmove", () => {
            this.onNodeMove();
        });
        this.layer.add(node);
        return node;
    }

    setNodePosition(node, position?) {
        node.setPosition(position || this.getRandomPosition());
    }

    getNodePosition(node) {
        return {
            x : node.x(),
            y : node.y()
        }
    }

    moveNode(node, dx, dy) {
        node.move({
            x : dx,
            y : dy
        });
    }

    addSpecialNode() {
        var spec = new Kinetic.Rect({
            x : STAGE_WIDTH / 2,
            y : STAGE_HEIGHT / 2,
            width : 40,
            height : 40,
            fill : "red",
            draggable : true
        });
        var startX = 0;
        var startY = 0;
        spec.on("dragstart", () => {
            startX = spec.x();
            startY = spec.y();
        });
        spec.on("dragmove", () => {
            var dx = - startX + spec.x();
            var dy = - startY + spec.y();
            this.moveNodes(dx ,dy);
            startX = spec.x();
            startY = spec.y();
        });
        this.layer.add(spec)
    }
};


class HTMLFabricStage extends HTMLStage {
    createStage () {
        var canvas = $("<canvas width='" + STAGE_WIDTH+ "' height='" + STAGE_HEIGHT+ "'>").appendTo(this.$stageContainer);
        fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
        var stage = new fabric.Canvas(canvas[0], {
            hoverCursor: 'pointer',
            selection: false
        });
        return stage;
    }

    draw() {
        this.stage.renderAll();
    }

    updateConnectorPosition(connector) {
        var p1 = this.getNodePosition(connector.node1);
        var p2 = this.getNodePosition(connector.node2);
        connector.set({
            x1 : p1.x,
            y1 : p1.y,
            x2 : p2.x,
            y2 : p2.y
        });
        connector.setCoords();
    }

    addConnector(node1, node2) {
        var connector = new fabric.Line([0, 0, 0, 0], {
            fill : "green",
            stroke : "green",
            strokeWidth : CONNECTOR_WIDTH,
            top : 0,
            left : 0,
            selectable: false
        });
        connector.node1 = node1;
        connector.node2 = node2;
        connector.on("object:selected", () => {
            connector.stroke = "black";
            this.draw();
        });
        connector.hasControls = connector.hasBorders = false;
        this.stage.add(connector);
        connector.moveTo(1);

        return connector;
    }
}


class PureFabricStage extends HTMLFabricStage {
    addNode () {
        var node = new fabric.Image(nodeImg, {
            width : nodeImg.width,
            height : nodeImg.height,
            left : STAGE_WIDTH / 3,
            top : STAGE_HEIGHT / 3,

        });
        node.hasControls = node.hasBorders = false;
        node.on('moving', () => {
            this.onNodeMove();
        });
        this.stage.add(node);
        node.moveTo(2);
        return node;
    }

    setNodePosition(node, pos = this.getRandomPosition()) {
        node.set({
            top : pos.y,
            left: pos.x
        });
        node.setCoords();
    }

    getNodePosition(node) {
        return {
            x : node.left,
            y : node.top
        }
    }

    moveNode(node, dx, dy) {
        node.left += dx;
        node.top += dy;
        node.setCoords();
    }

    addSpecialNode() {
        var spec = new fabric.Rect({
            left : STAGE_WIDTH / 2,
            top : STAGE_HEIGHT / 2,
            width : 40,
            height : 40,
            fill : "red"
        });
        spec.hasControls = spec.hasBorders = false;
        var startX = STAGE_WIDTH / 2;
        var startY = STAGE_HEIGHT / 2;
        spec.on("moving", () => {
            var dx = - startX + spec.left;
            var dy = - startY + spec.top;
            this.moveNodes(dx ,dy);
            startX = spec.left;
            startY = spec.top;
        });
        this.stage.add(spec)
    }
};

class HTMLEaselStage extends HTMLStage {
    update = true;
    createStage () {
        var canvas = $("<canvas width='" + STAGE_WIDTH+ "' height='" + STAGE_HEIGHT+ "'>").appendTo(this.$stageContainer);
        var stage = new createjs.Stage(canvas[0]);
        createjs.Touch.enable(stage);
        stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas
        createjs.Ticker.addEventListener("tick", () => {
            this.tick();
        });
        return stage;
    }

    tick() {
        if (this.update) {
            this.update = false; // only update once
            this.stage.update(event);
        }
    }

    draw() {
    }

    updateConnectorPosition(connector) {
        var p1 = this.getNodePosition(connector.node1);
        var p2 = this.getNodePosition(connector.node2);
        connector.graphics.clear().setStrokeStyle(CONNECTOR_WIDTH).beginStroke(connector.color || "green").moveTo(p1.x, p1.y).lineTo(p2.x, p2.y);

        this.update = true;
    }

    addConnector(node1, node2) {
        var connector = new createjs.Shape();
        connector.node1 = node1;
        connector.node2 = node2;
        this.stage.addChildAt(connector, 0);
        connector.on("mousedown", () => {
            connector.color = "black";
            this.update = true;
        });
        this.update = true;
        return connector;
    }
}

class PureEaselStage extends HTMLEaselStage {   
    addNode () {
        var node = new createjs.Bitmap(nodeImg);
        node.on("mousedown", function(evt) {
            this.offset = {
                x : this.x - evt.stageX,
                y : this.y - evt.stageY
            };
        });
        
        // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
        node.on("pressmove", (evt) => {
            node.x = evt.stageX+ node.offset.x;
            node.y = evt.stageY+ node.offset.y;
            this.onNodeMove();
        });
        this.update = true;
        this.stage.addChild(node);
        return node;
    }

    setNodePosition(node, pos = this.getRandomPosition()) {
        node.x = pos.x - node.image.width / 2;
        node.y = pos.y - node.image.height / 2;
        this.update = true;
    }

    getNodePosition(node) {
        return {
            x : node.x + node.image.width / 2,
            y : node.y + node.image.height / 2
        }
    }

    moveNode(node, dx, dy) {
        node.x += dx;
        node.y += dy;
        this.update = true;
    }

    addSpecialNode() {
        var spec = new createjs.Shape();
        spec.graphics.beginFill("red").drawRect(STAGE_WIDTH / 2, STAGE_HEIGHT / 2, 40, 40);
        this.stage.addChild(spec);

        var startX = 0;
        var startY = 0;
        spec.on("mousedown", (evt) => {
            startX = evt.stageX;
            startY = evt.stageY;
            spec.offset = {
                x : spec.x - evt.stageX,
                y : spec.y - evt.stageY
            };
        });
        spec.on("pressmove", (evt) => {
            spec.x = evt.stageX+ spec.offset.x;
            spec.y = evt.stageY+ spec.offset.y;
            var dx = - startX + evt.stageX;
            var dy = - startY + evt.stageY;
            this.moveNodes(dx ,dy);
            startX = evt.stageX;
            startY = evt.stageY;
        });
        this.update = true;
    }
};

nodeImg.onload = () => {
     var RAF = (function() {
        return window["requestAnimationFrame"]
            || window["webkitRequestAnimationFrame"]
            || window["mozRequestAnimationFrame"]
            || window["oRequestAnimationFrame"]
            || window["msRequestAnimationFrame"]
            || FRAF;
    })();

    function FRAF(callback) {
        window.setTimeout(callback, 1000 / 60);
    }

    var fps = $("<div>").css({
            position : "absolute"
    }).appendTo("body");
    var meter = new FPSMeter(fps[0], {
        position: 'fixed', // Meter position.
        zIndex:   10,         // Meter Z index.
        right:     '5px',      // Meter left offset.
        top:      '5px',      // Meter top offset.
        left:    'auto',     // Meter right offset.
        bottom:   'auto',     // Meter bottom offset.
        margin:   '0 0 0 0',  // Meter margin. Helps with centering the counter when left: 50%;

        interval: 1000,
        graph:   true, // Whether to show history graph.
        history: 20, // How many history states to show in a graph.
        theme: 'colorful', // Meter theme. Build in: 'dark', 'light', 'transparent', 'colorful'.
        heat:  true      // Allow themes to use coloring by FPS heat. 0 FPS = red, maxFps = green.
    });
    var tick = function() {
        meter.tick();
        RAF(tick);
    };
    tick();
    $("<h3>Test 1 - Pure KineticJS (canvas only)</h3>").appendTo("body")
    new PureKineticStage();
    $("<h3>Test 2 - Pure FabricJS (canvas only)</h3>").appendTo("body")
    new PureFabricStage();
    $("<h3>Test 3 - Pure EaselJS (canvas only)</h3>").appendTo("body")
    new PureEaselStage();
    $("<h3>Test 4 - Nodes: HTML, Connectors: KineticJS</h3>").appendTo("body")
    new HTMLKineticStage();
    $("<h3>Test 4 - Nodes: HTML, Connectors: FabricJS</h3>").appendTo("body")
    new HTMLFabricStage();
    $("<h3>Test 4 - Nodes: HTML, Connectors: EaselJS</h3>").appendTo("body")
    new HTMLEaselStage();
    $("<h3>Test 5 - Nodes: HTML, Connectors: SVG</h3>").appendTo("body")
    new HTMLStage();
};