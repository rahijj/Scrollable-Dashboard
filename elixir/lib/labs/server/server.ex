defmodule Labs.Router do
	use Plug.Router

	plug :match
	plug :dispatch

	# forward "/analytics", to: EdMarkaz.Server.Analytics

	match "/" do
		send_resp(conn, 200, "hello from plug")
	end
end