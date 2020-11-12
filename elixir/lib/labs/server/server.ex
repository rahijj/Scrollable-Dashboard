defmodule Labs.Router do
	@moduledoc """
	This is a sample Router page for implementing RESTful http endpoints
	"""

	use Plug.Router

	plug :match
	plug :dispatch

	# forward "/analytics", to: EdMarkaz.Server.Analytics

	match "/" do
		send_resp(conn, 200, "hello from plug")
	end
end