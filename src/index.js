let addToy = false;
//FIND WAY TO SELECT AND ADD EVENTLISTENERS TO ALL THE LIKE BUTTONS 
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyContainer = document.getElementById('toy-collection');
  const toyForm = document.querySelector('form.add-toy-form')
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys()

  toyForm.addEventListener('submit', createToy)

  function createToy(event){
    event.preventDefault()
    const nameField = document.querySelectorAll('form input')[0]
    const imageField = document.querySelectorAll('form input')[1]
    let configObj = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "name": `${nameField.value}`,
        "image": `${imageField.value}`,
        "likes": 0
      })     
    }
    //How come my reset isnt working
    fetch('http://localhost:3000/toys', configObj)
    .then( (resp) => {return resp.json()} )
    .then( (json) => {makeCards(json)} )
    .catch( (error) => {alert(error.message)} )

    toyFormContainer.style.display = "none";
    toyForm.reset
  }

  function fetchToys(){
    fetch('http://localhost:3000/toys')
    .then( (resp) => {return resp.json()} )
    .then( (json) => {makeCards(json)} )
  }

  function makeCards(obj){
    //better way to control this flow??
    if (obj.length === undefined){
      toyContainer.innerHTML += `
      <div class="card">
        <h2>${obj['name']}</h2>
        <img src=${obj['image']} class="toy-avatar" />
        <p><span>${obj['likes']}</span> Likes </p>
        <button class="like-btn">Like <3</button>
      </div> 
      `
      

    } else {
      for (let toyData of obj){
        toyContainer.innerHTML += `
        <div class="card">
          <h2>${toyData['name']}</h2>
          <img src=${toyData['image']} class="toy-avatar" />
          <p><span>${toyData['likes']}</span> Likes </p>
          <button id="${toyData['id']}" class="like-btn">Like <3</button>
        </div> 
        `
      }
    }   
    let likeButtons = toyContainer.querySelectorAll('button')
    likeButtons.forEach(element => 
      element.addEventListener('click', handleLike) 
    )
  }

});





function handleLike(event){
  let likes = event.target.parentElement.querySelector('span').innerText
  let toyID = event.target.id 
  likes++
  event.target.parentElement.querySelector('span').innerText = likes.toString()

  let configObj = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": `${likes}`
    })     
  }

  fetch(`http://localhost:3000/toys/${toyID}`, configObj)
  .then( (resp) => {return resp.json()} )
  .catch( (error) => {alert(error.message)} )



}



// fetch('http://localhost:3000/toys')
//   .then( (resp) => {return resp.json()} )
//   .then( (json) => {
//     for (let toyData of json){
//       for (let attr in toyData){
//         console.log(`${attr}: ${toyData[attr]}`)
//       }
//     }
//   })