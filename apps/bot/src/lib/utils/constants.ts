import { PermissionFlagsBits } from "discord.js";

export const Constants = {
	// colors
	primaryColor: 0x59459d,
	// server invite link
	supportInviteLink: "https://discord.gg/",

	// emoji setup
	emojis: {
		clock: "<:clock:1350862211354067037>",
		gift: "<:gift:1350861950241869855>",
		person: "<:person:1350862618524520610>",
		confetti: "<a:confetti:1356320144770601090>",
		booster: ""
	},

	owners: ["225176015016558593"] as string[],
	ownerGuild: "1349494215834603531",
	bugRole: "",
	errorRole: "",
	emojiRegex: /<(a)?:([\w]{2,32}):(\d{17,19})>/g,
	imageRegex: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i,
	removeExcRegex: /(?<=^|<@)!(?=\d{17,19}>|$)/g,
} as const;

export const keyPermissions = [
	PermissionFlagsBits.Administrator,
	PermissionFlagsBits.ManageGuild,
	PermissionFlagsBits.ManageRoles,
	PermissionFlagsBits.ManageChannels,
	PermissionFlagsBits.ManageThreads,
	PermissionFlagsBits.ModerateMembers,
	PermissionFlagsBits.ManageMessages,
	PermissionFlagsBits.ManageWebhooks,
	PermissionFlagsBits.ManageNicknames,
	PermissionFlagsBits.ManageGuildExpressions,
	PermissionFlagsBits.KickMembers,
	PermissionFlagsBits.BanMembers,
	PermissionFlagsBits.ViewAuditLog,
	PermissionFlagsBits.MentionEveryone,
];
