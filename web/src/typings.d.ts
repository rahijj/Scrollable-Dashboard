interface SyncState {}

type SectionProps = {
	width: number
	height: number
	cardInd: number
	data: any
	isVisible: boolean
	headHeight: number
}

interface DataObjType {
	X: string | number | Date
	Y: string | number | Date
	Mean?: Number
	"25 %"?: Number
	"50 %"?: Number
	"75 %"?: Number
	Count?: Number
}
interface RootReducerState {
	sync_state?: SyncState
	auth: {
		id?: string
		token?: string
		client_type: "dashboard"
	}
	client_id: string
	queued: {
		[path: string]: {
			action: {
				path: string[]
				value?: any
				type: "MERGE" | "DELETE"
			}
			date: number
		}
	}
	last_snapshot: number
	accept_snapshot: boolean
	connected: boolean
}
