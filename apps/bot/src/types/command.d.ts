import type { Command } from '~/structure/Command';
import type {
	ApplicationCommandType,
	Awaitable,
	ChatInputCommandInteraction,
	Client,
	MessageContextMenuCommandInteraction,
	PermissionResolvable,
	Snowflake,
	UserContextMenuCommandInteraction,
} from 'discord.js';

export interface ContextMenuMessageCommand extends CommonCommand {
	runTask(
		interaction: MessageContextMenuCommandInteraction<'cached'>,
		options: MessageContextMenuCommandInteraction['options'],
		client: Client<true>
	): Awaitable<unknown>;
	type: ApplicationCommandType.Message;
}

export interface ContextMenuUserCommand extends CommonCommand {
	runTask(
		interaction: UserContextMenuCommandInteraction<'cached'>,
		options: UserContextMenuCommandInteraction['options'],
		client: Client<true>
	): Awaitable<unknown>;
	type: ApplicationCommandType.User;
}

export interface CommonCommand {
	adminOnly?: boolean;
	aliases?: string[];
	allowDM?: boolean;
	availability?: Command.Availability;
	botChannelPermissions?: PermissionResolvable[];
	botPermissions?: PermissionResolvable[];
	category?: string;
	cooldown?: number;
	examples?: string;
	longDescription?: string;
	modrole?: boolean;
	name: string;
	ownerOnly?: boolean;
	private?: boolean;
	type?: ApplicationCommandType;
	usage?: string;
	userChannelPermissions?: PermissionResolvable[];
	userPermissions?: bigint[] | string;
}

export interface CommandOptions {
	adminOnly?: boolean;
	aliases?: string[];
	allowDM?: boolean;
	args?: string[];
	availability?: Command.Availability;
	botChannelPermissions?: bigint[];
	botPermissions?: bigint[];
	cooldown?: number;
	examples?: string;
	id?: Snowflake;
	longDescription?: string;
	modrole?: boolean;
	ownerOnly?: boolean;
	premiumOnly?: boolean;
	private?: boolean;
	subCommandsHelp?: {
		botPermissions?: bigint[];
		description: string;
		examples?: string;
		name: string;
		usage?: string;
		userPermissions?: bigint[];
	}[];
	usage?: string;
	userChannelPermissions?: bigint[];
	userPermissions?: bigint[] | string;
	voterOnly?: boolean;
}
