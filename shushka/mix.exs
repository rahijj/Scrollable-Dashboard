defmodule Shushka.MixProject do
  use Mix.Project

  def project do
    [
      app: :shushka,
      version: "0.1.0",
      elixir: "~> 1.8",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger],
      mod: {Shushka.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
		{:poison, "~> 3.0"},
		{:csv, "~> 2.3"},
		{:distillery, "~> 2.0"},
		{:cowboy, "~> 2.2", override: true, manager: :rebar3},
		{:uuid, "~> 1.1"},
		{:postgrex, "~>0.13.3"},
		{:dynamic, github: "ironbay/dynamic", sparse: "elixir"}
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end
end
