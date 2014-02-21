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
nodeImg.src = "imgs/node.png";

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