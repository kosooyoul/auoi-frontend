class HanulseEffectRendererFactory {
	flashEffectRenderer = null;
	linkEffectRenderer = null;
	prismEffectRenderer = null;
	warpEffectRenderer = null;

	constructor() {

	}

	get(effectName) {
		switch (effectName) {
			case "flash": return this.flashEffectRenderer || (this.flashEffectRenderer = new HanulseFlashEffectRenderer());
			case "link": return this.linkEffectRenderer || (this.LinkEffectRenderer = new HanulseLinkEffectRenderer());
			case "prism": return this.prismEffectRenderer || (this.prismEffectRenderer = new HanulsePrismEffectRenderer());
			case "warp": return this.warpEffectRenderer || (this.WarpEffectRenderer = new HanulseWarpEffectRenderer());
			case "bigwarp": return this.warpEffectRenderer || (this.WarpEffectRenderer = new HanulseWarpEffectRenderer());
		}
		return null;
	}
}