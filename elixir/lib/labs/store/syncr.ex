defmodule Labs.Store.Syncr do
	use GenServer

	# this module exists to provide sync/restore capabilities for clients
	# this is not for data-sharing

	def init(args) do
		{:ok, args}
	end

	def start_link(_opts) do
		GenServer.start_link(__MODULE__, {}, name: :syncr_db)
	end

	def save(id, db) do
		GenServer.cast(:syncr_db, {:save, id, db})
	end

	def save(id, db, writes) do
		GenServer.cast(:syncr_db, {:save, id, db})
		GenServer.cast(:syncr_db, {:save_writes, id, writes})
	end

	def load(id) do
		GenServer.call(:syncr_db, {:load, id})
	end

	def get_writes(id, last_sync_date) do
		GenServer.call(:syncr_db, {:get_writes, id, last_sync_date})
	end

	# modify this to return db + (last 50) writes writes map of path, value, data, type
	def handle_call({:load, id}, _from, state) do
		case Postgrex.query(
			Labs.DB,
			"SELECT sync_state from sync_store where id=$1", [id]) do
				{:ok, %Postgrex.Result{num_rows: 0}} -> {:reply, {%{}, %{}}, state}
				{:ok, resp} ->
					[[db]] = resp.rows

					case Postgrex.query(Labs.DB, "SELECT path, value, time, type, client_id FROM writes WHERE id=$1 ORDER BY time desc limit $2", [id, 50]) do
						{:ok, writes_resp} ->
							write_formatted = writes_resp.rows
								|> Enum.map(fn([ [_ | p] = path, value, time, type, client_id]) -> {Enum.join(p, ","), %{
									"path" => path, "value" => value, "date" => time, "type" => type, "client_id" => client_id
								}} end)
								|> Enum.reverse
								|> Enum.into(%{})

							{:reply, {db, write_formatted}, state}
						{:error, err} -> {:reply, {:error, err}, state}
					end
				{:error, err} ->
					IO.inspect err
					{:reply, {:error, err}, state}
		end
	end

	def handle_call({:get_writes, id, last_sync_date}, _from, state) do
		case Postgrex.query(
			Labs.DB,
			"SELECT path, value, time, type, client_id FROM writes where id=$1 AND time > $2 ORDER BY time desc",
			[id, last_sync_date]) do
				{:ok, writes_resp} ->
					write_formatted = writes_resp.rows
						|> Enum.map(fn([ [_ | p] = path, value, time, type, client_id]) -> {Enum.join(p, ","), %{
							"path" => path, "value" => value, "date" => time, "type" => type, "client_id" => client_id
						}} end)
						|> Enum.reverse
						|> Enum.into(%{})

					{:reply, {:ok, write_formatted}, state}

				{:error, err} -> {:reply, {:error, err}, state}
		end
	end

	def handle_cast({:save, id, db}, state) when db == %{} do
		# ignore empty db save
		{:noreply, state}
	end

	def handle_cast({:save, id, db}, state) do

		case Postgrex.query(
			Labs.DB,
			"INSERT INTO sync_store (id, sync_state) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET sync_state=$2",
			[id, db]) do
				{:ok, resp} -> {:noreply, state}
				{:error, err} ->
					IO.puts "write failed"
					IO.inspect err
					{:noreply, state}
		end
	end

	def handle_cast({:save_writes, id, writes}, state) do

		gen_value_strings = Stream.with_index(Map.values(writes), 1)
			|> Enum.map(fn {w, i} ->
				x = (i - 1) * 6 + 1
				"($#{x}, $#{x + 1}, $#{x + 2}, $#{x + 3}, $#{x + 4}, $#{x + 5})" end)

		flattened_writes = Map.values(writes)
			|> Enum.map(fn %{"date" => date, "value" => value, "path" => path, "type" => type, "client_id" => client_id} ->
				[id, path, value, date, type, client_id]
			end)
			|> Enum.reduce([], fn curr, agg -> Enum.concat(agg, curr) end)

		case Postgrex.query(
			Labs.DB,
			"INSERT INTO writes (id, path, value, time, type, client_id) VALUES #{Enum.join(gen_value_strings, ",")}",
			flattened_writes) do
				{:ok, resp} -> {:noreply, state}
				{:error, err} ->
					IO.puts "write failed"
					IO.inspect err
					{:noreply, state}
			end
	end
end