const DBL = require('dblapi.js');

module.exports = (token, password, client) => {
    const dbl = new DBL(token, { webhookPort: 5000, webhookAuth: password }, client);
    console.log(dbl);
    dbl.webhook.on('ready', console.log);
    dbl.webhook.on('vote', console.log);
    dbl.on('posted', () => {
        console.log('Server count posted!');
    });
    dbl.webhook.on('error', e => {
        console.log(`[DBL] ${e}`);
    });
};
