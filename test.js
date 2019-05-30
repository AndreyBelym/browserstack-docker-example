#!/usr/bin/env node

const http = require('http');
const webdriver = require('selenium-webdriver')
const browserstack = require('browserstack-local')
const local = new browserstack.Local()

var capabilities = {
  'build': 'Docker example',
  'browserName': 'chrome',
  'os': 'OS X',
  'browserstack.local': true,
  'browserstack.user': process.env.BROWSERSTACK_USERNAME,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
}

var options = {
  'key': process.env.BROWSERSTACK_ACCESS_KEY
}

console.log('Starting tunnel...')


const server = http
  .createServer((request, response) => {
    response.statusCode = 200;
    response.end(`<html><head><title>Hello World</title></head><body><h1>HELLO WORLD</h1></body></html>`);
  })
  .listen(() => {
    local.start(options, function (error) {
      if (error) {
        console.error('Received error while starting tunnel', error)
        process.exit(1)
      }
      console.log('Is Running', local.isRunning())
      console.log('Started')
    
      var driver = new webdriver.Builder().usingServer('http://hub.browserstack.com/wd/hub').withCapabilities(capabilities).build()
      driver.get(`http://127.0.0.1:${server.address().port}`).then(function () {
        driver.getTitle().then(function (title) {
          console.log(title)
        })
        driver.quit().then(function () {
          local.stop(function () {
            console.log('Stopped')
          })
        })
      })
    })    
  });
