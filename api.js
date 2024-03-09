const TOKEN=process.env.TOKEN
const washers=[
  {"name": "M1","id": process.env.M1},
  {"name": "M2","id": process.env.M2},
  {"name": "M3","id": process.env.M3},
  {"name": "M4","id": process.env.M4}
]

for(const washer of washers){
  fetch(`https://api.smartthings.com/v1/devices/${washer.id}/status`,{
    "method": "GET",
    "headers": {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    }
  })
    .then(response => {
      if (!response.ok) {
          throw new Error("Error: ",response.statusText)
      }
      return response.json()
    })
    .then(data => {
      const datas=data.components.main["samsungce.washerOperatingState"]
      const washer_elem=document.getElementById(`${washer.name}.remaining-time`)
      washer_elem.textContent+=
        datas.operatingState.value=="running" ?
        data.components.main["samsungce.washerOperatingState"].remainingTimeStr.value :
        "Oprit"
    })
    .catch(error => {
      console.error(error)
    })
}