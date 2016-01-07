# tickbin
time tracking, for developers

Use natural language and simple text based interfaces to track time on projects.

## goals
tickbin is a simple time tracking application with an emphasis on minimizing
disruption to the user. It accomplishes this by:

* natural language input (no need to fill out forms or click buttons)
* quick in and out interfaces (text based interfaces wherever users work: cli, slack, alfred)
* offline priority (internet should not be a requirement)

tickbin emphasizes user data ownership:

* open source client with local data storage
* optional self hosted data replication (via couchdb)
* premium integrations via hosted service for portability

## Remote sync

To sync with a remote database, add the following to `~/.tickbin/config`:

```
remote=http://user:pass@host:port/dbname
```

Any tickbin commands you run will sync your database with the remote server.

## Building

To build the application:

```bash
$ npm install
$ npm run build
$ ./bin/tick --help
```
