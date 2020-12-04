import coinbase from 'coinbase'

/**
 * @param {string} key 
 * @param {string} secret 
 */
export default function (key, secret) {
    const client = new coinbase.Client({apiKey: key, apiSecret: secret})

    let holdingInWallet
    client.getAccounts({}, function (err, accounts) {
        if (err) {
            throw err
        }
        accounts.forEach((acc) => {
            if (acc.name === 'Portefeuille en BTC') {
                holdingInWallet = ! (! acc.balance.amount)
                startTrading()
            }
        })
    })

    let isBTCAscending = null
    let lastBTCValue = null

    const startTrading = () => {
        console.log('Start trading !')
        return setInterval(() => {
            client.getExchangeRates({}, (err, rates) => {
                if (! err) {
                    const newBTCValue = rates.data.rates.BTC
                    console.log(newBTCValue)
                    if (lastBTCValue !== null) {
                        isBTCAscending = isBTCAscending ?
                            (lastBTCValue <= newBTCValue) :
                            (lastBTCValue < newBTCValue)
                        console.log(isBTCAscending ? 'ascending' : 'descending')
                        if (holdingInWallet) {
                            if (isBTCAscending) {
                                console.log('HODL !')
                            } else {
                                if (true /* check if higher than bought price */) {
                                    console.log('Sell !')
                                } else {
                                    console.log('HODL !')
                                }
                            }
                        }
                    }
                    lastBTCValue = newBTCValue
                }
            })
        }, 31000)
    }
}
