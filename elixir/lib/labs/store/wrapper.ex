defmodule Labs.DB.Postgres do
	@moduledoc """
	This module wraps the Postgrex module ensuring that the connection pool managed by Poolboy is used
	"""
	def query(db, querystring, params, opts \\ []) do
		Postgrex.query(db, querystring, params, pool: DBConnection.Poolboy)
	end
end