from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import aiohttp

from os import getenv

load_dotenv()

TOKEN = getenv("TOKEN")

washers=[
  {"name": "M1","id": getenv("M1")},
  {"name": "M2","id": getenv("M2")},
  {"name": "M3","id": getenv("M3")},
  {"name": "M4","id": getenv("M4")}
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
async def info(id: int):
  return {
    f"M{id}" :
      (
        datas:=await fetch_washer_data(washers[id-1]["id"]),
        datas["remainingTimeStr"]["value"] if datas["operatingState"]["value"] == "running" else "Oprit"
      )[1]
  }