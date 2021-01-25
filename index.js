//GTPSControllerWA (C) GuckTube YT
//GTPSControllerWA take from GTPSControllerDiscordBot Code
//Dont forget to credit me, star my repository, and follow my github

const fs = require('fs');
const bcrypt = require("bcrypt")

//if waconfig.json not exist, it will auto create
if (!fs.existsSync("waconfig.json"))
{
    fs.writeFileSync("waconfig.json",`{
        "prefix" : "gt!",
        "players" : "players",
        "worlds" : "worlds",
        "exegtps" : "enet server test.exe",
        "sdata" : "C:\\xampp\\htdocs\\growtopia\\server_data.php"
}`)
    const config = require("./waconfig.json")
}

const { exec } = require("child_process");
const kill = require("child_process").exec
const { Client, Location } = require('whatsapp-web.js');
const config = require("./waconfig.json")
const SESSION_FILE_PATH = './session.json';
let sessionCfg;

if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client(({ puppeteer: { headless: false }, session: sessionCfg }));

client.initialize();

//client authenticated event
client.on('authenticated', (session) => {
    console.log('Authenticated!');
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

//client auth failure event
client.on('auth_failure', msg => {
    console.error('Authentication Failure', msg);
});

//Client ready event
client.on('ready', () => {
    console.log('The bot is Ready!');
});

//this is for checking the server is running or not
const isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' : cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    kill(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}

//client message event
client.on('message', async msg => {
    const args = msg.body.slice(config.prefix.length).trim().split(/ +/g);
    console.log(args)
    const message = args.shift().toLowerCase();
    let chat = await msg.getChat();
    if (chat.isGroup)
    {
      if (message === "help")
      {
        return msg.reply(`
        Commands are
        ${config.prefix}start (Start the server)
        ${config.prefix}stop (Stop the sever)`)
      }
      if (message === "start")
      {
        {
          if (admins.isAdmin)
          {
            if (fs.existsSync(config.exegtps))
            {
              exec(`start "${config.exegtps}"`)
            return msg.reply("the server has been started!")
            }
            else
            {
              msg.reply("Where's the exe? did you set the config.json?")
            }
          }
          else
          {
            return msg.reply("Sorry, you don't have permissions to use this!")
          }
        }
      }
      if (command === "stop")
      {
        if (admins.isAdmin)
        {
          kill(`taskkill /f /im "${config.exegtps}"`)
          return msg.reply("Server has been stopped!")
        }
        else
        {
          return msg.reply("Sorry, you don't have permissions to use this!")
        }
      }
      if (command === "about")
      {
        return msg.getChat(msg.from, "This bot can Control this GTPS Using WhatsApp, so, you can Control your GTPS using WhatsApp\nThis bot is Created by GuckTubeYT")
      }
    }
    else
    {
      //if the member chat on Private Chat, or Direct Message, it will return to this
      return msg.reply("Please chat on group")
    }
});

//Client disconnect event
client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});
