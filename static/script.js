const data_ready = [false,false,false,false]

document.addEventListener("DOMContentLoaded",() => {
  setInterval(() => {
    for(let i=1;i<5;i++){
      if(!data_ready[i-1]){
        const washer_elem = document.getElementById(`M${i}.remaining-time`)
        const dots = washer_elem.textContent.match(/\./g)
        if(dots && dots.length == 3){
          washer_elem.textContent = "Timp rămas: Se încarcă"
        }
        washer_elem.textContent+="."
      }
    }
  },200)
})

for(let i=1;i<5;i++){
  fetch(`/washer-info/${i}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Cann't get the data!")
      }
      return response.json()
    })
    .then(data => {
      const washer_elem = document.getElementById(`M${i}.remaining-time`)
      washer_elem.textContent = "Timp rămas: "+data[`M${i}`]
      data_ready[i-1] = true
    })
    .catch(error => {
      console.error("Error: ",error)
    });
}