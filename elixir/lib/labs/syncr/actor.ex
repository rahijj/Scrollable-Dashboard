defmodule Labs.Syncr do
	@moduledoc """
	A module which enables in memory syncing of an object through the sending of mutations
	"""
	use GenServer

	def init(args) do
		{:ok, args}
	end

	def start_link({id}) do
		IO.puts "initting actor #{id}"

		{db, writes} = Labs.Store.Syncr.load(id)
		GenServer.start_link(
			__MODULE__,
			{id, writes, db},
			name: {:via, Registry, {Labs.SyncrRegistry, id}})
	end

	# API

	def sync_changes(id, client_id, changes, last_sync_date) do
		GenServer.call(via(id), {:sync_changes, client_id, changes, last_sync_date})
	end

	def get_db(id) do
		GenServer.call(via(id), {:get_db})
	end

	# SERVER

	def handle_call({:reload_db}, _from, {id, writes, db} = state) do
		{new_db, new_writes} = Sarkar.Store.Syncr.load(id)

		{:reply, new_db, {id, new_writes, new_db}}
	end

	def handle_call({:sync_changes, client_id, changes, last_sync_date}, _from, {id, writes, db} = state) do

		# map of changes.
		# key is path separated by comma
		# value is { action: {path, value}, date}

		# make sure we aren't missing any writes between last sync_date and the least path_date.

		# This is happening way more than expected. It should only happen for very out of date clients - which should not be the case in 1 day and no GC
		min_write_date = if writes != %{} do

			{_, %{"date" => mwd }} = writes
				|> Enum.min_by(fn {path_string, %{"date" => path_date}} -> path_date end)

			mwd
		end

		have_all_in_memory? = min_write_date < last_sync_date

		writes = if not have_all_in_memory? do
				case Sarkar.Store.Syncr.get_writes(id, last_sync_date) do
					{:ok, aug_writes} ->
						# whats in aug_writes that isnt in writes??
						IO.puts "SUCCESSFUL DB RECOVERY @ #{:os.system_time(:millisecond)}. last_sync_date: #{last_sync_date} min_write_date: #{min_write_date}"
						aug_writes
					{:error, err} ->
						IO.puts "ERROR ON DB RECOVERY"
						IO.inspect err
						writes
				end
		else
			writes
		end

		# end weird section

		# TODO: sort changes by time and process in order.

		{nextDb, nextWrites, new_writes, last_date} = changes
		|> Enum.sort(fn({ _, %{"date" => d1}}, {_, %{"date" => d2}}) -> d1 < d2 end)
		|> Enum.reduce(
			{db, writes, %{}, 0},
			fn({path_key, payload}, {agg_db, agg_writes, agg_new_writes, max_date}) ->

				%{
					"action" => %{
						"path" => path,
						"type" => type,
						"value" => value
					},
					"date" => date
				} = payload

				[prefix | p ] = path

				p_key = Enum.join(p, ",")
				write = %{
					"date" => date,
					"value" => value,
					"path" => path,
					"type" => type,
					"client_id" => client_id
				}

				case type do
					"MERGE" ->
						case Map.get(agg_writes, p_key) do
							nil ->
								{
									Dynamic.put(agg_db, p, value),
									Map.put(agg_writes, p_key, write),
									Map.put(agg_new_writes, p_key, write),
									max(date, max_date)
								}
							%{"date" => prev_date, "value" => prev_value} when prev_date <= date ->
								{
									Dynamic.put(agg_db, p, value),
									Map.put(agg_writes, p_key, write),
									Map.put(agg_new_writes, p_key, write),
									max(date, max_date)
								}
							%{"date" => prev_date, "value" => prev_value} when prev_date > date ->
								IO.puts "#{id}: #{prev_date} is more recent than #{date}. current time is #{:os.system_time(:millisecond)}"
								# IO.inspect write
								{
									agg_db,
									agg_writes,
									agg_new_writes,
									max_date
								}
							other ->
								IO.puts "OTHER!!!!!!!!!!!!!"
								IO.inspect other
								{
									Dynamic.put(agg_db, p, value),
									Map.put(agg_writes, p_key, write),
									Map.put(agg_new_writes, p_key, write),
									max(date, max_date)
								}
						end

					"DELETE" ->
						case Map.get(agg_writes, p_key) do
							nil ->
								{
									Dynamic.delete(agg_db, p),
									Map.put(agg_writes, p_key, write),
									Map.put(agg_new_writes, p_key, write),
									max(date, max_date)
								}
							%{"date" => prev_date} when prev_date <= date ->
								{
									Dynamic.delete(agg_db, p),
									Map.put(agg_writes, p_key, write),
									Map.put(agg_new_writes, p_key, write),
									max(date, max_date)
								}
							%{"date" => prev_date} when prev_date > date ->
								{
									agg_db,
									agg_writes,
									agg_new_writes,
									max_date
								}
							other ->
								IO.puts "OTHER!!!!!!!!!!!"
								IO.inspect other
								{
									Dynamic.delete(agg_db, p),
									Map.put(agg_writes, p_key, write),
									Map.put(agg_new_writes, p_key, write),
									max(date, max_date)
								}
						end
					other ->
						IO.puts "unrecognized type"
						{agg_db, max_date}
				end
			end)

		# at this point we need to send the new snapshot to all clients that are up to date.

		# each client has sent its "last received data" date.
		# when it connects, we should send all the latest writes that have happened since then, not the full db.
		# get that data for it here.

		relevant = nextWrites
					|> Enum.filter(fn {path_string, %{"date" => path_date, "client_id" => cid }} ->

						old = path_date > last_sync_date and not Map.has_key?(new_writes, path_string)
						new = old and cid != client_id

						# if old and not new do
						# 	IO.puts "this would have been sent before but not now"
						# 	IO.inspect path_string
						# end

						old and new
					end)
					|> Enum.into(%{})

		case map_size(new_writes) do
			0 -> {:reply, confirm_sync_diff(last_date, relevant), {id, nextWrites, nextDb}}
			_ ->
				broadcast(id, client_id, snapshot_diff(new_writes))
				Sarkar.Store.Syncr.save(id, nextDb, new_writes)
				{:reply, confirm_sync_diff(last_date, relevant), {id, nextWrites, nextDb}}
		end
	end

	def handle_call({:get_db}, _from, {id, writes, db} = state) do
		{:reply, db, state}
	end

	def handle_call(a, b, c) do
		IO.inspect a
		IO.inspect b
		IO.inspect c

		{:reply, "no match...", c}
	end

	# generates action
	defp snapshot(db) do
		%{
			type: "SNAPSHOT",
			db: db
		}
	end

	defp snapshot_diff(new_writes) do
		%{
			type: "SNAPSHOT_DIFF",
			new_writes: new_writes
		}
	end

	defp confirm_sync_diff(date, new_writes) do
		%{
			type: "CONFIRM_SYNC_DIFF",
			date: date,
			new_writes: new_writes # client should only have to check these against queued / pending writes.
		}
	end

	defp confirm_sync(date, db) do
		%{
			type: "CONFIRM_SYNC",
			date: date,
			db: db
		}
	end

	defp rpc_succeed(new_writes) do
		%{
			type: "RPC_SUCCEED",
			new_writes: new_writes
		}
	end

	defp via(id) do
		{:via, Registry, {Sarkar.SyncrRegistry, id}}
	end

	defp broadcast(id, sender_id, message) do

		Registry.lookup(Sarkar.ConnectionRegistry, id)
		|> Enum.filter(fn {pid, client_id}-> client_id != sender_id end)
		|> Enum.map(fn {pid, _} -> send(pid, {:broadcast, message}) end)

	end
end