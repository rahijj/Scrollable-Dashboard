defmodule EdMarkaz.Contegris do
	@moduledoc """
	A simple set of functions to send SMS messages through the contegris service.

	This requires the CONTEGRIS_USER and CONTEGRIS_PASS environment variables to be set
	"""
	use Tesla

	plug Tesla.Middleware.BaseUrl, "http://c5.contegris.com:4000/api"
	plug Tesla.Middleware.JSON, engine: Poison

	def send_sms("03" <> number, text) do
		send_sms("923" <> number, text)
	end

	def send_sms(number, text) do

		# TODO: use elixir config instead of get_env
		encoded = %{
			"username" => System.get_env("CONTEGRIS_USER"),
			"password" => System.get_env("CONTEGRIS_PASS"),
			"sender" => "ilmExchange",
			"receiver" => number,
			"message" => text
		}

		case post("sendSMS", encoded) do
			{:ok, res} -> {:ok, res.body}
			{:error, err} ->
				IO.puts "SEND SMS ERROR to #{number}"
				IO.inspect text
				{:error, err}
		end
	end

end