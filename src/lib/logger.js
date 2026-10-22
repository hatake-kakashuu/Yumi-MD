import chalk from 'chalk';
import moment from 'moment';

function timestamp() {
    return chalk.gray(`[${moment().format('HH:mm:ss')}]`);
}

export const Logger = {
    info: (msg, ...args) => console.log(timestamp(), chalk.bgCyan.black.bold(' INFO '), chalk.cyanBright(msg), ...args),
    success: (msg, ...args) => console.log(timestamp(), chalk.bgGreen.black.bold(' SUCCESS '), chalk.greenBright(msg), ...args),
    warn: (msg, ...args) => console.log(timestamp(), chalk.bgYellow.black.bold(' WARN '), chalk.yellowBright(msg), ...args),
    error: (msg, ...args) => console.log(timestamp(), chalk.bgRed.white.bold(' ERROR '), chalk.redBright(msg), ...args),

    chat: (botName, sender, group) => {
        const tag = chalk.bold.magenta(`[${botName}]`);
        const badge = chalk.bgCyan.black.bold(' MSG ');
        const fromUser = chalk.bold.yellow(sender || 'Unknown');
        const inGroup = group ? chalk.green(` in ${chalk.bold.cyan(group)}`) : chalk.gray(' (DM)');
        console.log(`${timestamp()} ${tag} ${badge} ${fromUser}${inGroup}`);
    },

    command: (botName, cmdName, argText, sender, group) => {
        const tag = chalk.bold.magenta(`[${botName}]`);
        const badge = chalk.bgMagenta.black.bold(' CMD ');
        const cmd = chalk.bold.yellowBright(cmdName);
        const args = argText && argText !== '[0]' ? ` ${chalk.hex('#FFA500')(argText)}` : '';
        const fromUser = chalk.bold.greenBright(sender || 'Unknown');
        const inGroup = group ? chalk.green(` in ${chalk.bold.cyan(group)}`) : chalk.gray(' (DM)');
        console.log(`${timestamp()} ${tag} ${badge} ${cmd}${args} from ${fromUser}${inGroup}`);
    },

    autoDl: (botName, command, sender, url) => {
        const tag = chalk.bold.magenta(`[${botName}]`);
        const badge = chalk.bgBlue.white.bold(' AUTO-DL ');
        console.log(`${timestamp()} ${tag} ${badge} ${chalk.bold.yellowBright(command)} for ${chalk.bold.greenBright(sender || 'Unknown')}: ${chalk.cyan(url)}`);
    }
};

export default Logger;
