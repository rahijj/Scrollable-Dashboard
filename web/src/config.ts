
const debug_url = "localhost:8080"

export function get_host(): string {

	// @ts-ignore
	return window.api_url || debug_url;
}
