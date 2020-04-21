defmodule Labs.Router do
	use Plug.Router

	plug :match
	plug :dispatch

	# forward "/analytics", to: EdMarkaz.Server.Analytics

	match "/" do
		send_resp(conn, 200, "hello from plug")
	end

end

defmodule Labs.Server do

	def start_link(_opts) do

		IO.puts "starting server"

		{:ok, _} = :cowboy.start_clear(
			:http,
			[{ :port, 8080 }],
			%{
				:env => %{ :dispatch => config() }
			}
		)

	end

	def config do
		:cowboy_router.compile([
			{:_, [
				{"/ws", Labs.Websocket, []},
				{"/", Labs.Server.OK, []}
			]}
		])
	end

	def child_spec(_opts) do
		import Supervisor.Spec
		worker(__MODULE__, [12_000])
	end
end

defmodule Labs.Server.OK do
	def init(req, state) do
		req = :cowboy_req.reply(200, req)
		{:ok, req, state}
	end
end