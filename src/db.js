
import PouchDB from 'pouchdb'
import conf from './config'

const db = new PouchDB(conf.db)
if (conf.remote) PouchDB.sync(db, conf.remote)
export default db
