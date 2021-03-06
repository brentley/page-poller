# page-poller

page-poller is a simple Node.js script that polls a website and alerts when there's a change. It uses a headless browser (via [Puppeteer](https://github.com/puppeteer/puppeteer/)) to render the page. The advantage is that it will catch changes in client-rendered content, such as with Single Page Apps that use JavaScript to render content.

| Static pages       | Pages rendered with JS | Pages behind login |
| ------------------ | ---------------------- | ------------------ |
| :heavy_check_mark: | :heavy_check_mark:     | :x:                |

This can be used for any website by setting the `--url` option. It strips csrf tokens and all script tags, which sometimes contain tokens that are supposed to change on every refresh. I may add functionality to select certain parts of a page to check for changes, but for now it just checks whole pages.

I originally built this to poll PAX sites to alert me when badges were available, and the `--pax` option is still there for that purpose.

When there's a change, the script will stop polling, print a diff to the command line, send a desktop notification, and immediately open the page in your default browser.

![Notification screenshot](https://raw.githubusercontent.com/timmywil/page-poller/master/page-poller.png)

## Requirements

Requires [Node.js](https://nodejs.org/en/download/) to run.

## Installation

```bash
$ git clone git@github.com:timmywil/page-poller.git
$ cd page-poller
$ npm install
```

## Usage

```bash
$ ./page-poller.js -u https://timmywil.com # Leave open in a terminal and let it run. Ctrl-c to quit.
$ ./page-poller.js --pax east
```

#### Options

```
  --url, -u        URL to poll                                          [string]
  --poll, -p       Poll interval in milliseconds. Minimum is 500.
                                                        [number] [default: 5000]
  --pax            PAX site to poll
                          [choices: "west", "east", "aus", "south", "unplugged"]
  --continual, -c  Continue polling even when there is a change        [boolean]
  --help           Show help
  --version        Show version number
```
