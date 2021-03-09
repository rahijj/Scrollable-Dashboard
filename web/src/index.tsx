import * as React from "react"
import * as ReactDOM from "react-dom"
import "./index.css"
import * as serviceWorker from "./serviceWorker"
import { applyMiddleware, AnyAction, createStore, Store } from "redux"
import thunkMiddleware, { ThunkMiddleware } from "redux-thunk"
import Syncr from "@cerp/syncr"

import Routes from "routes"
import reducer from "reducers"

import { loadDBSync, loadDBAsync, saveDB } from "utils/storage"
import debounce from "utils/debounce"
import { get_host } from "config"

// import { connected, disconnected, LoadAsyncAction } from "actions/core"

const host = get_host()

const initial_state = loadDBSync()

// const syncr = new Syncr(`ws://${host}/ws`)

// @ts-ignore
// syncr.on("connect", () => store.dispatch(connected()))
// syncr.on("disconnect", () => store.dispatch(disconnected()))
// syncr.on("message", (msg: AnyAction) => store.dispatch(msg))

const store: Store<RootReducerState> = createStore(
	reducer,
	initial_state,
	applyMiddleware(
		thunkMiddleware.withExtraArgument(3) as ThunkMiddleware<
			RootReducerState,
			AnyAction,
			Syncr
		>
	)
)

// loadDBAsync().then((val) => {
// 	if (val) {
// 		store.dispatch(LoadAsyncAction(val))
// 	}
// })

const saveBounce = debounce(() => {
	const state = store.getState()
	saveDB(state)
}, 500)

store.subscribe(saveBounce as () => void)
ReactDOM.render(<Routes store={store} />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
	onUpdate: (registration: ServiceWorkerRegistration) => {
		registration.installing &&
			registration.installing.postMessage({
				type: "SKIP_WAITING",
			})
	},
})
