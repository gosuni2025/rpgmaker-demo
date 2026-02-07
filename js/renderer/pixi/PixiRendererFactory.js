//=============================================================================
// PixiRendererFactory.js - Pixi.js backend for RendererFactory
//=============================================================================

(function() {

    var PixiRendererFactory = {

        createContainer: function() {
            return new PIXI.Container();
        },

        createSprite: function(texture) {
            return new PIXI.Sprite(texture || new PIXI.Texture(new PIXI.BaseTexture()));
        },

        createBaseTexture: function(source) {
            return new PIXI.BaseTexture(source);
        },

        createTexture: function(baseTexture) {
            return new PIXI.Texture(baseTexture);
        },

        createRenderTexture: function(width, height) {
            return PIXI.RenderTexture.create(width, height);
        },

        createGraphicsNode: function() {
            return new PIXI.Graphics();
        },

        createTilingSprite: function(texture) {
            return new PIXI.extras.PictureTilingSprite(texture || new PIXI.Texture(new PIXI.BaseTexture()));
        },

        createVoidFilter: function() {
            return new PIXI.filters.VoidFilter();
        },

        createColorMatrixFilter: function() {
            return new PIXI.filters.ColorMatrixFilter();
        },

        createTilemapLayer: function(zIndex, bitmaps, useSquareShader) {
            var zLayer = new PIXI.tilemap.ZLayer(null, zIndex);
            var layer = new PIXI.tilemap.CompositeRectTileLayer(zIndex, bitmaps || [], useSquareShader);
            zLayer.addChild(layer);
            return { zLayer: zLayer, layer: layer };
        },

        supportsShaderTilemap: function() {
            return true;
        },

        SCALE_MODES: {
            'linear': PIXI.SCALE_MODES.LINEAR,
            'nearest': PIXI.SCALE_MODES.NEAREST
        },

        setScaleMode: function(baseTexture, mode) {
            baseTexture.scaleMode = this.SCALE_MODES[mode];
        }

    };

    RendererFactory.register('pixi', PixiRendererFactory);

    //=========================================================================
    // Pixi-specific global settings
    //=========================================================================
    PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;
    PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO;
    PIXI.tilemap.TileRenderer.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    PIXI.tilemap.TileRenderer.DO_CLEAR = true;

})();
