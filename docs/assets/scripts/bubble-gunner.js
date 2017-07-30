var BubbleGunner;
(function (BubbleGunner) {
    var DisplayObject = createjs.DisplayObject;
    function getCanvasDimensions() {
        return [BubbleGunner.canvas.width, BubbleGunner.canvas.height];
    }
    BubbleGunner.getCanvasDimensions = getCanvasDimensions;
    function getWindowDimensions() {
        return [window.innerWidth, window.innerHeight];
    }
    BubbleGunner.getWindowDimensions = getWindowDimensions;
    function adjustSize(shape) {
        if (!(shape instanceof DisplayObject)) {
            throw new Error("Type " + typeof shape + " does not extend " + DisplayObject);
        }
        var displayObj = shape;
        var windowDimensions = getWindowDimensions();
        var newScale = shape.scaleFactor * windowDimensions[0] / shape.originalWidth;
        console.warn("original width: " + shape.originalWidth);
        console.warn("window: " + windowDimensions);
        console.warn("scale factor1: " + newScale);
        if (newScale < shape.minScale)
            newScale = shape.minScale;
        else if (newScale > shape.maxScale)
            newScale = shape.maxScale;
        console.warn("scale factor2: " + newScale);
        displayObj.scaleX = displayObj.scaleY = newScale;
    }
    BubbleGunner.adjustSize = adjustSize;
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=bubble-gunner.js.map