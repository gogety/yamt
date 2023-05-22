declare namespace Grid {
	interface PlayerOptions {
		channel: string;
		width: string | number;
		height: string | number;
		autoplay?: boolean;
		muted?: boolean;
		parent: string | string[];
		playsinline?: boolean;
		layout: string;
	}

	class GridStack {
    init();
    load([]);
	}
}
