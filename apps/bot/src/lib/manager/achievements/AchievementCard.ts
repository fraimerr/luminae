import { GlobalFonts, Image, loadImage } from "@napi-rs/canvas";
import { AttachmentBuilder, GuildMember, ImageURLOptions } from "discord.js";
import { Canvas, SKRSContext2D } from "@napi-rs/canvas";
import path from "path";

export class AchievementCard {
	private static readonly CARD_WIDTH = 934;
	private static readonly CARD_HEIGHT = 282;
	private static readonly CARD_BORDER_RADIUS = 40;
	private static readonly CARD_BORDER_WIDTH = 8;
	private static readonly AVATAR_SIZE = 200;
	private static readonly VERTICAL_CENTER = 141;
	private static readonly ACCENT_COLOR = "#f1f1f1";
	private static readonly BACKGROUND_GRADIENT = ["#36393F", "#202225"];

	public static async create(member: GuildMember) {
		const canvas = new Canvas(this.CARD_WIDTH, this.CARD_HEIGHT);
		const ctx = canvas.getContext("2d");

		// Create background gradient
		const gradient = ctx.createLinearGradient(
			0,
			0,
			this.CARD_WIDTH,
			this.CARD_HEIGHT
		);
		gradient.addColorStop(0, this.BACKGROUND_GRADIENT[0]);
		gradient.addColorStop(1, this.BACKGROUND_GRADIENT[1]);

		ctx.fillStyle = gradient;
		this.roundRect(
			ctx,
			0,
			0,
			this.CARD_WIDTH,
			this.CARD_HEIGHT,
			this.CARD_BORDER_RADIUS
		);
		ctx.fill();
		ctx.clip();

		GlobalFonts.registerFromPath(
			path.join(__dirname, "../../../../assets/fonts/FeelinTeachy.ttf"),
			"FeelinTeachy"
		);

		const imgURLOptions: ImageURLOptions = {
			forceStatic: true,
			size: 1024,
			extension: "png",
		};

		const avatarUrl = member.displayAvatarURL(imgURLOptions);
		const avatarImage = await loadImage(avatarUrl);

		this.drawCardBorder(ctx, this.ACCENT_COLOR);
		await this.drawAvatar(ctx, avatarImage, this.ACCENT_COLOR);

		const contentStartX = 260;
		const textBlockHeight = 140; // Total height of text elements

		// Calculate vertical starting position for text block
		const textStartY = this.VERTICAL_CENTER - textBlockHeight / 2 + 20;

		// Achievement Title
		ctx.font = '600 38px "FeelinTeachy"';
		ctx.fillStyle = "#FFFFFF";
		ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
		ctx.shadowBlur = 6;
		ctx.fillText("Achievement Unlocked!", contentStartX, textStartY);

		// Achievement Name
		ctx.font = '500 52px "FeelinTeachy"';
		ctx.fillStyle = this.ACCENT_COLOR;
		ctx.shadowBlur = 4;
		ctx.fillText("First Message Sent", contentStartX, textStartY + 70);

		// XP Reward
		ctx.font = '500 36px "FeelinTeachy"';
		ctx.fillStyle = "#FFFFFF";
		ctx.shadowBlur = 0;
		ctx.fillText("+10 XP", contentStartX, textStartY + 120);

		return [
			new AttachmentBuilder(canvas.toBuffer("image/png"))
				.setName("achievement.png")
				.setDescription(`${member.displayName}'s Achievement`),
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

		ctx.shadowColor = "rgba(0, 255, 0, 0.3)"; // Accent color shadow
		ctx.shadowBlur = 20;
		ctx.lineWidth = this.CARD_BORDER_WIDTH + 2;
		ctx.stroke();

		ctx.restore();
	}

	private static async drawAvatar(
		ctx: SKRSContext2D,
		avatarImage: Image,
		accentColor: string
	): Promise<void> {
		try {
			const centerX = 140;
			const centerY = this.VERTICAL_CENTER;
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
			ctx.lineWidth = 12; // Increased border width
			ctx.strokeStyle = accentColor;
			ctx.stroke();
		} catch (error) {
			console.error(`Failed to draw avatar: ${error}`);
		}
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
}
