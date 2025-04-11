/* eslint-disable @typescript-eslint/no-floating-promises */
// TODO: make the builder promise based.
import {
	EmbedBuilder as BuilderEmbed,
	embedLength,
	isJSONEncodable,
	type APIEmbed,
	type EmbedData,
	type EmbedFooterOptions,
	type JSONEncodable,
	type MessageComponentInteraction,
} from 'discord.js';

import { validateColor } from './utils.js';

import type { Nullable } from '~/types/utility-types';
import type { BaseError, CombinedError } from '@sapphire/shapeshift';

export type JsonEmbed = Omit<APIEmbed & EmbedData, 'image' | 'thumbnail' | 'timestamp'> & {
	footer?: EmbedFooterOptions;
	image?: string | { proxy_url: string; url: string } | null;
	thumbnail?: string | { proxy_url: string; url: string } | null;
	timestamp?: Date | number | null;
};

const getErrorMessage = (error: unknown) => {
	const e = error as BaseError | CombinedError;
	return 'errors' in e ? e.errors[0]?.message : e.message;
};

export class EmbedBuilder extends BuilderEmbed {
	public get sendable() {
		return Boolean(embedLength(this.data) || (this.data.image ?? this.data.thumbnail));
	}

	public override setTitle(title: string | null, interaction?: MessageComponentInteraction): this {
		try {
			return super.setTitle(title);
		} catch (error) {
			if (interaction) {
				interaction.followUp({
					content: `An error occurred while setting title.\n${getErrorMessage(error)}`,
					ephemeral: true,
				});
			}

			return this;
		}
	}

	public override setDescription(description: string | null, interaction?: MessageComponentInteraction): this {
		try {
			return super.setDescription(description);
		} catch (error) {
			if (interaction) {
				interaction.followUp({
					content: `An error occurred while setting description.\n${getErrorMessage(error)}`,
					ephemeral: true,
				});
			}

			return this;
		}
	}

	public override setThumbnail(url: string | null): this {
		this.data.thumbnail = url ? { url } : undefined;
		return this;
	}

	public override setImage(url: string | null): this {
		this.data.image = url ? { url } : undefined;
		return this;
	}

	public setJSON(json: Nullable<Partial<JsonEmbed>>, interaction?: MessageComponentInteraction) {
		if (json.title !== undefined) {
			this.setTitle(json.title, interaction);
		}

		if (json.description !== undefined) {
			this.setDescription(json.description, interaction);
		}

		if (json.color !== undefined) {
			if (json.color === null) this.setColor(null);
			else {
				const color = validateColor(json.color);
				if (color) {
					this.setColor(color);
				} else if (interaction) {
					interaction.followUp({
						content: 'The color is invalid. Please enter a valid color.',
						ephemeral: true,
					});
				}
			}
		}

		if (typeof json.thumbnail === 'string') {
			this.setThumbnail(json.thumbnail);
		} else if (typeof json.thumbnail === 'object') {
			this.setThumbnail(json.thumbnail === null ? null : json.thumbnail.url);
		}

		if (typeof json.image === 'string') {
			this.setImage(json.image);
		} else if (typeof json.image === 'object') {
			this.setImage(json.image === null ? null : json.image.url);
		}

		if (json.author === null) this.setAuthor(null);
		else if (json.author?.name) {
			try {
				this.setAuthor({
					name: json.author.name,
					iconURL: json.author.icon_url ?? json.author.iconURL,
					url: json.author.url,
				});
			} catch (error) {
				if (interaction) {
					interaction.followUp({
						content: `An error occurred while setting author.\n${getErrorMessage(error)}`,
						ephemeral: true,
					});
				}
			}
		}

		if (json.fields) {
			if (Array.isArray(json.fields)) {
				try {
					this.data.fields = [];
					this.addFields(json.fields);
				} catch (error) {
					if (interaction) {
						interaction.followUp({
							content: `An error occurred while setting fields.\n${getErrorMessage(error)}`,
							ephemeral: true,
						});
					}
				}
			} else if (interaction) {
				interaction.followUp({
					content: 'Fields must be an array of objects.',
					ephemeral: true,
				});
			}
		}

		if (json.timestamp === 0) {
			this.setTimestamp();
		} else if (json.timestamp !== undefined) {
			try {
				this.setTimestamp(json.timestamp);
			} catch (error) {
				if (interaction) {
					interaction.followUp({
						content: `An error occurred while setting timestamp.\n${getErrorMessage(error)}`,
						ephemeral: true,
					});
				}
			}
		}

		if (json.footer === null) this.setFooter(null);
		else if (typeof json.footer === 'string') {
			try {
				this.setFooter({ text: json.footer });
			} catch (error) {
				if (interaction) {
					interaction.followUp({
						content: `An error occurred while setting footer.\n${getErrorMessage(error)}`,
						ephemeral: true,
					});
				}
			}
		} else if (json.footer?.text) {
			try {
				this.setFooter({
					text: json.footer.text,
					iconURL: json.footer.iconURL ?? json.footer.icon_url,
				});
			} catch (error) {
				if (interaction) {
					interaction.followUp({
						content: `An error occurred while setting footer.\n${getErrorMessage(error)}`,
						ephemeral: true,
					});
				}
			}
		}

		return this;
	}

	public static override from(other: APIEmbed | JSONEncodable<APIEmbed>): EmbedBuilder {
		if (isJSONEncodable(other)) {
			return new this(other.toJSON());
		}

		return new this(other);
	}
}
