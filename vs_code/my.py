import asyncio
import websockets
import mysql.connector
import json
mydb = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="saradhi@2005",
    database="firstdb"
)
mycursor = mydb.cursor()
async def handler(websocket, path):
    
    try:
        
        while True:
            data = await websocket.recv()
            print(data)
            
            if data == 'Connection Established':
                # If the received data is a string, handle it accordingly
                data1 = await clientopen(data)
                mydb.commit()
                reply = json.dumps(data1)
                await websocket.send(reply)
                print("sent successfully?")
            elif isinstance(data, str):
                parts = data.split(',')
                if len(parts) == 2:
                    username, streak = parts
                    print(username+streak)
                    print(streak)
                    streak = int(streak)
                    update_query = "UPDATE userinfo SET winstreak = %s WHERE username = %s"
                    mycursor.execute(update_query, (streak, username))
                    mydb.commit()
                elif len(parts) == 1:
                    username = parts[0]
                # Split the data by comma to create a list
                    print(username)
                    print("it came here")
                    query = f"SELECT winstreak FROM userinfo WHERE username = '{username}'"
                    mycursor.execute(query)
                    result = mycursor.fetchone()
                    
                    print(result)
                    if result==None:
                        result=0
                    result1=result[0]
                    result1=str(result1)
                    print(result1)
                    await websocket.send(result1)

                 # Execute the SQL query
                
            else:
                # Handle other data types or error cases
                print(data)
                await websocket.send(json.dumps(reply))
            
        
    except websockets.ConnectionClosedError:
        print("Connection closed.")

async def clientopen(data):
    arr = []
    query = "SELECT username, winstreak FROM userinfo ORDER BY winstreak DESC LIMIT 5"  # Get the top 5 highest winstreaks along with usernames
    mycursor.execute(query)
    result = mycursor.fetchall()
    print(result)
    for row in result:
        username = row[0]  # Username
        winstreak = row[1]  # Winstreak
        print(f"Username: {username}, Winstreak: {winstreak}")
        arr.append((username, winstreak))
    return arr


start_server = websockets.serve(handler, "localhost", 8000)
asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever()