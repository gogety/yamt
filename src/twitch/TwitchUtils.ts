export async function isChannelLive(channel: string): Promise<boolean> {
	try {
		// debugger
		const url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-1x1.jpg`;
		const response = await fetch(url, { redirect: 'manual' });
		if (response.status === 200) {
			return true; // Channel is live
		} else if (response.status === 404) {
			return false; // Channel is offline
		} else {
			throw new Error('Unexpected status code: ' + response.status);
		}
	} catch (error) {
		return false; // Error occurred, assume channel is offline
	}
}

export async function getChannelStatus(channel: string): Promise<channelStatus>{
	return await isChannelLive(channel) ? channelStatus.online : channelStatus.offline;
}

export enum channelStatus{
	offline = "offline",
	online = "online"
}

export enum EmbedMode{
	preview = "preview",
	focus = "focus",
	tile = "tile"
}

export interface Channel {
	name: string;
	status: channelStatus;
	isHidden: boolean;
	preview?: boolean;
}