#!/usr/bin/env node
require('isomorphic-fetch')
const URL = require('url').URL
const open = require('opn')

const removeRegex = {
  csrf: /name=["']csrf_token['"] value=['"][\w\d]+['"]/g,
  countdown: /<p id="countdown">[\w\W]+<\/p>/,
  scripts: /<script[\w\W]*?<\/script>/g,
  links: /<link[\w\W]*?\/?>/g,
  meta: /<meta[\w\W]*?\/?>/g
}

const argv = require('yargs')
  .usage('$0 [args]')
  .options({
    pax: {
      describe: 'PAX site to poll',
      conflicts: 'url',
      choices: ['west', 'east', 'aus', 'south', 'unplugged']
    },
    poll: {
      alias: 'p',
      default: 5000,
      describe: 'Poll interval in milliseconds. Minimum is 500.',
      type: 'number'
    },
    url: {
      alias: 'u',
      describe: 'URL to poll',
      conflicts: 'pax',
      type: 'string'
    },
    continual: {
      alias: 'c',
      describe: 'Continue polling even when there is a change',
      type: 'boolean'
    },
    verbose: {
      alias: 'v',
      describe: 'Log every poll',
      type: 'boolean'
    }
  })
  .check((argv) => {
    if (!argv.pax && !argv.url) {
      throw new Error('Either pax or url must be specified.')
    }
    return argv
  })
  .help().argv
const diff = require('diff')
const chalk = require('chalk')
const notifier = require('node-notifier')
const unparsedUrl = argv.url || `http://${argv.pax.toLowerCase()}.paxsite.com`
const url = new URL(unparsedUrl)

const pollTime = Math.max(argv.poll, 500)

function getPage() {
  // This is the only way to cache bust with node
  url.search = url.search ? `${url.search}&${Date.now()}` : Date.now()
  return fetch(url.href).then((response) => response.text())
}

function format(text) {
  return ['csrf', 'countdown', 'scripts', 'links', 'meta'].reduce(
    (str, current) => str.replace(removeRegex[current], ''),
    text
  )
}

let data

function poll() {
  return getPage().then((text) => {
    if (argv.verbose) {
      console.log(`GET ${unparsedUrl}: next poll in ${pollTime}ms`)
    }
    text = format(text)
    if (!data) {
      data = text
    } else if (data !== text) {
      const parts = diff.diffChars(data, text)
      parts.forEach((part) => {
        console.log(chalk[part.added ? 'green' : 'red'](part.value))
      })
      console.log()
      notifier.notify({
        title: 'Page Poller',
        message: 'URL content has changed!',
        sound: true
      })
      open(unparsedUrl)
      if (argv.continual) {
        data = text
      } else {
        process.exit(0)
      }
    }

    setTimeout(poll, pollTime)
  })
}

console.log(`Checking ${url.href} every ${pollTime}ms...`)
poll()
