
import PouchDB from 'pouchdb'
import conf from './config'

const db = new PouchDB(conf.db)
export default db
