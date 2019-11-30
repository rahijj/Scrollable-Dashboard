defmodule LabsTest do
  use ExUnit.Case
  doctest Labs

  test "greets the world" do
    assert Labs.hello() == :world
  end
end
