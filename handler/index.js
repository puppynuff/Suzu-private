const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */


module.exports = async (client) => {
    //Commands
    console.log("this should be first");
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    //Events
    const eventFiles = await globPromise(`./events/*.js`);
    eventFiles.map((value) => require(value));

    //Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });

    //Ready
    client.once("ready", async () => {
        await client.guilds.cache
            .get("843568795620606012")
            .commands.set(arrayOfSlashCommands);
        await client.guilds.cache
            .get("967117817663074304")
            .commands.set(arrayOfSlashCommands);
    });
}