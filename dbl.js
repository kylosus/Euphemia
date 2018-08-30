const DBL = require('dblapi.js');

module.exports = (token, password, client) => {
    const dbl = new DBL(token, { webhookPort: 3001, webhookAuth: password }, client);
    dbl.webhook.on('vote', console.log);
    dbl.on('posted', () => {
        console.log('Server count posted!');
    });
    dbl.webhook.on('error', e => {
        console.log(`[DBL] ${e}`);
    });
};
