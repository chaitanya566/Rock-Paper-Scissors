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
# create handler for each connection
i=0
async def handler(websocket, path):
    
    global i
    try:
        while True:
            data = await websocket.recv()
            print(data)
            i=i+1
            if isinstance(data, str):
                # If the received data is a string, handle it accordingly
                data1= await button1press(data)
                mydb.commit()
                reply = f"{data1}"
            elif isinstance(data, dict):
                # If the received data is a dictionary (object), handle it accordingly
                # For example, you might expect a JSON object.
                reply = f"{data1}"
            else:
                # Handle other data types or error cases
                reply = f"{data1}"
            
            await websocket.send(reply)
    except websockets.ConnectionClosedError:
        print("Connection closed.")

async def button1press(data):
    if data=="button1":
        sql = "UPDATE number SET number1=number1+1 WHERE id = 1"
        mycursor.execute(sql)
        return str("you pressed button 1")
    if data=="button2":
        sql = "UPDATE number SET number2=number2+1 WHERE id = 1"
        mycursor.execute(sql)
        return str("you pressed button 2")
    if data=="button3":
        sql = "UPDATE number SET number3=number3+1 WHERE id = 1"
        mycursor.execute(sql)
        return str("you pressed button 3")
    else:
        return str("something else came")
    
    

start_server = websockets.serve(handler, "localhost", 8000)
asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever()