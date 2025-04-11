import {
	isJSONEncodable,
	type AutocompleteInteraction,
	type Awaitable,
	type ChatInputApplicationCommandData,
	type ChatInputCommandInteraction,
	type Client,
	type JSONEncodable,
	type Message,
	type RESTPostAPIApplicationCommandsJSONBody,
	type Snowflake,
} from 'discord.js';

import type { CommandOptions, CommonCommand } from '~/types/command';

export abstract class Command {
	public readonly id?: Snowflake;

	public readonly name: string;

	public readonly description: string;

	public readonly premiumOnly: boolean;

	public readonly voterOnly: boolean;

	public readonly data: RESTPostAPIApplicationCommandsJSONBody;

	public ownerOnly: boolean;

	public category?: string;

	public readonly usage?: string;

	public readonly examples?: string;

	public readonly allowDM: boolean;

	public readonly cooldown: number;

	public readonly private: boolean;

	public readonly longDescription?: string;

	public readonly userPermissions: bigint[] | string;

	public readonly botPermissions: bigint[];

	public readonly botChannelPermissions: bigint[];

	public readonly userChannelPermissions: bigint[];

	public readonly modrole?: boolean;

	public readonly aliases: string[];

	public readonly availability: Command.Availability;

	public readonly adminOnly: boolean;

	public readonly args: string[];

	public subCommandsHelp?: (CommonCommand & {
		description: string;
	})[];

	public constructor(builder: Command.Data, options: CommandOptions = {}) {
		const data = isJSONEncodable(builder) ? builder.toJSON() : builder;
		this.id = options.id;
		this.name = data.name;
		this.description = (data as ChatInputApplicationCommandData).description;
		this.data = data;
		this.premiumOnly = Boolean(options.premiumOnly);
		this.voterOnly = Boolean(options.voterOnly);
		this.ownerOnly = Boolean(options.ownerOnly);
		this.usage = options.usage;
		this.examples = options.examples;
		this.allowDM = Boolean(options.allowDM);
		this.cooldown = options.cooldown ?? 2;
		this.private = Boolean(options.private);
		this.longDescription = options.longDescription;
		this.userPermissions = options.userPermissions ?? data.default_member_permissions ?? [];
		this.botPermissions = options.botPermissions ?? [];
		this.botChannelPermissions = options.botChannelPermissions ?? [];
		this.userChannelPermissions = options.userChannelPermissions ?? [];
		this.modrole = options.modrole;
		this.aliases = options.aliases ?? [];
		this.availability = options.availability ?? Command.Availability.Both;
		this.adminOnly = options.adminOnly ?? false;
		this.args = options.args ?? [];
		this.subCommandsHelp = options.subCommandsHelp;
	}

	public autocompleteRun(
		_interaction: AutocompleteInteraction,
		_options: Command.AutocompleteOptions,
		_client: Client<true>
	): Awaitable<unknown> {
		throw new Error(`Autocomplete task isn't implemented in ${this.name}.`);
	}

	public async interactionRun(
		interaction: ChatInputCommandInteraction,
		options: Command.ChatInputOptions,
		client: Client<true>
	) {
		await this.runTask(interaction as unknown as ChatInputCommandInteraction<'cached'>, options, client);
	}

	public async messageRun(
		message: Message<true>,
		args: string[],
		client: Client<true>,
		prefixUsed: string
	): Promise<unknown> {
		const options = await this.transformArgs(message, args);
		if (typeof options === 'string') return message.reply(options);
		return this.runTask(message, options, client, prefixUsed);
	}

	protected transformArgs(_message: Message<true>, args: string[]): Awaitable<Command.ChatInputOptions | string> {
		const options: Partial<Command.ChatInputOptions> = {
			getString: () => args.join(' '),
		};
		return options as Command.ChatInputOptions;
	}

	protected abstract runTask(
		messageOrInteraction: ChatInputCommandInteraction<'cached'> | Message<true>,
		options: Command.ChatInputOptions,
		client: Client<true>,
		prefixUsed?: string
	): Awaitable<unknown>;
}

export type UserCommandType = new () => Command;

export namespace Command {
	export type ChatInputOptions<T extends 'cached' | 'raw' = 'cached'> = ChatInputCommandInteraction<T>['options'];
	export type AutocompleteOptions<T extends 'cached' | 'raw' = 'cached'> = AutocompleteInteraction<T>['options'];
	export type Data = JSONEncodable<RESTPostAPIApplicationCommandsJSONBody> | RESTPostAPIApplicationCommandsJSONBody;
	export enum Availability {
		Both = 'Both Slash and Message Command',
		Slash = 'Slash Command Only',
	}
}

export function ApplyCommandOption(builder: Command.Data, options?: CommandOptions) {
	return (DecoratedClass: typeof Command, _context: ClassDecoratorContext) => {
		// @ts-expect-error - `runTask` will be implemented in command
		return class Ctor extends DecoratedClass {
			public constructor() {
				super(builder, options);
			}
		} as any;
	};
}
