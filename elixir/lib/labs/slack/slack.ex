defmodule Labs.Slack do
	@moduledoc """
	Provides a simple set of functions for interacting with Slack

	Requires SLACK_TOKEN environment variable to be set
	"""

	use Tesla

	# TODO: use elixir config to get value
	plug Tesla.Middleware.BaseUrl, "https://hooks.slack.com/services/" <> System.get_env("SLACK_TOKEN")

	def send_alert(text, channel) do

		encoded = Poison.encode!(%{
			"text" => text,
			"channel" => channel,
			"username" => "labs-bot",
			"icon_emoji" => ":robot_face:"
		})

		{:ok, _response } = post("", encoded)
	end

end