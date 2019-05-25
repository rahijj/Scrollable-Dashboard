defmodule Shushka.ActionHandler do

	def handle_action(action, state) do

		IO.inspect action

		# TODO: copy succeed / fail functions from other projects
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