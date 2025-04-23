import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	Message,
} from "discord.js";
import { Command } from "~/structure/Command";
import { inspect } from "util";
import * as ts from "typescript";
import { performance } from "perf_hooks";
import { Logger } from "@parallel/shared/utils/logger";
import { authorOrUser, formatMs, isInteraction } from "~/util/utils";

export class UserCommand extends Command {
	public constructor() {
		super({
			name: "eval",
			description: "Evaluates TypeScript or JavaScript code",
			options: [
				{
					name: "code",
					description: "The code to evaluate",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "mode",
					description: "The evaluation mode to use",
					type: ApplicationCommandOptionType.String,
					required: false,
					choices: [
						{ name: "javascript", value: "javascript" },
						{ name: "typescript", value: "typescript" },
					],
				},
				{
					name: "ephemeral",
					description:
						"Whether the response should be ephemeral (only visible to you)",
					type: ApplicationCommandOptionType.Boolean,
					required: false,
				},
			],
		});

		this.ownerOnly = true;
	}

	protected override async runTask(
		messageOrInteraction: ChatInputCommandInteraction<"cached"> | Message<true>,
		options: Command.ChatInputOptions
	) {
		const user = authorOrUser(messageOrInteraction);

		if (user.id !== "225176015016558593") {
			return messageOrInteraction.reply({
				content: "❌ You do not have permission to use this command.",
				ephemeral: true,
			});
		}

		const codeInput = options.getString("code", true);
		const mode = options.getString("mode") || "javascript";
		const isEphemeral = options.getBoolean("ephemeral") || false;
		const isTypeScript = mode === "typescript";

		if (isInteraction(messageOrInteraction)) {
			await messageOrInteraction.deferReply({
				ephemeral: isEphemeral,
			});
		}

		// Create response embed with common fields
		const embed = new EmbedBuilder()
			.setColor("#0099ff")
			.setTitle("Code Evaluation")
			.setDescription(
				`\`\`\`${isTypeScript ? "typescript" : "javascript"}\n${codeInput}\n\`\`\``
			)
			.setFooter({
				text: `${user.tag}`,
				iconURL: user.displayAvatarURL(),
			})
			.setTimestamp();

		const startTime = performance.now();

		let jsCode = codeInput;

		// Compile TypeScript to JavaScript if needed
		if (isTypeScript) {
			try {
				jsCode = ts.transpileModule(codeInput, {
					compilerOptions: {
						module: ts.ModuleKind.CommonJS,
						target: ts.ScriptTarget.ESNext,
						strict: false,
					},
				}).outputText;

				embed.addFields({
					name: "Compiled JavaScript",
					value: `\`\`\`javascript\n${jsCode.slice(0, 1000)}${jsCode.length > 1000 ? "..." : ""}\n\`\`\``,
				});
			} catch (error) {
				const endTime = performance.now();
				const timeTaken = formatMs(endTime - startTime);

				embed
					.setColor("#ff0000")
					.addFields({
						name: "Compilation Error",
						value: `\`\`\`\n${error}\n\`\`\``,
					})
					.setFooter({
						text: `⏱️ Time Taken: ${timeTaken}`,
					});

				const payload = {
					embeds: [embed],
					ephemeral: isEphemeral,
				};

				if (isInteraction(messageOrInteraction)) {
					await messageOrInteraction.editReply(payload).catch(() => null);
				} else {
					await messageOrInteraction.reply(payload);
				}
				return;
			}
		}

		// Create a safe evaluation context
		const context = {
			interaction: messageOrInteraction,
			message:
				messageOrInteraction instanceof Message ? messageOrInteraction : null,
			client: isInteraction(messageOrInteraction)
				? messageOrInteraction.client
				: messageOrInteraction.client,
		};

		try {
			// Add a timeout to prevent infinite loops
			const AsyncFunction = Object.getPrototypeOf(
				async function () {}
			).constructor;
			const evaluator = new AsyncFunction(
				...Object.keys(context),
				`
              try {
                  const result = (async () => { ${jsCode} })();
                  return { success: true, result };
              } catch (error) {
                  return { success: false, error };
              }
              `
			);

			// Execute with a timeout
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => reject(new Error("Execution timed out (10s)")), 10000);
			});

			const resultPromise = evaluator(...Object.values(context));
			const result = await Promise.race([resultPromise, timeoutPromise]);

			const endTime = performance.now();
			const timeTaken = formatMs(endTime - startTime);

			embed.setFooter({
				text: `⏱️ Time Taken: ${timeTaken}`,
			});

			if (typeof result === "object" && "success" in result) {
				if (result.success) {
					const inspectedResult = inspect(result.result, { depth: 2 });
					embed.setColor("#00ff00").addFields({
						name: "Result",
						value: `\`\`\`\n${inspectedResult.slice(0, 1000)}${inspectedResult.length > 1000 ? "..." : ""}\n\`\`\``,
					});

					Logger.customLog("EVAL", "Result:", result.result);
				} else {
					embed.setColor("#ff0000").addFields({
						name: "Runtime Error",
						value: `\`\`\`\n${result.error}\n\`\`\``,
					});

					Logger.customLog("EVAL", "Error:", result.error);
				}
			}
		} catch (error) {
			const endTime = performance.now();
			const timeTaken = formatMs(endTime - startTime);

			embed
				.setColor("#ff0000")
				.addFields({
					name: "Execution Error",
					value: `\`\`\`\n${error}\n\`\`\``,
				})
				.setFooter({
					text: `⏱️ Time Taken: ${timeTaken}`,
				});

			Logger.customLog("EVAL", "Execution Error:", error);
		}

		// Log performance
		const finalTime = performance.now();
		const totalTime = formatMs(finalTime - startTime);
		Logger.customLog("EVAL", "Time Taken:", totalTime);

		const payload = {
			embeds: [embed],
			ephemeral: isEphemeral,
		};

		if (isInteraction(messageOrInteraction)) {
			await messageOrInteraction.editReply(payload).catch(() => null);
		} else {
			await messageOrInteraction.reply(payload);
		}
	}

	protected override transformArgs(message: Message<true>, args: string[]) {
		const code = args.join(" ");
		if (!code) return "Please provide code to evaluate.";
		
		return {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			getString(name: string, required?: boolean) {
				if (name === "code") return code;
				if (name === "mode") return "javascript";
				return null;
			},
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			getBoolean(name: string) {
				return false;
			}
		} as unknown as Command.ChatInputOptions;
	}
}
