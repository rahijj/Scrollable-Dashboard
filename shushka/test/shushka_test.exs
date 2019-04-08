defmodule ShushkaTest do
  use ExUnit.Case
  doctest Shushka

  test "greets the world" do
    assert Shushka.hello() == :world
  end
end
