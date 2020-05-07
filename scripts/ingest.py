import psycopg2 as pg
import json

import secret_config

conn = pg.connect(dbname="postgres", user="postgres", host="localhost",
                  password=secret_config.pg_password)
cur = conn.cursor()

with open("pak_data.json") as f:
    pak_data = json.load(f)

# ingest raw data
rows = []
for dist, data in pak_data.items():
    for indicator, val in data.items():
        # print(dist + ", " + indicator + ", " + str(val))
        rows.append([dist, indicator, val])
        cur.execute(
            """INSERT INTO pak_data (district, indicator, value)
            VALUES (%s, %s, %s);""", (dist, indicator, val))

# very important!
conn.commit()

# can then update derived tables...
# ex group by district, do some stuff

cur.close()
conn.close()
