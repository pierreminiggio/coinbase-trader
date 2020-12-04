import coinbase from 'coinbase'

/**
 * @param {string} key 
 * @param {string} secret 
 */
export default function (key, secret) {
    const client = new coinbase.Client({apiKey: key, apiSecret: secret})

    let isBTCAscending = null
    let lastBTCValue = null

    setInterval(() => {
        client.getExchangeRates({}, (err, rates) => {
            if (! err) {
                const newBTCValue = rates.data.rates.BTC
                if (lastBTCValue !== null) {
                    isBTCAscending = lastBTCValue <= newBTCValue
                    console.log(isBTCAscending ? 'ascending' : 'descending')
                }
                lastBTCValue = newBTCValue
                console.log(newBTCValue)
            }
        })
    }, 31000)
}
