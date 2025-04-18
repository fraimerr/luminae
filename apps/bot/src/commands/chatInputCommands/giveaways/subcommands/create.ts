import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	MessageFlags,
	RoleSelectMenuBuilder,
	SelectMenuComponentOptionData,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	TextChannel,
} from "discord.js";
import { Constants } from "~/util/constants";
import { Command } from "~/structure/Command";
import { GiveawayManager } from "~/manager/GiveawayManager";
import ms, { type StringValue } from "ms";

export default async function giveawayCreate(
	interaction: ChatInputCommandInteraction<"cached">,
	options: Command.ChatInputOptions
) {
	const channel = (options.getChannel("channel") ||
		interaction.channel) as TextChannel;
	const title = options.getString("title", true);
	const duration = ms(options.getString("duration", true) as StringValue);
	const description = options.getString("description");
	const winners = options.getInteger("winners") || 1;

	if (!channel.isSendable()) {
		return interaction.reply({
			content: "I am unable to send messages to that channel",
			flags: MessageFlags.Ephemeral,
		});
	}

	if (duration === undefined) {
		return interaction.reply({
			content:
				"The duration provided is invalid. The correct format is `1d 2h 3m 4s`",
			flags: MessageFlags.Ephemeral,
		});
	}

	if (duration < ms("10s")) {
		return interaction.reply({
			content:
				"The duration provided is too short. The minimum duration is 1 minute",
			flags: MessageFlags.Ephemeral,
		});
	}

	const requirements: { type: string; value?: string }[] = [];
	const multipliers: { type: string; value?: string , entries: number}[] = [];

	function getUpdatedEmbed(): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle("Create a new giveaway")
			.setColor(Constants.primaryColor)
			.setDescription(
				`**Name:** ${title}\n**Description:** ${description || "None"}\n**Duration:** ${ms(
					duration,
					{ long: true }
				)}\n**Winners:** ${winners}`
			)
			.addFields(
				{
					name: "Requirements",
					value:
						requirements.length === 0
							? "-# None"
							: requirements
									.map((r) => {
										if (r.type === "role") {
											return `- Must have the <@&${r.value}> role`;
										} else if (r.type === "not_role") {
											return `- Must not have the <@&${r.value}> role`;
										} else if (r.type === "message") {
											return `- Must have **${r.value} messages**`;
										} else if (r.type === "level") {
											return `- Must have **${r.value} level**`;
										} else if (r.type === "streak") {
											return `- Must have **${r.value} streaks**`;
										} else if (r.type === "booster") {
											return `- Must be a **Booster**`;
										} else if (r.type === "account_age") {
											return `- Must have **${r.value} days**`;
										}
										return "";
									})
									.join("\n"),
				},
				{
					name: "Multipliers",
					value:
						multipliers.length === 0
							? "-# None"
							: multipliers
									.map((m) => {
										if (m.type === "role") {
											return `- Users with <@&${m.value}> get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
										} else if (m.type === "not_role") {
											return `- Users without <@&${m.value}> get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
										} else if (m.type === "message") {
											return `- Users with **${m.value} messages** get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
										} else if (m.type === "level") {
											return `- Users with **${m.value} level** get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
										} else if (m.type === "streak") {
											return `- Users with **${m.value} streaks** get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
										} else if (m.type === "booster") {
											return `- Boosters get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
										} else if (m.type === "account_age") {
											return `- Users with **${m.value} days** get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
										}
										return "";
									})
									.join("\n"),
				}
			);
	}

	const initialEmbed = getUpdatedEmbed();

	const buttons1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("add-requirements")
			.setLabel("Add Req.")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("add-multipliers")
			.setLabel("Add Mult.")
			.setStyle(ButtonStyle.Secondary)
	);
	const buttons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId(`exit-${interaction.user.id}`)
			.setLabel("Cancel")
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId("start-giveaway")
			.setLabel("Start")
			.setStyle(ButtonStyle.Success)
	);

	const initialReply = await interaction.reply({
		embeds: [initialEmbed],
		components: [buttons1, buttons2],
	});

	const collector = initialReply.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: 1000 * 60 * 5,
		filter: (i) => i.user.id === interaction.user.id,
	});

	collector.on("collect", async (initialInt) => {
		if (initialInt.customId === "add-requirements") {
			const requirementTypes: SelectMenuComponentOptionData[] = [
				{
					label: "Have Role",
					description: "The user must have this role",
					value: "have_role",
				},
				{
					label: "Messages",
					description: "The user must have this amount of messages",
					value: "required_messages",
				},
				{
					label: "Not Have Role",
					description: "The user must not have this role",
					value: "not_have_role",
				},
				{
					label: "level",
					description: "The user must have this level",
					value: "level",
				},
				{
					label: "streak",
					description: "The user must streak for this amount",
					value: "streak",
				},
				{
					label: "booster",
					description: "The user must be a booster",
					value: "booster",
				},
				{
					label: "account_age",
					description: "The user must be older than this (in days)",
					value: "account_age",
				},
			];

			const requirementEmbed = new EmbedBuilder()
				.setTitle("Add a Requirement")
				.setColor(Constants.primaryColor)
				.setDescription("Select a requirement type to add to the giveaway");

			const requirementRow =
				new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("requirement-select")
						.setPlaceholder("Select a Requirement Type")
						.addOptions(
							requirementTypes.map((option) =>
								new StringSelectMenuOptionBuilder()
									.setLabel(option.label)
									.setDescription(option.description! || "")
									.setValue(option.value)
							)
						)
				);

			const backButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId("back")
					.setLabel("Back")
					.setStyle(ButtonStyle.Secondary)
			);

			const response = await initialInt.update({
				embeds: [requirementEmbed],
				components: [requirementRow, backButton],
			});

			const collector = response.createMessageComponentCollector({
				time: 1000 * 60 * 5,
				filter: (i) => i.user.id === interaction.user.id,
			});

			collector.on("collect", async (i) => {
				if (i.componentType === ComponentType.StringSelect) {
					if (i.customId === "requirement-select") {
						const requirementType = i.values[0];

						if (requirementType === "have_role") {
							const roleSelect =
								new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
									new RoleSelectMenuBuilder()
										.setCustomId("required-role-select")
										.setPlaceholder("Select a role")
										.setMinValues(1)
										.setMaxValues(1)
								);

							const roleReply = await i.update({
								content: "Select a role",
								components: [roleSelect, backButton],
							});

							const roleCollector = roleReply.createMessageComponentCollector({
								time: 1000 * 60 * 5,
								componentType: ComponentType.RoleSelect,
								filter: (i) =>
									i.customId === "required-role-select" &&
									i.user.id === interaction.user.id,
							});

							roleCollector.on("collect", async (ri) => {
								requirements.push({
									type: "role",
									value: ri.values[0],
								});

								await ri.update({
									content: null,
									embeds: [getUpdatedEmbed()],
									components: [buttons1, buttons2],
								});
							});
						} else if (requirementType === "required_messages") {
							const requiredMessagesEmbed = new EmbedBuilder()
								.setTitle("Add a Requirement")
								.setColor(Constants.primaryColor)
								.setDescription(
									`How many messages should members need?\n\n- Enter a number <t:${Math.floor(
										Date.now() / 1000 + 30
									)}:R>`
								);

							await i.update({
								embeds: [requiredMessagesEmbed],
								components: [backButton],
							});

							const requiredMessagesCollector =
								i.channel?.createMessageCollector({
									time: 30_000,
									filter: (msg) => msg.author.id === interaction.user.id,
									max: 1,
								});

							requiredMessagesCollector?.on("collect", async (msg) => {
								if (isNaN(parseInt(msg.content))) {
									await msg.reply({
										content: "Please enter a valid number",
									});
									return;
								}

								requirements.push({
									type: "message",
									value: msg.content,
								});

								await msg.delete().catch(() => {});

								await i.editReply({
									content: null,
									embeds: [getUpdatedEmbed()],
									components: [buttons1, buttons2],
								});
							});

							requiredMessagesCollector?.on("end", async (collected) => {
								if (collected.size === 0) {
									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								}
							});
						} else if (requirementType === "not_have_role") {
							const roleSelect =
								new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
									new RoleSelectMenuBuilder()
										.setCustomId("required-not-role-select")
										.setPlaceholder("Select a role")
										.setMinValues(1)
										.setMaxValues(1)
								);

							const roleReply = await i.update({
								content: "Select a role that users must NOT have",
								components: [roleSelect, backButton],
							});

							const roleCollector = roleReply.createMessageComponentCollector({
								time: 1000 * 60 * 5,
								componentType: ComponentType.RoleSelect,
								filter: (i) =>
									i.customId === "required-not-role-select" &&
									i.user.id === interaction.user.id,
							});

							roleCollector.on("collect", async (ri) => {
								requirements.push({
									type: "not_role",
									value: ri.values[0],
								});

								await ri.update({
									content: null,
									embeds: [getUpdatedEmbed()],
									components: [buttons1, buttons2],
								});
							});
						} else if (requirementType === "level") {
							const levelEmbed = new EmbedBuilder()
								.setTitle("Add a Requirement")
								.setColor(Constants.primaryColor)
								.setDescription(
									`What minimum level should members need?\n\n- Enter a number <t:${Math.floor(
										Date.now() / 1000 + 30
									)}:R>`
								);

							await i.update({
								embeds: [levelEmbed],
								components: [backButton],
							});

							const levelCollector = i.channel?.createMessageCollector({
								time: 30_000,
								filter: (msg) => msg.author.id === interaction.user.id,
								max: 1,
							});

							levelCollector?.on("collect", async (msg) => {
								if (
									isNaN(parseInt(msg.content)) ||
									parseInt(msg.content) <= 0
								) {
									await msg.reply({
										content: "Please enter a valid positive number",
									});
									return;
								}

								requirements.push({
									type: "level",
									value: msg.content,
								});

								await msg.delete().catch(() => {});

								await i.editReply({
									content: null,
									embeds: [getUpdatedEmbed()],
									components: [buttons1, buttons2],
								});
							});

							levelCollector?.on("end", async (collected) => {
								if (collected.size === 0) {
									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								}
							});
						} else if (requirementType === "streak") {
							const streakEmbed = new EmbedBuilder()
								.setTitle("Add a Requirement")
								.setColor(Constants.primaryColor)
								.setDescription(
									`What minimum streak should members need?\n\n- Enter a number <t:${Math.floor(
										Date.now() / 1000 + 30
									)}:R>`
								);

							await i.update({
								embeds: [streakEmbed],
								components: [backButton],
							});

							const streakCollector = i.channel?.createMessageCollector({
								time: 30_000,
								filter: (msg) => msg.author.id === interaction.user.id,
								max: 1,
							});

							streakCollector?.on("collect", async (msg) => {
								if (
									isNaN(parseInt(msg.content)) ||
									parseInt(msg.content) <= 0
								) {
									await msg.reply({
										content: "Please enter a valid positive number",
									});
									return;
								}

								requirements.push({
									type: "streak",
									value: msg.content,
								});

								await msg.delete().catch(() => {});

								await i.editReply({
									content: null,
									embeds: [getUpdatedEmbed()],
									components: [buttons1, buttons2],
								});
							});

							streakCollector?.on("end", async (collected) => {
								if (collected.size === 0) {
									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								}
							});
						} else if (requirementType === "booster") {
							requirements.push({
								type: "booster",
							});

							await i.update({
								content: null,
								embeds: [getUpdatedEmbed()],
								components: [buttons1, buttons2],
							});
						} else if (requirementType === "account_age") {
							const accountAgeEmbed = new EmbedBuilder()
								.setTitle("Add a Requirement")
								.setColor(Constants.primaryColor)
								.setDescription(
									`How old (in days) should a user's account be?\n\n- Enter a number <t:${Math.floor(
										Date.now() / 1000 + 30
									)}:R>`
								);

							await i.update({
								embeds: [accountAgeEmbed],
								components: [backButton],
							});

							const accountAgeCollector = i.channel?.createMessageCollector({
								time: 30_000,
								filter: (msg) => msg.author.id === interaction.user.id,
								max: 1,
							});

							accountAgeCollector?.on("collect", async (msg) => {
								if (
									isNaN(parseInt(msg.content)) ||
									parseInt(msg.content) <= 0
								) {
									await msg.reply({
										content: "Please enter a valid positive number",
									});
									return;
								}

								requirements.push({
									type: "account_age",
									value: msg.content,
								});

								await msg.delete().catch(() => {});

								await i.editReply({
									content: null,
									embeds: [getUpdatedEmbed()],
									components: [buttons1, buttons2],
								});
							});

							accountAgeCollector?.on("end", async (collected) => {
								if (collected.size === 0) {
									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								}
							});
						}
					}
				} else if (i.componentType === ComponentType.Button) {
					if (i.customId === "back") {
						await i.update({
							content: null,
							embeds: [getUpdatedEmbed()],
							components: [buttons1, buttons2],
						});
					}
				}
			});
		} else if (initialInt.customId === "add-multipliers") {
			const multiplierTypes: SelectMenuComponentOptionData[] = [
				{
					label: "Role",
					description: "Give extra entries to users with this role",
					value: "role_multiplier",
				},
				{
					label: "Messages",
					description: "Give entries to users based on messages",
					value: "messages_multiplier",
				},
				{
					label: "Level",
					description: "Give entries to users based on level",
					value: "level_multiplier",
				},
				{
					label: "Streak",
					description: "Give entries to users based on streak",
					value: "streak_multiplier",
				},
				{
					label: "Booster",
					description: "Give entries to users based on if they are a booster",
					value: "booster_multiplier",
				},
				{
					label: "Account Age",
					description: "Give entries to users based on account age",
					value: "account_age_multiplier",
				},
			];

			const multiplierEmbed = new EmbedBuilder()
				.setTitle("Add a Multiplier")
				.setColor(Constants.primaryColor)
				.setDescription("Select a multiplier type to add to the giveaway");

			const multiplierRow =
				new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("multiplier-select")
						.setPlaceholder("Select a Multiplier Type")
						.addOptions(
							multiplierTypes.map((option) =>
								new StringSelectMenuOptionBuilder()
									.setLabel(option.label)
									.setDescription(option.description! || "")
									.setValue(option.value)
							)
						)
				);

			const backButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId("back")
					.setLabel("Back")
					.setStyle(ButtonStyle.Secondary)
			);

			const response = await initialInt.update({
				embeds: [multiplierEmbed],
				components: [multiplierRow, backButton],
			});

			const collector = response.createMessageComponentCollector({
				time: 1000 * 60 * 5,
				filter: (i) => i.user.id === interaction.user.id,
			});

			collector.on("collect", async (i) => {
				if (i.componentType === ComponentType.StringSelect) {
					if (i.customId === "multiplier-select") {
						const multiplierType = i.values[0];

						if (multiplierType === "role_multiplier") {
							const roleSelect =
								new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
									new RoleSelectMenuBuilder()
										.setCustomId("multiplier-role-select")
										.setPlaceholder("Select a role")
										.setMinValues(1)
										.setMaxValues(1)
								);

							const roleReply = await i.update({
								content: "Select a role",
								components: [roleSelect, backButton],
							});

							const roleCollector = roleReply.createMessageComponentCollector({
								time: 1000 * 60 * 5,
								componentType: ComponentType.RoleSelect,
								filter: (i) =>
									i.customId === "multiplier-role-select" &&
									i.user.id === interaction.user.id,
							});

							roleCollector.on("collect", async (ri) => {
								const entriesEmbed = new EmbedBuilder()
									.setTitle("Add a Multiplier")
									.setColor(Constants.primaryColor)
									.setDescription(
										`How many extra entries should users with <@&${
											ri.values[0]
										}> get?\n\n- Enter a number <t:${Math.floor(
											Date.now() / 1000 + 30
										)}:R>`
									);

								await ri.update({
									content: null,
									embeds: [entriesEmbed],
									components: [backButton],
								});

								const entriesCollector = ri.channel?.createMessageCollector({
									time: 30_000,
									filter: (msg) => msg.author.id === interaction.user.id,
									max: 1,
								});

								entriesCollector?.on("collect", async (msg) => {
									const entries = parseInt(msg.content);
									if (isNaN(entries) || entries <= 0) {
										await msg.reply({
											content: "Please enter a valid positive number",
										});
										return;
									}

									multipliers.push({
										type: "role",
										value: ri.values[0],
										entries,
									});

									await msg.delete().catch(() => {});

									await ri.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								});

								entriesCollector?.on("end", async (collected) => {
									if (collected.size === 0) {
										await ri.editReply({
											content: null,
											embeds: [getUpdatedEmbed()],
											components: [buttons1, buttons2],
										});
									}
								});
							});
						} else if (multiplierType === "messages_multiplier") {
							const messagesEmbed = new EmbedBuilder()
								.setTitle("Add a Multiplier")
								.setColor(Constants.primaryColor)
								.setDescription(
									`How many messages should users need?\n\n- Enter a number <t:${Math.floor(
										Date.now() / 1000 + 30
									)}:R>`
								);

							await i.update({
								embeds: [messagesEmbed],
								components: [backButton],
							});

							const messagesCollector = i.channel?.createMessageCollector({
								time: 30_000,
								filter: (msg) => msg.author.id === interaction.user.id,
								max: 1,
							});

							messagesCollector?.on("collect", async (msg) => {
								const messageCount = parseInt(msg.content);
								if (isNaN(messageCount) || messageCount <= 0) {
									await msg.reply({
										content: "Please enter a valid positive number",
									});
									return;
								}

								const entriesEmbed = new EmbedBuilder()
									.setTitle("Add a Multiplier")
									.setColor(Constants.primaryColor)
									.setDescription(
										`How many extra entries should users with ${messageCount} messages get?\n\n- Enter a number <t:${Math.floor(
											Date.now() / 1000 + 30
										)}:R>`
									);

								await msg.delete().catch(() => {});

								await i.editReply({
									embeds: [entriesEmbed],
									components: [backButton],
								});

								const entriesCollector = i.channel?.createMessageCollector({
									time: 30_000,
									filter: (m) => m.author.id === interaction.user.id,
									max: 1,
								});

								entriesCollector?.on("collect", async (entriesMsg) => {
									const entries = parseInt(entriesMsg.content);
									if (isNaN(entries) || entries <= 0) {
										await entriesMsg.reply({
											content: "Please enter a valid positive number",
										});
										return;
									}

									multipliers.push({
										type: "message",
										value: messageCount.toString(),
										entries,
									});

									await entriesMsg.delete().catch(() => {});

									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								});

								entriesCollector?.on("end", async (collected) => {
									if (collected.size === 0) {
										await i.editReply({
											content: null,
											embeds: [getUpdatedEmbed()],
											components: [buttons1, buttons2],
										});
									}
								});
							});

							messagesCollector?.on("end", async (collected) => {
								if (collected.size === 0) {
									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								}
							});
						} else if (multiplierType === "level_multiplier") {
							const levelEmbed = new EmbedBuilder()
								.setTitle("Add a Multiplier")
								.setColor(Constants.primaryColor)
								.setDescription(
									`What level should users need?\n\n- Enter a number <t:${Math.floor(
										Date.now() / 1000 + 30
									)}:R>`
								);

							await i.update({
								embeds: [levelEmbed],
								components: [backButton],
							});

							const levelCollector = i.channel?.createMessageCollector({
								time: 30_000,
								filter: (msg) => msg.author.id === interaction.user.id,
								max: 1,
							});

							levelCollector?.on("collect", async (msg) => {
								const levelValue = parseInt(msg.content);
								if (isNaN(levelValue) || levelValue <= 0) {
									await msg.reply({
										content: "Please enter a valid positive number",
									});
									return;
								}

								const entriesEmbed = new EmbedBuilder()
									.setTitle("Add a Multiplier")
									.setColor(Constants.primaryColor)
									.setDescription(
										`How many extra entries should users with level ${levelValue} get?\n\n- Enter a number <t:${Math.floor(
											Date.now() / 1000 + 30
										)}:R>`
									);

								await msg.delete().catch(() => {});

								await i.editReply({
									embeds: [entriesEmbed],
									components: [backButton],
								});

								const entriesCollector = i.channel?.createMessageCollector({
									time: 30_000,
									filter: (m) => m.author.id === interaction.user.id,
									max: 1,
								});

								entriesCollector?.on("collect", async (entriesMsg) => {
									const entries = parseInt(entriesMsg.content);
									if (isNaN(entries) || entries <= 0) {
										await entriesMsg.reply({
											content: "Please enter a valid positive number",
										});
										return;
									}

									multipliers.push({
										type: "level",
										value: levelValue.toString(),
										entries,
									});

									await entriesMsg.delete().catch(() => {});

									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								});

								entriesCollector?.on("end", async (collected) => {
									if (collected.size === 0) {
										await i.editReply({
											content: null,
											embeds: [getUpdatedEmbed()],
											components: [buttons1, buttons2],
										});
									}
								});
							});

							levelCollector?.on("end", async (collected) => {
								if (collected.size === 0) {
									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								}
							});
						} else if (multiplierType === "streak_multiplier") {
							const streakEmbed = new EmbedBuilder()
								.setTitle("Add a Multiplier")
								.setColor(Constants.primaryColor)
								.setDescription(
									`What streak should users need?\n\n- Enter a number <t:${Math.floor(
										Date.now() / 1000 + 30
									)}:R>`
								);

							await i.update({
								embeds: [streakEmbed],
								components: [backButton],
							});

							const streakCollector = i.channel?.createMessageCollector({
								time: 30_000,
								filter: (msg) => msg.author.id === interaction.user.id,
								max: 1,
							});

							streakCollector?.on("collect", async (msg) => {
								const streakValue = parseInt(msg.content);
								if (isNaN(streakValue) || streakValue <= 0) {
									await msg.reply({
										content: "Please enter a valid positive number",
									});
									return;
								}

								const entriesEmbed = new EmbedBuilder()
									.setTitle("Add a Multiplier")
									.setColor(Constants.primaryColor)
									.setDescription(
										`How many extra entries should users with a streak of ${streakValue} get?\n\n- Enter a number <t:${Math.floor(
											Date.now() / 1000 + 30
										)}:R>`
									);

								await msg.delete().catch(() => {});

								await i.editReply({
									embeds: [entriesEmbed],
									components: [backButton],
								});

								const entriesCollector = i.channel?.createMessageCollector({
									time: 30_000,
									filter: (m) => m.author.id === interaction.user.id,
									max: 1,
								});

								entriesCollector?.on("collect", async (entriesMsg) => {
									const entries = parseInt(entriesMsg.content);
									if (isNaN(entries) || entries <= 0) {
										await entriesMsg.reply({
											content: "Please enter a valid positive number",
										});
										return;
									}

									multipliers.push({
										type: "streak",
										value: streakValue.toString(),
										entries,
									});

									await entriesMsg.delete().catch(() => {});

									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								});

								entriesCollector?.on("end", async (collected) => {
									if (collected.size === 0) {
										await i.editReply({
											content: null,
											embeds: [getUpdatedEmbed()],
											components: [buttons1, buttons2],
										});
									}
								});
							});

							streakCollector?.on("end", async (collected) => {
								if (collected.size === 0) {
									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								}
							});
						} else if (multiplierType === "booster_multiplier") {
							const entriesEmbed = new EmbedBuilder()
								.setTitle("Add a Multiplier")
								.setColor(Constants.primaryColor)
								.setDescription(
									`How many extra entries should server boosters get?\n\n- Enter a number <t:${Math.floor(
										Date.now() / 1000 + 30
									)}:R>`
								);

							await i.update({
								embeds: [entriesEmbed],
								components: [backButton],
							});

							const entriesCollector = i.channel?.createMessageCollector({
								time: 30_000,
								filter: (msg) => msg.author.id === interaction.user.id,
								max: 1,
							});

							entriesCollector?.on("collect", async (msg) => {
								const entries = parseInt(msg.content);
								if (isNaN(entries) || entries <= 0) {
									await msg.reply({
										content: "Please enter a valid positive number",
									});
									return;
								}

								multipliers.push({
									type: "booster",
									value: "true",
									entries,
								});

								await msg.delete().catch(() => {});

								await i.editReply({
									content: null,
									embeds: [getUpdatedEmbed()],
									components: [buttons1, buttons2],
								});
							});

							entriesCollector?.on("end", async (collected) => {
								if (collected.size === 0) {
									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								}
							});
						} else if (multiplierType === "account_age_multiplier") {
							const accountAgeEmbed = new EmbedBuilder()
								.setTitle("Add a Multiplier")
								.setColor(Constants.primaryColor)
								.setDescription(
									`How old (in days) should a user's account be?\n\n- Enter a number <t:${Math.floor(
										Date.now() / 1000 + 30
									)}:R>`
								);

							await i.update({
								embeds: [accountAgeEmbed],
								components: [backButton],
							});

							const accountAgeCollector = i.channel?.createMessageCollector({
								time: 30_000,
								filter: (msg) => msg.author.id === interaction.user.id,
								max: 1,
							});

							accountAgeCollector?.on("collect", async (msg) => {
								const accountAge = parseInt(msg.content);
								if (isNaN(accountAge) || accountAge <= 0) {
									await msg.reply({
										content: "Please enter a valid positive number",
									});
									return;
								}

								const entriesEmbed = new EmbedBuilder()
									.setTitle("Add a Multiplier")
									.setColor(Constants.primaryColor)
									.setDescription(
										`How many extra entries should users with accounts older than ${accountAge} days get?\n\n- Enter a number <t:${Math.floor(
											Date.now() / 1000 + 30
										)}:R>`
									);

								await msg.delete().catch(() => {});

								await i.editReply({
									embeds: [entriesEmbed],
									components: [backButton],
								});

								const entriesCollector = i.channel?.createMessageCollector({
									time: 30_000,
									filter: (m) => m.author.id === interaction.user.id,
									max: 1,
								});

								entriesCollector?.on("collect", async (entriesMsg) => {
									const entries = parseInt(entriesMsg.content);
									if (isNaN(entries) || entries <= 0) {
										await entriesMsg.reply({
											content: "Please enter a valid positive number",
										});
										return;
									}

									multipliers.push({
										type: "account_age",
										value: accountAge.toString(),
										entries,
									});

									await entriesMsg.delete().catch(() => {});

									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								});

								entriesCollector?.on("end", async (collected) => {
									if (collected.size === 0) {
										await i.editReply({
											content: null,
											embeds: [getUpdatedEmbed()],
											components: [buttons1, buttons2],
										});
									}
								});
							});

							accountAgeCollector?.on("end", async (collected) => {
								if (collected.size === 0) {
									await i.editReply({
										content: null,
										embeds: [getUpdatedEmbed()],
										components: [buttons1, buttons2],
									});
								}
							});
						}
					}
				} else if (i.componentType === ComponentType.Button) {
					if (i.customId === "back") {
						await i.update({
							content: null,
							embeds: [getUpdatedEmbed()],
							components: [buttons1, buttons2],
						});
					}
				}
			});
		} else if (initialInt.customId === `exit-${initialInt.user.id}`) {
			await initialInt.update({
				content: "Giveaway creation canceled",
				embeds: [],
				components: [],
			});
			collector.stop();
		} else if (initialInt.customId === "start-giveaway") {
			await GiveawayManager.create({
				interaction: initialInt,
				channel,
				title,
				description,
				duration,
				winners,
				requirements,
				multipliers,
			});

			await initialInt.update({
				content: "Giveaway created successfully!",
				embeds: [],
				components: [],
			});
			collector.stop();
		}
	});

	collector.on("end", async (collected, reason) => {
		if (reason === "time" && collected.size === 0) {
			await interaction.editReply({
				content: "Giveaway creation timed out",
				embeds: [],
				components: [],
			});
		}
	});
}
