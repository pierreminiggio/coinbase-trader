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
    let lastBoughtPrice = null
    let lastSoldPrice = null

    const margin = 1.02

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
                                if (! lastBoughtPrice || (lastBoughtPrice * margin) < newBTCValue) {
                                    console.log('Sell !')
                                    holdingInWallet = false
                                    lastSoldPrice = newBTCValue
                                } else {
                                    console.log('HODL !')
                                }
                            }
                        } else {
                            if (isBTCAscending) {
                                if (lastSoldPrice && newBTCValue > (lastSoldPrice * margin)) {
                                    console.log('FLY ABOVE MY HEAD !')
                                } else {
                                    console.log('Buy !')
                                    holdingInWallet = true
                                    lastBoughtPrice = newBTCValue
                                }
                            } else {
                                console.log('YES I\'M HERE !')
                            }
                        }
                    }
                    lastBTCValue = newBTCValue
                }
            })
        }, 31000)
    }
}
