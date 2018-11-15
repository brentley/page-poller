# page-poller

A simple Node.js script that polls a website and alerts when there's a change. This is easier on the CPU than a page refresher because it doesn't have to render the page.

This can be used for any website by setting the `--url` option. It should strip csrf tokens, which change on every refresh, but it probably doesn't catch everything that might change on load. I may add functionality to select certain parts of a page to check for changes, but for now it just checks whole pages.

I originally built this for myself to poll PAX sites to alert me when badges were available, and the `--pax` options is still there.

When there's a change, the script will stop polling, print a diff to the command line, and send a desktop notification.

![Notification screenshot](https://raw.githubusercontent.com/timmywil/page-poller/master/page-poller.png)

## Requirements

Requires [Node.js](https://nodejs.org/en/download/) to run.

## Installation

```bash
$ git clone git@github.com:timmywil/page-poller.git
```

## Usage

```bash
$ cd page-poller
$ ./page-poller.js -u https://timmywil.com # Leave open in a terminal and let it run. Ctrl-c to quit.
$ ./page-poller.js --pax east
```

#### Options

```
  --url, -u   Override the polled URL                   [string]
  --poll, -p  Poll interval in milliseconds             [number]       [default: 5000]
  --pax       PAX site to poll        [choices: "west", "east", "aus", "south", "unplugged"]
  --version   Show version number                       [boolean]
  --help      Show help
```
