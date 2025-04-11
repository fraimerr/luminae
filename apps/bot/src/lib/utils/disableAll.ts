import {
	ActionRowBuilder,
	type ActionRow,
	type MessageActionRowComponent,
	type MessageActionRowComponentBuilder,
} from 'discord.js';

import { makeComponents } from './utils';

export const disableAll = (
	components: ActionRow<MessageActionRowComponent>[] | ActionRowBuilder<MessageActionRowComponentBuilder>[],
	disable = true
) => {
	if (!(components[0] instanceof ActionRowBuilder)) {
		components = makeComponents(components as ActionRow<MessageActionRowComponent>[]);
	}

	for (const component of components) {
		for (const c of component.components) (c as MessageActionRowComponentBuilder).setDisabled(disable);
	}

	return components as ActionRowBuilder<MessageActionRowComponentBuilder>[];
};
