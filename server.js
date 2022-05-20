'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-ws')
const Link = require('grenache-nodejs-link')

let orderBook = [];

function register (order) {

  let availableOrders = orderBook.filter((od) => order.order.price == od.order.price && order.order.type != od.order.type);

  if (order.order.type == "sell") {
    let order1 = availableOrders.find((element) => element > order.order.amount);
    if (order1 != null ) {
      let specifiIndex = orderBook.findIndex((element) => element.ip == order1.ip);
      orderBook[specifiIndex].order.amount -= order.order.amount;
      return orderBook[specifiIndex].order.amount * orderBook[specifiIndex].order.price;
    }
    else { orderBook.push(order); return "Register";}
  }

  else {
    let ips = []; 
    let amount = availableOrders.reduce((previous, current) => {
      if (previous.order.amount > current.order.amount) {
        ips.push(current.ip);
        return previous.order.amount - order.orer.amount;
      }
    }, order.order.amount);
    order.order.amount = amount;

    if (ips.length == 0) {
      orderBook.push(order);
      return "Register";
    }
    else {
      if (amount != 0) {
        orderBook.push(order);
        ips.map((el) => {
          let index = orderBook.findIndex((order) => order.ip == el);
          orderBook[index].order.amount = 0;
        })
        return `Register with ${amount}`
      }
      else {
        ips.map((el) => {
          let index = orderBook.findIndex((order) => order.ip == el);
          orderBook[index].order.amount = 0;
        })
        return order.order.amount;
      }
    } 
  } 
}

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})

link.start()

const peer = new PeerRPCServer(link, {})
peer.init()

const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)

setInterval(() => {
  link.announce('fibonacci_worker', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
  register(payload);
  handler.reply(null, "Success");
})

