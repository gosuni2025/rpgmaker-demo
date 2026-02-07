//=============================================================================
// PixiRendererStrategy.js - Pixi.js backend for RendererStrategy
//=============================================================================

(function() {

    var PixiRendererStrategy = {

        createRenderer: function(width, height, options) {
            PIXI.dontSayHello = true;
            var renderer = null;
            try {
                switch (options.type) {
                case 'canvas':
                    renderer = new PIXI.CanvasRenderer(width, height, { view: options.view });
                    break;
                case 'webgl':
                    renderer = new PIXI.WebGLRenderer(width, height, { view: options.view });
                    break;
                default:
                    renderer = PIXI.autoDetectRenderer(width, height, { view: options.view });
                    break;
                }
                if (renderer && renderer.textureGC) {
                    renderer.textureGC.maxIdle = 1;
                }
            } catch (e) {
                renderer = null;
            }
            return renderer;
        },

        render: function(renderer, stage) {
            renderer.render(stage);
            if (renderer.gl && renderer.gl.flush) {
                renderer.gl.flush();
            }
        },

        resize: function(renderer, width, height) {
            renderer.resize(width, height);
        },

        isWebGL: function(renderer) {
            return renderer && renderer.type === PIXI.RENDERER_TYPE.WEBGL;
        },

        callGC: function(renderer) {
            if (this.isWebGL(renderer)) {
                renderer.textureGC.run();
            }
        },

        getGL: function(renderer) {
            return renderer.gl || null;
        },

        renderToCanvas: function(renderer, stage, width, height) {
            var renderTexture = PIXI.RenderTexture.create(width, height);
            renderer.render(stage, renderTexture);
            stage.worldTransform.identity();
            var canvas = null;
            if (this.isWebGL(renderer)) {
                canvas = renderer.extract.canvas(renderTexture);
            } else {
                canvas = renderTexture.baseTexture._canvasRenderTarget.canvas;
            }
            // Copy the canvas content before destroying the render texture
            var resultCanvas = document.createElement('canvas');
            resultCanvas.width = width;
            resultCanvas.height = height;
            var context = resultCanvas.getContext('2d');
            context.drawImage(canvas, 0, 0);
            renderTexture.destroy({ destroyBase: true });
            return resultCanvas;
        },

        getModeText: function(renderer) {
            if (this.isWebGL(renderer)) {
                return 'WebGL mode';
            }
            return 'Canvas mode';
        }

    };

    RendererStrategy.register('pixi', PixiRendererStrategy);

})();
