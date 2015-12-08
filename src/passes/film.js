import { FilmMaterial } from "../materials";
import { Pass } from "./pass";
import THREE from "three";

/**
 * Depth-of-field pass using a bokeh shader.
 *
 * @class TexturePass
 * @constructor
 * @extends Pass
 * @param {Object} [options] - The options.
 * @param {Boolean} [options.grayscale=true] - Convert to greyscale.
 * @param {Number} [options.noiseIntensity=0.5] - The noise intensity. [0.0, 1.0].
 * @param {Number} [options.scanlinesIntensity=0.05] - The scanline intensity. [0.0, 1.0].
 * @param {Number} [options.scanlinesCount=4096.0] - The number of scanlines. [0, 4096].
 */

export function FilmPass(options) {

	Pass.call(this, new THREE.Scene(), new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));

	/**
	 * Film shader material.
	 *
	 * @property material
	 * @type {FilmMaterial}
	 * @private
	 */

	this.material = new FilmMaterial();

	if(options !== undefined) {

		if(options.grayscale !== undefined) { this.material.uniforms.grayscale.value = options.grayscale; }
		if(options.noiseIntensity !== undefined) { this.material.uniforms.nIntensity.value = options.noiseIntensity; }
		if(options.scanlinesIntensity !== undefined) { this.material.uniforms.sIntensity.value = options.scanlinesIntensity; }
		if(options.scanlinesCount !== undefined) { this.material.uniforms.sCount.value = options.scanlinesCount; }

	}

	/**
	 * Render to screen flag.
	 *
	 * @property renderToScreen
	 * @type {Boolean}
	 * @default false
	 */

	this.renderToScreen = false;

	// Swap targets in this pass.
	this.needsSwap = true;

	/**
	 * The quad mesh to render.
	 *
	 * @property quad
	 * @type {Mesh}
	 */

	this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
	this.scene.add(this.quad);

}

FilmPass.prototype = Object.create(Pass.prototype);
FilmPass.prototype.constructor = FilmPass;

/**
 * Renders the scene.
 *
 * @method render
 * @param {WebGLRenderer} renderer - The renderer to use.
 * @param {WebGLRenderTarget} writeBuffer - The write buffer.
 * @param {WebGLRenderTarget} readBuffer - The read buffer.
 * @param {Number} delta - The render delta time.
 */

FilmPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta) {

	this.material.uniforms.tDiffuse.value = readBuffer;
	this.material.uniforms.time.value += delta;

	this.quad.material = this.material;

	if(this.renderToScreen) {

		renderer.render(this.scene, this.camera);

	} else {

		renderer.render(this.scene, this.camera, writeBuffer, false);

	}

};
