[![dependency stats](https://david-dm.org/tickbin/tickbin.svg)](https://david-dm.org/tickbin/tickbin)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

# Deprecation Notice 

**Deprecation notice:** This project and codebase are not maintained. We might revisit this again in the future, but for now the code is read-only :)

# tickbin

A great time tracking tool.

Use natural language and simple text based interfaces to track time on projects.

## Installation

Tickbin requires [Node.js v4.2](https://nodejs.org/en/) or greater.

1. `npm install -g tickbin`
2. `tick --help`

## Usage

### `tick commit` 

commits time entries

```shell
tick commit "8am-12pm fixed a bunch of bugs" # records time for today
tick commit "yesterday 9pm-11pm late night code" # records time for yesterday
tick commit "Jan 1 12am-1am partied!" # records time for Jan 1
tick commit "12pm-1pm great #lunch at Mervo's" # add #tags anywhere
tick commit "4 hours 15 minutes no specific time" # record durations without start/end
```

### `tick log` 

display time entries

```shell
tick log # shows you all your time entries for the past week
tick log -f "jan1-31" # entries for Jan 1-31
tick log -f "jan - feb" # entries for Jan 1-Feb 28
tick log -f "#lunch" # entries tagged with #lunch
tick log -f "#dev and #bug" # entries tagged with #dev AND #bug
tick log -f "#dev or #design" # entries tagged with #dev or #design
tick log -f "#dev and not #nobill" # entries tagged with #dev but not #nobill
tick log -f "#dev or #design May - June" # #dev or #design from May to June
```

### `tick start`

start a timer

```shell
tick start # starts a timer for the current time
tick start "8am" # starts a timer for 8am
tick start "8am squashing some bugs #dev" # starts a timer for 8am and provides a message
```

### `tick stop`

stop a timer and commit an entry

```shell
tick stop # stops a timer and creates an entry for the duration
tick stop "10am" # stops a timer as of 10am
tick stop "10am creating bugs :( #dev" # stops a timer as of 10 and provides a commit message
```

### `tick cancel-timer`

```shell
tick cancel-timer # cancels the current timer without creating an entry
```

### `tick rm` 

remove a time entry

```shell
tick rm 4yKrumkjl # remove time entry with id 4yKrumkjl
```

### `tick register` 

register for a tickbin.com account

```shell
tick register # asks you for username, email, password then creates an account with a couchdb for you
```

### `tick login` 

login to tickbin, sets up syncing

```shell
tick login # asks you for username and password and sets remote in .tickbinrc
```

### `tick sync` 

sync local db with the remote

```shell
tick sync # syncs your local db with the remote db
```

### `tick upgrade` 

upgrades entries between releases

```shell
tick upgrade # upgrades your tickbin database when new tickbin is released
```

## Goals
tickbin is a simple time tracking application with an emphasis on minimizing
disruption to the user. It accomplishes this by:

* natural language input (no need to fill out forms or click buttons)
* quick in and out interfaces (text based interfaces wherever users work: cli, slack, alfred)
* offline priority (internet should not be a requirement)

tickbin emphasizes user data ownership:

* open source client with local data storage
* optional self hosted data replication (via couchdb)
* premium integrations via hosted service for portability

## Local database

Local database path will default to `~/.tickbin`. If you would like to specify a custom location, add the following to `~/.tickbinrc`:

```
local=~/custom/path
```

If you're developing you can add a `.tickbinrc` file to your development directory.

## Remote sync

To sync with a remote database, add the following to `~/.tickbinrc`:

```
remote=http://user:pass@host:port/dbname
```

Run `tick sync` in order to sync your database with your remote server.

Copyright (©) 2017 Two Story Robot Labs Inc.

Lead Maintainer: [Jonathan Bowers](https://github.com/jonotron)
