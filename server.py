from fastapi import FastAPI,Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import aiohttp

from os import getenv

load_dotenv()

TOKEN = getenv("TOKEN")

washers=[
  {"name": "M1","id": getenv("M1"),"turn": None,"IPs": set()},
  {"name": "M2","id": getenv("M2"),"turn": None,"IPs": set()},
  {"name": "M3","id": getenv("M3"),"turn": None,"IPs": set()},
  {"name": "M4","id": getenv("M4"),"turn": None,"IPs": set()}
]

async def fetch_washer_data(id):
  async with\
    aiohttp.ClientSession() as session,\
    session.get(
      f"https://api.smartthings.com/v1/devices/{id}/components/main/status",
      headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
      }
    ) as response:
      return (await response.json())["samsungce.washerOperatingState"]

app = FastAPI()
app.mount("/static",StaticFiles(directory="static"),name="static")

@app.get("/")
async def home():
  return FileResponse("static/index.html")

@app.get("/washer-info/{id}")
async def info(id: int,request: Request):
  data = await fetch_washer_data(washers[id-1]["id"])
  last_turn = washers[id-1]["turn"]
  washers[id-1]["turn"] =\
    data["operationTime"]["timestamp"] if data["operatingState"]["value"] == "running" else None

  if last_turn != washers[id-1]["turn"]:
    washers[id-1]["IPs"] = set()

  return {
    "remaining_time":
      data["remainingTimeStr"]["value"] if data["operatingState"]["value"] == "running" else "Oprit",
    "no IPs": len(washers[id-1]["IPs"]),
    "follow": request.client.host in washers[id-1]["IPs"]
  }

@app.get("/followers/{id}/{close}")
async def followers(id: int,close: int,request: Request):
  if close:
    washers[id-1]["IPs"].remove(request.client.host)
  else:
    washers[id-1]["IPs"].add(request.client.host)

  return {"no IPs": len(washers[id-1]["IPs"])}  