

fetch("constants.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("File cann't be loaded");
    }
    return response.json();
  })
  .then(data => {
    const TOKEN=data.TOKEN
    const washers=[
      {"name": "M1","id": data.M1},
      {"name": "M2","id": data.M2},
      {"name": "M3","id": data.M3},
      {"name": "M4","id": data.M4}
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
  })
  .catch(error => {
    console.error("Error: ", error);
  });