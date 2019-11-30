defmodule EdMarkaz.Slack do
	use Tesla

	plug Tesla.Middleware.BaseUrl, "https://hooks.slack.com/services/" <> System.get_env("SLACK_TOKEN")

	def send_alert(alert_message) do
		EdMarkaz.Slack.send_alert(alert_message, "#platform")
	end

	def send_alert(text, channel) do

		encoded = Poison.encode!(%{
			"text" => text,
			"channel" => channel,
			"username" => "platform-bot",
			"icon_emoji" => ":robot_face:"
		})

		{:ok, _response } = post("", encoded)
	end

end