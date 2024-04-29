const data_ready = [false,false,false,false]

function set_info(id,no_ips){
  const info = document.getElementById(`M${id}.info`)
  if(!no_ips){
    info.innerHTML = "Nimeni nu urmărește această mașină."
  }else if(no_ips == 1){
    info.innerHTML = "O persoană urmărește această mașină!"
  }else{
    info.innerHTML = `
      <p>ATENȚIE!</p>
      <p>${no_ips} urmăresc această mașină!</p>
    `
  }

  localStorage[`M${id}.info`] = info.innerHTML
}

function restore_storage(){
  for(let i=1;i<5;i++){
    const time = document.getElementById(`M${i}.remaining-time`)
    const eye = document.getElementById(`M${i}.eye`)
    const info = document.getElementById(`M${i}.info`)
    const storage_time = localStorage[`M${i}.remaining-time`]
    const storage_eye = localStorage[`M${i}.eye`]
    const storage_info = localStorage[`M${i}.info`]

    if(storage_time){
      time.textContent = storage_time
      data_ready[i-1] = true
    }
    if(storage_eye){
      eye.style.backgroundImage = storage_eye
    }
    if(storage_info){
      info.innerHTML = storage_info
    }
  }
}

document.addEventListener("DOMContentLoaded",() => {
  restore_storage()

  document.querySelectorAll('.follow').forEach(button => {
    button.addEventListener('click',() => {
      const is_closed = button.style.backgroundImage.includes('closed')
      button.style.backgroundImage = 
        `url('static/${is_closed ? "" : "closed_"}eye.svg')`

      fetch(`/followers/${button.id[1]}/${Number(is_closed)}`)
      .then(response => {
        if(!response.ok){
          throw new Error("Cann't get the data!")
        }
        return response.json()
      })
      .then(data => {
        set_info(button.id[1],data["no IPs"])
      })
      .catch(error => {
        console.error("Error: ",error)
      })
    })
  })

  setInterval(() => {
    for(let i=1;i<=4;i++){
      if(!data_ready[i-1]){
        const washer = document.getElementById(`M${i}.remaining-time`)
        const dots = washer.textContent.match(/\./g)
        if(dots && dots.length == 3){
          washer.textContent = "Timp rămas: Se încarcă"
        }
        washer.textContent+="."
      }
    }
  },200)
})

for(let i=1;i<=4;i++){
  fetch(`/washer-info/${i}`)
    .then(response => {
      if(!response.ok){
        throw new Error("Cann't get the data!")
      }
      return response.json()
    })
    .then(data => {
      document.getElementById(`M${i}.remaining-time`).textContent = 
        "Timp rămas: "+data["remaining_time"]
      localStorage[`M${i}.remaining-time`] =
        "Timp rămas: "+data["remaining_time"]
      data_ready[i-1] = true

      set_info(i,data["no IPs"])

      document.getElementById(`M${i}.eye`).style.backgroundImage = 
        `url('static/${!data["follow"] ? "" : "closed_"}eye.svg')`
      localStorage[`M${i}.eye`] =
        `url('static/${!data["follow"] ? "" : "closed_"}eye.svg')`
    })
    .catch(error => {
      console.error("Error: ",error)
    })
}