const player = require("../../handler/client/player");

module.exports = {
    name: "now-playing",
    description: "shows information about the current song",
    category: "music",
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guild.id);
        if(!queue?.playing)
            return interaction.followUp({
                content: "No music is currently playing",
            });
        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        return interaction.followUp({
            embeds: [
                {
                    title: "Now playing",
                    description: `🎶 | **${queue.current.title}**! (\`${perc.progress})`,
                    fields: [
                        {
                            name: "\u200b",
                            value: progress,
                        },
                    ],
                    color: client.config.clientColor,
                    footer: {
                        text: `Queued by ${queue.current.requestedBy.tag}`,
                    },
                },
            ],
        });
    },
};