[![wercker status](https://app.wercker.com/status/445b091cc8c834b5b3820d52420b82e7/s "wercker status")](https://app.wercker.com/project/bykey/445b091cc8c834b5b3820d52420b82e7)

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
```

### `tick log` 

display time entries

```shell
tick log # shows you all your time entries for the past week
tick log -d "jan1-31" # shows you time entries for Jan 1-31
tick log -d2 # shows you time entries for the past 2 days (not including today - so 3 days)
tick log -d0 # shows you time entries for today
tick log -t lunch # display entries tagged with #lunch
tick log -t dev design # display entries tagged with #dev AND #design
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

## Remote sync

To sync with a remote database, add the following to `~/.tickbinrc`:

```
remote=http://user:pass@host:port/dbname
```

Run `tick sync` in order to sync your database with your remote server.

## Building

To build the application:

```bash
$ npm install
$ npm run build
$ ./build/tick --help
```

Copyright (C) 2016 MemoryLeaf Media Inc.
