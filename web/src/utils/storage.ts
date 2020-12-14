import { get, set } from 'idb-keyval'
import { v4 } from 'uuid'

const client_type = "dashboard"
export const saveDB = (db: RootReducerState) => {

	try {
		saveAuth(db.auth)
		saveSyncState(db.sync_state)
		saveSnapshot(db.last_snapshot)
		saveQueue(db.queued)
	}

	catch (err) {
		console.error(err)
	}
}

const saveQueue = (queue: RootReducerState['queued']) => {
	localStorage.setItem("queued", JSON.stringify(queue))
}

const loadQueue = () => {
	return JSON.parse(localStorage.getItem("queued") || "{}") as RootReducerState['queued']
}

export const saveAuth = (auth: RootReducerState['auth']) => {
	localStorage.setItem("auth", JSON.stringify(auth))
}

export const loadAuth = (): RootReducerState['auth'] => {

	const init_auth: RootReducerState['auth'] = {
		id: undefined,
		token: undefined,
		client_type
	};

	try {
		const str = localStorage.getItem("auth")
		if (str === null) {
			return init_auth;
		}

		return JSON.parse(str);
	}
	catch (err) {
		console.error(err);
		return init_auth;
	}
}

const saveSnapshot = (last_snapshot: number) => {
	//@ts-ignore
	localStorage.setItem("last_snapshot", last_snapshot);
}

const loadSnapshot = () => {
	return parseInt(localStorage.getItem("last_snapshot") || "0")
}

const loadClientId = () => {

	const client_id = localStorage.getItem("client_id") || v4();
	localStorage.setItem("client_id", client_id)

	return client_id;
}

const saveSyncState = (sync_state: RootReducerState['sync_state']) => {
	set('sync_state', sync_state)
		.then(() => console.log('saved sync_state'))
		.catch(() => console.error('error saving sync_state'))
}

const loadSyncState = () => {
	return get<RootReducerState['sync_state']>('sync_state')
}

export const loadDBAsync = () => {
	// add more functions if there are additional
	// items to be loaded async

	return Promise.all([
		loadSyncState()
	])
		.then(([sync_state]) => {
			return {
				sync_state
			}
		})
}

export const loadDBSync = (): RootReducerState => {

	return {
		client_id: loadClientId(),
		auth: loadAuth(),
		queued: loadQueue(),
		accept_snapshot: false,
		last_snapshot: loadSnapshot(),
		connected: false,
		sync_state: undefined // loaded async
	}
}
