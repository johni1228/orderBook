'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-ws')
const Link = require('grenache-nodejs-link')
const { Grape } = require('grenache-grape')

const ip = 'http://127.0.0.1:30001';

const link = new Link({
  grape: ip,
  requestTimeout: 10000
})
link.start()


const peer = new PeerRPCClient(link, {})
peer.init()

const order = {type:"sell", price: 10, amount: 10};

const payload = { ip, order};

peer.request('Order_worker', payload, { timeout: 100000 }, (err, result) => {
  if (err) throw err
  console.log(
    'Client address',
    payload.ip,
    'in the sequence:',
    result
  )
})