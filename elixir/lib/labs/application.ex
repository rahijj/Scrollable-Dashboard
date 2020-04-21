defmodule Labs.Application do
	# See https://hexdocs.pm/elixir/Application.html
	# for more information on OTP Applications
	@moduledoc false

	use Application

	def start(_type, _args) do
	# List all child processes to be supervised
	children = [
	  # Starts a worker by calling: Labs.Worker.start_link(arg)
	  # {Labs.Worker, arg}
	  { Registry, keys: :duplicate, name: Labs.ConnectionRegistry },
	  { Registry, keys: :unique, name: Labs.SyncrRegistry },
	  {
			Postgrex,
			name: Labs.DB,
			 hostname: System.get_env("POSTGRES_HOST") || "localhost",
			 username: "postgres",
			 password: System.get_env("POSTGRES_PASS") || "postgres",
			 database: "postgres",
			 port: System.get_env("POSTGRES_PORT") || "5432",
			 types: Labs.PostgrexTypes,
			 pool_size: 10
	  },
		Plug.Adapters.Cowboy.child_spec(
				scheme: :http,
				plug: Labs.Router,
				dispatch: dispatch,
				port: 8080)
	]

	# See https://hexdocs.pm/elixir/Supervisor.html
	# for other strategies and supported options
	opts = [strategy: :one_for_one, name: Labs.Supervisor]
	Supervisor.start_link(children, opts)
  end

  defp dispatch do
	[
		{:_, [
			{"/ws", Labs.Websocket, []},
			{:_, Plug.Cowboy.Handler, {EdMarkaz.Router, []}}
			# {"/", EdMarkaz.Server.OK, []},
			# {"/analytics/:type", EdMarkaz.Server.Analytics, []},
			# {"/masking", EdMarkaz.Server.Masking, []}
		]}
	]
end
end
