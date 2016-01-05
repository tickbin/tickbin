
import PouchDB from 'pouchdb'
import conf from './config'

const db = new PouchDB(conf.db)
PouchDB.sync(db, 'http://dockerhost:5984/mydb')
export default db
