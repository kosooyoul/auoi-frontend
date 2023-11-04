class HanulseEffectRendererFactory {
	#flashEffectRenderer = null;
	#linkEffectRenderer = null;
	#prismEffectRenderer = null;
	#warpEffectRenderer = null;
	#bigWarpEffectRenderer = null;
	#energyEffectRenderer = null;

	get(effectName) {
		switch (effectName) {
			case "flash": return this.#flashEffectRenderer || (this.#flashEffectRenderer = new HanulseFlashEffectRenderer());
			case "link": return this.#linkEffectRenderer || (this.#linkEffectRenderer = new HanulseLinkEffectRenderer());
			case "prism": return this.#prismEffectRenderer || (this.#prismEffectRenderer = new HanulsePrismEffectRenderer());
			case "warp": return this.#warpEffectRenderer || (this.#warpEffectRenderer = new HanulseWarpEffectRenderer());
			case "bigwarp": return this.#bigWarpEffectRenderer || (this.#bigWarpEffectRenderer = new HanulseBigWarpEffectRenderer());
			case "energy": return this.#energyEffectRenderer || (this.#energyEffectRenderer = new HanulseEnergyEffectRenderer());
		}
		return null;
	}
}