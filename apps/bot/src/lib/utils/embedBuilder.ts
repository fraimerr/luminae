import { Time } from '@imranbarbhuiya/duration';
import {
	ActionRowBuilder,
	BaseInteraction,
	ButtonBuilder,
	ButtonStyle,
	type AttachmentBuilder,
	type ChatInputCommandInteraction,
	type ColorResolvable,
	type ContextMenuCommandInteraction,
	type Message,
	type MessageActionRowComponentBuilder,
	type MessageCollector,
	type MessageComponentInteraction,
	type ModalSubmitInteraction,
} from 'discord.js';

import type { EmbedBuilder, JsonEmbed } from '~/util/customEmbed';

import { validateLink } from '~/util/link';
import { authorOrUser, resolveImageURL, validateColor } from '~/util/utils';

type PartialJsonEmbed = Partial<JsonEmbed>;
interface EmbedsObject {
	embeds: PartialJsonEmbed[];
}

const getEmbedJson = (json: EmbedsObject | PartialJsonEmbed | { embed: PartialJsonEmbed }): PartialJsonEmbed => {
	if ('embeds' in json) {
		return json.embeds[0];
	}

	if ('embed' in json) {
		return json.embed;
	}

	return json;
};

export class EmbedGenerator {
	public collector?: ReturnType<Message<true>['createMessageComponentCollector']>;

	public msgCollector?: MessageCollector;

	public files: AttachmentBuilder[];

	public givenUrls: { image?: string; thumbnail?: string } = {
		image: undefined,
		thumbnail: undefined,
	};

	private readonly embed: EmbedBuilder;

	private readonly interaction:
		| ChatInputCommandInteraction<'cached'>
		| ContextMenuCommandInteraction<'cached'>
		| Message<true>
		| MessageComponentInteraction<'cached'>
		| ModalSubmitInteraction<'cached'>;

	private readonly saveButton: ButtonBuilder;

	public constructor(
		embed: EmbedBuilder,
		interaction:
			| ChatInputCommandInteraction<'cached'>
			| ContextMenuCommandInteraction<'cached'>
			| Message<true>
			| MessageComponentInteraction<'cached'>
			| ModalSubmitInteraction<'cached'>,
		saveButton: ButtonBuilder,
		{ files = [] }: { files?: AttachmentBuilder[] } = {}
	) {
		this.embed = embed;
		this.interaction = interaction;
		this.saveButton = saveButton;
		this.files = files;
	}

	public async init() {
		const { components } = this;
		let message: Message<true>;
		const { interaction } = this;
		const messagePayload = {
			embeds: [this.embed],
			components,
			files: this.files,
		};
		if (interaction instanceof BaseInteraction && interaction.replied) {
			message = await interaction.editReply(messagePayload);
		} else {
			message = await (interaction as ChatInputCommandInteraction<'cached'>).reply({
				...messagePayload,
				fetchReply: true,
			});
		}

		const collector = message.createMessageComponentCollector({
			filter: (i) => i.user.id === authorOrUser(interaction).id && i.customId.startsWith('eb-'),
			idle: 15 * Time.Minute,
		});
		this.collector = collector;
		let running = false;
		collector.on('collect', async (i) => {
			if (running) {
				await i.reply({
					content: 'Please complete the previous input before proceeding.',
					ephemeral: true,
				});
				return;
			}

			running = true;
			if (i.customId.startsWith('eb-embed-')) {
				const action = i.customId.split('-')[2];
				if (action === 'image' || action === 'thumbnail') {
					await i.reply({
						content: 'Please provide the image link or attach the file to proceed.',
						ephemeral: true,
					});
				} else {
					await i.reply({
						content: `Enter ${action} in the chat within next 10 minutes.`,
						ephemeral: true,
					});
				}

				const msgCollector = interaction.channel!.createMessageCollector({
					filter: (m) => m.author.id === i.user.id,
					idle: 10 * Time.Minute,
				});
				this.msgCollector = msgCollector;
				msgCollector
					.on('collect', async (msg) => {
						if (collector.ended) {
							msgCollector.stop();
							return;
						}

						if (msg.deletable && !message.attachments.size) msg.delete().catch(() => null);
						if (action === 'title') {
							this.embed.setTitle(msg.content, i);
						} else if (action === 'description') {
							this.embed.setDescription(msg.content, i);
						} else if (action === 'color') {
							const color = validateColor(msg.content.trim().toUpperCase() as ColorResolvable);
							if (color) {
								this.embed.setColor(color);
							} else {
								await i.followUp({
									content: 'The color is invalid. Please enter a valid color.',
									ephemeral: true,
								});
								return;
							}
						} else if (action === 'image' || action === 'thumbnail') {
							let link = validateLink(msg.content) || /^{[\w.]+}$/.test(msg.content) ? msg.content : null;
							if (!link && msg.attachments.size) {
								link = msg.attachments.first()?.proxyURL ?? msg.attachments.first()?.url ?? null;
							}

							if (!link) {
								await i.followUp({
									content: 'Image link is invalid. Please enter a valid link.',
									ephemeral: true,
								});
								return;
							}

							if (!link.startsWith('http')) {
								this.givenUrls[action] = link;
								link = null;
							}

							if (action === 'image') {
								this.embed.setImage(link);
							} else {
								this.embed.setThumbnail(link);
							}
						}

						if (!message.editable) {
							const notEditableMsg =
								"Original message is deleted or I don't have permission to send messages in this channel.";
							if (interaction instanceof BaseInteraction)
								await interaction.followUp({
									content: notEditableMsg,
									ephemeral: true,
								});
							else
								await interaction.reply({
									content: notEditableMsg,
								});

							running = false;
							msgCollector.stop();
							collector.stop();
							return;
						}

						message
							.edit({
								embeds: [this.embed],
								components,
							})
							.catch(() => null);
						msgCollector.stop();
						running = false;
					})
					.on('end', async (_collected, reason) => {
						if (reason === 'idle') {
							await i.followUp({
								content:
									"Sorry to interrupt, but it appears you haven't entered anything in the last 10 minutes. Please try again.",
								ephemeral: true,
							});
						}

						running = false;
					});
			} else if (i.customId === 'eb-json-embed') {
				await i.reply({
					content:
						'**Enter JSON in the chat**' +
						'\nYou can send it as content, attachment or save the JSON in [The Files Lab](<https://thefileslab.com/share/raw-text>),' +
						' or any other site which provides raw JSON data link' +
						' and enter the raw JSON data link here.' +
						'\n\n[ Visit [R.O.T.I Docs](https://docs.letsroti.com/basic-configuration/embeds#json-for-fine-tuning) to know more ]',
					ephemeral: true,
				});
				const msgCollector = interaction.channel!.createMessageCollector({
					filter: (m) => m.author.id === i.user.id,
					max: 1,
					time: 10 * Time.Minute,
				});
				this.msgCollector = msgCollector;
				msgCollector
					.on('collect', async (msg) => {
						if (collector.ended) {
							msgCollector.stop();
							return;
						}

						running = false;
						if (msg.deletable) msg.delete().catch(() => null);
						let json: EmbedsObject | PartialJsonEmbed | null;
						if (validateLink(msg.content)) {
							json = await fetch(msg.content)
								.then(async (res) => res.json() as Promise<EmbedsObject | PartialJsonEmbed>)
								.catch(() => null);
							if (!json) {
								await i.followUp({
									content: 'It appears that the JSON data cannot be found at the provided link.',
									ephemeral: true,
								});
								return;
							}
						} else if (msg.attachments.size) {
							json = await fetch(msg.attachments.first()!.url)
								.then(async (res) => res.json() as Promise<EmbedsObject | PartialJsonEmbed>)
								.catch(() => null);
							if (!json) {
								await i.followUp({
									content: 'It appears that the JSON data is not present in the provided attachment.',
									ephemeral: true,
								});
								return;
							}
						} else {
							try {
								json = JSON.parse(msg.content) as EmbedsObject | PartialJsonEmbed | null;
							} catch {
								await i.followUp({ content: 'The JSON provided appears to be invalid. Could you please double-check the format or provide a corrected version?', ephemeral: true }).catch(() => null);
								return;
							}
						}

						if (typeof json !== 'object' || json === null) {
							await i.followUp({ content: 'The JSON provided appears to be invalid. Could you please double-check the format or provide a corrected version?', ephemeral: true }).catch(() => null);
							return;
						}

						const embedJson = getEmbedJson(json);
						if (typeof embedJson.image === 'string' && !embedJson.image.startsWith('http')) {
							this.givenUrls.image = embedJson.image;
						}

						if (typeof embedJson.thumbnail === 'string' && !embedJson.thumbnail.startsWith('http')) {
							this.givenUrls.thumbnail = embedJson.thumbnail;
						}

						this.embed.setJSON(embedJson, i);
						if (!message.editable) {
							collector.stop();
							return;
						}

						await message
							.edit({
								embeds: [this.embed],
								components,
							})
							.catch(() => null);
					})
					.on('end', async (_collected, reason) => {
						if (reason === 'idle') {
							await i.reply({
								content:
									"Sorry to interrupt, but it appears you haven't entered anything in the last 10 minutes. Please try again.",
								ephemeral: true,
							});
						}

						running = false;
					});
			} else if (i.channelId === 'eb-json-model-embed') {
				await i.deferUpdate();
			}
		});

		return message;
	}

	private get components() {
		const titleButton = new ButtonBuilder()
			.setCustomId('eb-embed-title')
			.setLabel('Title')
			.setStyle(ButtonStyle.Primary);
		const descriptionButton = new ButtonBuilder()
			.setCustomId('eb-embed-description')
			.setLabel('Description')
			.setStyle(ButtonStyle.Primary);
		const colorButton = new ButtonBuilder()
			.setCustomId('eb-embed-color')
			.setLabel('Color')
			.setStyle(ButtonStyle.Primary);
		const imageButton = new ButtonBuilder()
			.setCustomId('eb-embed-image')
			.setLabel('Image')
			.setStyle(ButtonStyle.Secondary);
		const thumbnailButton = new ButtonBuilder()
			.setCustomId('eb-embed-thumbnail')
			.setLabel('Thumbnail')
			.setStyle(ButtonStyle.Secondary);

		const jsonButton = new ButtonBuilder().setCustomId('eb-json-embed').setLabel('JSON').setStyle(ButtonStyle.Success);

		// const jsonInModel = new ButtonBuilder()
		//   .setCustomId("eb-json-model-embed")
		//   .setLabel("Json Model")
		//   .setStyle("PRIMARY")
		//   .setDisabled();

		const exitButton = new ButtonBuilder()
			.setLabel('Exit')
			.setStyle(ButtonStyle.Danger)
			.setCustomId(`exit-${this.interaction.member?.id}`);

		const Row1 = new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
			titleButton,
			descriptionButton,
			colorButton
		);
		const Row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
			imageButton,
			thumbnailButton,
			jsonButton
		);
		const Row3 = new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
			// jsonInModel,
			this.saveButton,
			exitButton
		);
		return [Row1, Row2, Row3];
	}

	public stop(reason?: string) {
		this.collector?.stop(reason);
		this.msgCollector?.stop(reason);
	}

	public async images() {
		const image = this.embed.data.image?.proxy_url ?? this.embed.data.image?.url;
		const imageBuffer = image ? await resolveImageURL(image) : undefined;
		const thumbnail = this.embed.data.thumbnail?.proxy_url ?? this.embed.data.thumbnail?.url;
		const thumbnailBuffer = thumbnail ? await resolveImageURL(thumbnail) : undefined;

		return { image: imageBuffer, thumbnail: thumbnailBuffer };
	}
}
