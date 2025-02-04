import { Command } from "../../utils/Command";
import { Logger } from "../../utils/Logger";
import { createReadStream } from "node:fs";
import { join } from "node:path";
import { config } from "../../config";
import type { APIEmbed } from "discord-api-types/v9";
import { cwd } from "node:process";

export const command = new Command(
	"our-links",
	(message) => {
		try {
			let ourLinks = "";
			const readerStream = createReadStream(
				join(cwd(), "assets", "our-links.txt")
			);

			readerStream.on("data", (chunk) => {
				ourLinks += chunk;
			});

			readerStream.on("end", () => {
				const embeds: Omit<APIEmbed, "type">[] = [];
				embeds.push({
					title: "OUR LINKS",
					description: ourLinks,
					color: config.commandsEmbedsColor,
				});
				void message.channel.send({
					embeds,
				});
			});
		} catch (err) {
			Logger.error(err);
			void message.channel.send(`Error: ${(err as Error).message}`);
		}
	},
	{
		custom: (message) => {
			if (message.author.id !== "489031280147693568") return false;
			return true;
		},
	}
);
