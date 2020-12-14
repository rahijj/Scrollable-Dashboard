defmodule Labs.Websocket do
	@moduledoc """
	This module wraps low-level websocket behaviour and should not need to be altered.

	It enables reply/request behaviour on websocket messages which are leveraged by the Labs typescript Syncr library
	"""

	@behaviour :cowboy_websocket

	def init(req, state) do
		{:cowboy_websocket, req, %{}}
	end

	def websocket_init(state) do
		{:ok, state}
	end

	def websocket_handle({:text, "ping"}, state) do
		{:ok, state}
	end

	def websocket_handle({:text, content}, state) do
		json = Poison.decode!(content)

		handle_json(json, state)
	end

	def handle_json(%{"key" => message_key, "payload" => %{"type" => type, "payload" => payload} = action}, state) do
		case Labs.ActionHandler.handle_action(action, state) do
			{:reply, %{type: resp_type, payload: msg}, new_state} -> {:reply, {:text, Poison.encode!(%{key: message_key, type: resp_type, payload: msg})}, new_state}
			{:reply, %{type: resp_type}, new_state} -> {:reply, {:text, Poison.encode!(%{key: message_key, type: resp_type, payload: %{}})}, new_state}
			other ->
				IO.puts "unexpectd return from handle_action"
				IO.inspect other
				{:ok, state}
		end
	end

	def handle_json(json, state) do
		IO.puts "got an action in unexpected format"
		IO.inspect json

		# should be a reply
		{:ok, state}
	end

	def websocket_info({:broadcast, json}, state) do
		{:reply, {:text, Poison.encode!(json)}, state}
	end

	def websocket_info(msg, state) do
		IO.inspect msg
	end

	def terminate(_reason, _req, _state) do
		:ok
	end
end