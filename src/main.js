import coinbase from 'coinbase'

/**
 * @param {string} key 
 * @param {string} secret 
 */
export default function (key, secret) {
    const client = new coinbase.Client({apiKey: key, apiSecret: secret})

    client.getAccounts({}, function(err, accounts) {
        accounts.forEach(function(acct) {
            console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);
        });
    });
}
