import {
	SKRSContext2D,
	Canvas,
	loadImage,
	Image,
	GlobalFonts,
} from "@napi-rs/canvas";
import { LevelingManager } from "./LevelingManager";
import { AttachmentBuilder, GuildMember, ImageURLOptions } from "discord.js";
import { numberFormatter } from "~/util/formatter";
import path from "path";
import { Leveling } from "@prisma/client";

export class RankCard {
	private static readonly CARD_WIDTH = 934;
	private static readonly CARD_HEIGHT = 282;
	private static readonly PROGRESS_BAR_HEIGHT = 30;
	private static readonly CARD_BORDER_RADIUS = 40;
	private static readonly CARD_BORDER_WIDTH = 8;
	private static readonly AVATAR_SIZE = 200;
	private static readonly VERTICAL_CENTER = 141;

	public static async getCard(
		member: GuildMember,
		levelData: Leveling
	): Promise<AttachmentBuilder[]> {
		const nextLevelXp = LevelingManager.getXp(levelData.level + 1);
		const currentLevelXp = LevelingManager.getXp(levelData.level);

		const currentProgressXp = levelData.xp - currentLevelXp;
		const currentToNextLevelXp = nextLevelXp - currentLevelXp;
		const progressPercentage = currentProgressXp / currentToNextLevelXp;

		const canvas = new Canvas(this.CARD_WIDTH, this.CARD_HEIGHT);
		const ctx = canvas.getContext("2d");

		this.roundRect(
			ctx,
			0,
			0,
			this.CARD_WIDTH,
			this.CARD_HEIGHT,
			this.CARD_BORDER_RADIUS
		);

		ctx.clip();

		GlobalFonts.registerFromPath(
			path.join(__dirname, "../../../../assets/fonts/FeelinTeachy.ttf"),
			"FeelinTeachy"
		);
		GlobalFonts.registerFromPath(
			path.join(__dirname, "../../../../assets/fonts/KGPerfectPenmanship.ttf"),
			"KGPerfectPenmanship"
		);

		const imgURLOptions: ImageURLOptions = {
			forceStatic: true,
			size: 1024,
			extension: "png",
		};

		const avatarUrl = member.displayAvatarURL(imgURLOptions);
		const avatarImage = await loadImage(avatarUrl);

		const accentColor = await this.extractDominantColor(avatarImage);

		await this.drawUserBackground(member, ctx);
		this.drawCardBorder(ctx, accentColor);
		await this.drawAvatar(ctx, avatarImage, accentColor);

		const contentStartX = 260;
		const contentWidth = this.CARD_WIDTH - contentStartX - 40;

		const rank = levelData.rank;
		ctx.font = '500 30px "KGPerfectPenmanship"';
		ctx.fillStyle =
			rank === 1
				? "#FFD700"
				: rank === 2
				? "#C0C0C0"
				: rank === 3
				? "#CD7F32"
				: "#FFFFFF";
		ctx.textAlign = "right";
		const rankText = `#${rank}`;

		ctx.fillText(rankText, this.CARD_WIDTH - 40, 50);

		ctx.font = '600 48px "KGPerfectPenmanship"';
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "left";
		const displayName = member.displayName.replace(/(( +)|!)/g, " ").trim();
		ctx.fillText(displayName, contentStartX, this.VERTICAL_CENTER - 30);

		ctx.font = '500 30px "KGPerfectPenmanship"';
		ctx.fillStyle = "#FFFFFF";
		const levelText = `Level ${levelData.level}`;
		ctx.fillText(levelText, contentStartX, this.VERTICAL_CENTER + 20);

		ctx.font = '500 24px "KGPerfectPenmanship"';
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "right";
		const xpText = `${numberFormatter(levelData.xp)} / ${numberFormatter(
			nextLevelXp
		)} XP (${Math.floor(progressPercentage * 100)}%)`;
		ctx.fillText(xpText, this.CARD_WIDTH - 40, this.VERTICAL_CENTER + 20);

		const progressBarY = this.VERTICAL_CENTER + 50;
		await this.drawProgressBar({
			context: ctx,
			progress: progressPercentage,
			x: contentStartX,
			y: progressBarY,
			width: contentWidth,
			height: this.PROGRESS_BAR_HEIGHT,
			accent: accentColor,
			background: "rgba(0, 0, 0, 0.6)",
		});

		return [
			new AttachmentBuilder(canvas.toBuffer("image/png"))
				.setName("rankcard.png")
				.setDescription(`Rank Card for ${member.displayName}`),
		];
	}

	private static drawCardBorder(ctx: SKRSContext2D, accentColor: string): void {
		ctx.save();

		this.roundRect(
			ctx,
			this.CARD_BORDER_WIDTH / 2,
			this.CARD_BORDER_WIDTH / 2,
			this.CARD_WIDTH - this.CARD_BORDER_WIDTH,
			this.CARD_HEIGHT - this.CARD_BORDER_WIDTH,
			this.CARD_BORDER_RADIUS
		);

		ctx.lineWidth = this.CARD_BORDER_WIDTH;
		ctx.strokeStyle = accentColor;
		ctx.stroke();

		ctx.shadowColor = "rgb(0, 0, 0)";
		ctx.shadowBlur = 10;
		ctx.lineWidth = this.CARD_BORDER_WIDTH + 2;
		ctx.stroke();

		ctx.restore();
	}

	private static async extractDominantColor(img: Image): Promise<string> {
		const sampleSize = 50;
		const canvas = new Canvas(sampleSize, sampleSize);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
		const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

		const samples = [];
		for (
			let i = 0;
			i < imageData.length;
			i += 4 * Math.floor(imageData.length / (4 * 20))
		) {
			if (imageData[i + 3] < 128) continue;

			const brightness =
				(imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
			if (brightness < 30 || brightness > 225) continue;

			samples.push({
				r: imageData[i],
				g: imageData[i + 1],
				b: imageData[i + 2],
				a: imageData[i + 3],
			});
		}

		if (samples.length === 0) return "#5865F2";

		const avgColor = samples.reduce(
			(acc, pixel) => {
				acc.r += pixel.r;
				acc.g += pixel.g;
				acc.b += pixel.b;
				return acc;
			},
			{ r: 0, g: 0, b: 0 }
		);

		avgColor.r = Math.round(avgColor.r / samples.length);
		avgColor.g = Math.round(avgColor.g / samples.length);
		avgColor.b = Math.round(avgColor.b / samples.length);

		const vibrantColor = this.makeColorMoreVibrant(avgColor);
		return `rgb(${vibrantColor.r}, ${vibrantColor.g}, ${vibrantColor.b})`;
	}

	private static makeColorMoreVibrant(color: {
		r: number;
		g: number;
		b: number;
	}): { r: number; g: number; b: number } {
		const max = Math.max(color.r, color.g, color.b);

		if (color.r === max) {
			return {
				r: Math.min(255, color.r * 1.2),
				g: Math.max(0, color.g * 0.8),
				b: Math.max(0, color.b * 0.8),
			};
		} else if (color.g === max) {
			return {
				r: Math.max(0, color.r * 0.8),
				g: Math.min(255, color.g * 1.2),
				b: Math.max(0, color.b * 0.8),
			};
		} else {
			return {
				r: Math.max(0, color.r * 0.8),
				g: Math.max(0, color.g * 0.8),
				b: Math.min(255, color.b * 1.2),
			};
		}
	}

	private static async drawUserBackground(
		member: GuildMember,
		ctx: SKRSContext2D
	): Promise<void> {
		const imgURLOptions: ImageURLOptions = {
			forceStatic: true,
			size: 1024,
			extension: "png",
		};

		try {
			let backgroundUrl;
			if (member.user.banner) {
				backgroundUrl = member.user.bannerURL(imgURLOptions);
			}

			if (!backgroundUrl) {
				backgroundUrl = member.displayAvatarURL(imgURLOptions);
			}

			const background = await loadImage(backgroundUrl);

			// Draw background image
			const sourceWidth = background.width;
			const sourceHeight = background.height;
			const cardAspect = this.CARD_WIDTH / this.CARD_HEIGHT;
			const imageAspect = sourceWidth / sourceHeight;

			let sWidth, sHeight, sx, sy;

			if (imageAspect > cardAspect) {
				sHeight = sourceHeight;
				sWidth = sourceHeight * cardAspect;
				sy = 0;
				sx = (sourceWidth - sWidth) / 2;
			} else {
				sWidth = sourceWidth;
				sHeight = sourceWidth / cardAspect;
				sx = 0;
				sy = (sourceHeight - sHeight) / 2;
			}

			ctx.drawImage(
				background,
				sx,
				sy,
				sWidth,
				sHeight,
				0,
				0,
				this.CARD_WIDTH,
				this.CARD_HEIGHT
			);

			// Add dark overlay
			ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // 60% opacity black
			ctx.fillRect(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT);
		} catch (error) {
			console.error(`Failed to load background image: ${error}`);
			// Fallback with built-in overlay
			const gradient = ctx.createLinearGradient(
				0,
				0,
				this.CARD_WIDTH,
				this.CARD_HEIGHT
			);
			gradient.addColorStop(0, "#36393F");
			gradient.addColorStop(1, "#202225");

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT);
		}
	}

	private static async drawAvatar(
		ctx: SKRSContext2D,
		avatarImage: Image,
		accentColor: string
	): Promise<void> {
		try {
			const centerX = 140;
			const centerY = this.VERTICAL_CENTER; // Now properly centered vertically
			const posX = centerX - this.AVATAR_SIZE / 2;
			const posY = centerY - this.AVATAR_SIZE / 2;

			ctx.save();

			ctx.beginPath();
			ctx.arc(centerX, centerY, this.AVATAR_SIZE / 2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();

			ctx.drawImage(
				avatarImage,
				posX,
				posY,
				this.AVATAR_SIZE,
				this.AVATAR_SIZE
			);

			ctx.restore();

			ctx.beginPath();
			ctx.arc(centerX, centerY, this.AVATAR_SIZE / 2, 0, Math.PI * 2);
			ctx.lineWidth = 10;
			ctx.strokeStyle = accentColor;
			ctx.stroke();
		} catch (error) {
			console.error(`Failed to draw avatar: ${error}`);
		}
	}

	private static async drawProgressBar({
		context,
		progress,
		x,
		y,
		width,
		height,
		accent,
		background,
	}: {
		context: SKRSContext2D;
		progress: number;
		x: number;
		y: number;
		width: number;
		height: number;
		accent: string;
		background: string;
	}): Promise<void> {
		const canvas = new Canvas(width, height);
		const ctx = canvas.getContext("2d");

		this.roundRect(ctx, 0, 0, width, height, height / 2);
		ctx.fillStyle = background;
		ctx.fill();

		ctx.save();
		ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
		ctx.shadowBlur = 5;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 1;
		ctx.fillStyle = "rgba(0, 0, 0, 0)";
		this.roundRect(ctx, 0, 0, width, height, height / 2);
		ctx.fill();
		ctx.restore();

		const progressWidth = Math.max(
			Math.min(width * progress, width),
			height / 2
		);
		ctx.save();
		ctx.beginPath();
		this.roundRect(ctx, 0, 0, progressWidth, height, height / 2);
		ctx.clip();

		const gradient = ctx.createLinearGradient(0, 0, progressWidth, 0);
		gradient.addColorStop(0, accent);
		gradient.addColorStop(1, this.lightenColor(accent, 30));
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, progressWidth, height);

		ctx.shadowColor = accent;
		ctx.shadowBlur = 15;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.fillRect(0, 0, progressWidth, height);

		ctx.restore();
		context.drawImage(canvas, x, y, width, height);
	}

	private static roundRect(
		ctx: SKRSContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number
	): void {
		if (width < 2 * radius) radius = width / 2;
		if (height < 2 * radius) radius = height / 2;

		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.arcTo(x + width, y, x + width, y + height, radius);
		ctx.arcTo(x + width, y + height, x, y + height, radius);
		ctx.arcTo(x, y + height, x, y, radius);
		ctx.arcTo(x, y, x + width, y, radius);
		ctx.closePath();
	}

	private static lightenColor(color: string, amount: number): string {
		if (color.startsWith("rgb")) {
			const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
			if (match) {
				const r = Math.min(255, parseInt(match[1]) + amount);
				const g = Math.min(255, parseInt(match[2]) + amount);
				const b = Math.min(255, parseInt(match[3]) + amount);
				return `rgb(${r}, ${g}, ${b})`;
			}
		}

		const rgb = this.hexToRgb(color);
		if (!rgb) return color;

		const newRgb = {
			r: Math.min(255, rgb.r + amount),
			g: Math.min(255, rgb.g + amount),
			b: Math.min(255, rgb.b + amount),
		};

		return `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`;
	}

	private static hexToRgb(
		hex: string
	): { r: number; g: number; b: number } | null {
		if (!hex || !hex.startsWith("#")) return null;

		hex = hex.replace(/^#/, "");

		if (hex.length === 3) {
			hex = hex
				.split("")
				.map((c) => c + c)
				.join("");
		}

		if (!/^[0-9A-F]{6}$/i.test(hex)) return null;

		const bigint = parseInt(hex, 16);
		return {
			r: (bigint >> 16) & 255,
			g: (bigint >> 8) & 255,
			b: bigint & 255,
		};
	}
}
