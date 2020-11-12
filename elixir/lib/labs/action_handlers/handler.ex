defmodule Labs.ActionHandler do
	@moduledoc """
	An action handler template to be overwritten
	"""

	def handle_action(action, state) do

		IO.puts "Action handler not implemented"
		IO.inspect action

		{:reply, fail("action handler not implemented"), state}

	end

	defp fail(message) do
		%{type: "failure", payload: message}
	end

	defp fail() do
		%{type: "failure"}
	end

	defp succeed(payload) do
		%{type: "success", payload: payload}
	end

	defp succeed() do
		%{type: "success"}
	end
end