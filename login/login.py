import asyncio
import websockets
import mysql.connector
import json
mydb = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="Enter-Your_password_here",
    database="firstdb"
)
mycursor = mydb.cursor()
async def handler(websocket, path):
    try:
        while True:
            data = await websocket.recv()
            print(data)
            logindata="login false"
            if isinstance(data, str) and ',' in data:
                # Split the data by comma to create a list
                data = data.split(',')
                print("it came here")
                query = f"SELECT * FROM userinfo WHERE username = '{data[0]}'"
                mycursor.execute(query)
                result = mycursor.fetchall()
                 # Execute the SQL query
                print(result)
                print(data)
                if result:
                    # Check if the retrieved password matches the provided password
                    if result[0][1] == data[1]:
                        print("login successful")
                        logindata="login true"
                        await websocket.send(json.dumps(logindata))
                        await websocket.close()
                    else:
                        print("login failed: Incorrect password")
                        await websocket.send(json.dumps(logindata))
                else:
                    print("login failed: User not found")
                    await websocket.send(json.dumps(logindata))
                print("Received array:", data)
                
            elif data == 'Connection Established':
                # If the received data is a string, handle it accordingly
                data1 = await clientopen(data)
                mydb.commit()
                reply = json.dumps(data1)
                await websocket.send(reply)
            else:
                # Handle other data types or error cases
                reply = f"{data1}"
                await websocket.send(json.dumps(reply))
            
        
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


start_server = websockets.serve(handler, "localhost", 8888)
asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever()