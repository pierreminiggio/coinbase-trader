import dotenv from 'dotenv'
import main from './src/main.js'
import tls from 'tls'
import fs from 'fs'
dotenv.config()

const origCreateSecureContext = tls.createSecureContext

tls.createSecureContext = options => {
    const context = origCreateSecureContext(options);
  
    const pem = fs
        .readFileSync('./cacert.pem', { encoding: 'ascii' })
        .replace(/\r\n/g, '\n');
  
    const certs = pem.match(/-----BEGIN CERTIFICATE-----\n[\s\S]+?\n-----END CERTIFICATE-----/g);
  
    if (! certs) {
        throw new Error(`Could not parse certificate ./cacert.pem`);
    }
  
    certs.forEach(cert => {
        context.context.addCACert(cert.trim());
    });
  
    return context;
};

main(process.env.APIKEY, process.env.APISECRET)
