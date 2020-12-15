defmodule Labs.Router do
	@moduledoc """
	This is a sample Router page for implementing RESTful http endpoints
	"""

	use Plug.Router

	plug :match
	plug :dispatch

	# forward "/analytics", to: EdMarkaz.Server.Analytics

	# model 1 - jj

	match "/test" do
		fname = "pakistan_indicators.json"
		json = case File.exists?(Application.app_dir(:labs, "priv/#{fname}")) do
			true -> File.read!(Application.app_dir(:labs, "priv/#{fname}")) |> Poison.decode!
			false -> File.read!("priv/#{fname}") |> Poison.decode!
		end

		json_string = Poison.encode!(json)

		send_resp(conn, 200, Poison.encode!(json))
	end

	match "/stream-response" do

		conn = conn
		|> put_resp_header("content-type", "application/json")
		|> send_chunked(200)

		File.stream!("priv/pakistan_indicators.json")
		|> Enum.reduce_while(conn, fn (chunk, conn) ->
			case Plug.Conn.chunk(conn, chunk) do
				{:ok, conn} ->
					{:cont, conn}
				{:error, :closed} ->
					{:halt, conn}
			end
		end)

	end

	match "/file/:fname" do

		path = case File.exists?(Application.app_dir(:labs, "priv/#{fname}")) do
			true -> Application.app_dir(:labs, "priv/#{fname}")
			false -> "priv/#{fname}"
		end

		conn
		|> send_file(200, path)
	end

	match "/favicon.ico" do
		send_resp(conn, 404, "no favicon")
	end

	match "/" do
		send_resp(conn, 200, "hello from plug")
	end
end