defmodule Mix.Tasks.Labs do
	use Mix.Task

	def run(["ingest-json", fname]) do

		json = case File.exists?(Application.app_dir(:labs, "priv/#{fname}")) do
			true -> File.read!(Application.app_dir(:labs, "priv/#{fname}")) |> Poison.decode!
			false -> File.read!("priv/#{fname}") |> Poison.decode!
		end

		IO.inspect json

	end

	def run(["ingest-csv", fname]) do

		csv = case File.exists?(Application.app_dir(:labs, "priv/#{fname}")) do
			true -> File.stream!(Application.app_dir(:labs, "priv/#{fname}")) |> CSV.decode!
			false -> File.stream!("priv/#{fname}") |> CSV.decode!
		end

		IO.inspect csv

	end
end