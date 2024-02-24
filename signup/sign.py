import asyncio
import websockets
import mysql.connector
import json
mydb = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="Enter-Your_password_here",#
    database="firstdb"
)
mycursor = mydb.cursor()
async def handler(websocket, path):
    try:
        while True:
            data = await websocket.recv()
            print(data)
            signdata=False
            if isinstance(data, str) and ',' in data:
                # Split the data by comma to create a list
                data = data.split(',')
                print("it came here")
                sql = "INSERT INTO userinfo (username, password) VALUES (%s, %s)"
                values = (data[0], data[1])
                mycursor.execute(sql, values)  # Execute the SQL query
                mydb.commit()
                print("Received array:", data)
                signdata=True
                reply = json.dumps(signdata)
                await websocket.send(reply)
                await websocket.close()
            elif data == 'Connection Established':
                # If the received data is a string, handle it accordingly
                data1 = await clientopen(data)
                mydb.commit()
                reply = json.dumps(data1)
                await websocket.send(reply)
            else:
                # Handle other data types or error cases
                reply = json.dumps(data1)
                await websocket.send(reply)
            
        
    except websockets.ConnectionClosedError:
        print("Connection closed.")

async def clientopen(data):
    arr=[]
    query = "select username from userinfo"
    mycursor.execute(query)
    result = mycursor.fetchall()
    print(result)
    for row in result:
        column_value = row[0]  # Assuming your_column is the first column in the result
        print(column_value)
        arr.append(column_value)
    return arr


start_server = websockets.serve(handler, "localhost", 8080)
asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever()