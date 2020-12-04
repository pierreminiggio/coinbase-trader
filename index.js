import dotenv from 'dotenv'
import main from './src/main.js'

dotenv.config()
main(process.env.APIKEY, process.env.APISECRET)
