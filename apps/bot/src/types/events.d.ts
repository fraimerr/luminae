import type { ClientEvents as DJSEvents } from 'discord.js';

export interface ClientEvents {
	Debug: (...args: DJSEvents['debug']) => unknown;
	Error: (...args: DJSEvents['error']) => unknown;
	GuildCreate: (...args: DJSEvents['guildCreate']) => unknown;
	GuildDelete: (...args: DJSEvents['guildDelete']) => unknown;
	Ready: (...args: DJSEvents['ready']) => unknown;
}

export interface GuildEvents {
	ChannelCreate: (...args: DJSEvents['channelCreate']) => unknown;
	ChannelDelete: (...args: DJSEvents['channelDelete']) => unknown;
	ChannelUpdate: (...args: DJSEvents['channelUpdate']) => unknown;
	EmojiCreate: (...args: DJSEvents['emojiCreate']) => unknown;
	EmojiDelete: (...args: DJSEvents['emojiDelete']) => unknown;
	GuildBanAdd: (...args: DJSEvents['guildBanAdd']) => unknown;
	GuildBanRemove: (...args: DJSEvents['guildBanRemove']) => unknown;
	GuildMemberAdd: (...args: DJSEvents['guildMemberAdd']) => unknown;
	GuildMemberRemove: (...args: DJSEvents['guildMemberRemove']) => unknown;
	GuildMemberUpdate: (...args: DJSEvents['guildMemberUpdate']) => unknown;
	GuildUpdate: (...args: DJSEvents['guildUpdate']) => unknown;
	InteractionCreate: (...args: DJSEvents['interactionCreate']) => unknown;
	MessageCreate: (...args: DJSEvents['messageCreate']) => unknown;
	MessageDelete: (...args: DJSEvents['messageDelete']) => unknown;
	MessageDeleteBulk: (...args: DJSEvents['messageDeleteBulk']) => unknown;
	MessageReactionAdd: (...args: DJSEvents['messageReactionAdd']) => unknown;
	MessageReactionRemove: (...args: DJSEvents['messageReactionRemove']) => unknown;
	MessageUpdate: (...args: DJSEvents['messageUpdate']) => unknown;
	RoleCreate: (...args: DJSEvents['roleCreate']) => unknown;
	RoleDelete: (...args: DJSEvents['roleDelete']) => unknown;
	RoleUpdate: (...args: DJSEvents['roleUpdate']) => unknown;
	StickerCreate: (...args: DJSEvents['stickerCreate']) => unknown;
	StickerDelete: (...args: DJSEvents['stickerDelete']) => unknown;
	ThreadCreate: (...args: DJSEvents['threadCreate']) => unknown;
	ThreadDelete: (...args: DJSEvents['threadDelete']) => unknown;
	ThreadUpdate: (...args: DJSEvents['threadUpdate']) => unknown;
	VoiceStateUpdate: (...args: DJSEvents['voiceStateUpdate']) => unknown;
}
