import asyncio
import websockets
import mysql.connector
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
            if isinstance(data, str):
                # If the received data is a string, handle it accordingly
                data1= await clientopen(data)
                mydb.commit()
                reply = f"{data1}"
            else:
                # Handle other data types or error cases
                reply = f"{data1}"
            
            await websocket.send(reply)
    except websockets.ConnectionClosedError:
        print("Connection closed.")

async def clientopen(data):
    arr=[]
    query = "select * from number"
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