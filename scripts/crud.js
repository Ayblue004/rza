// DECLARE THE BASE PATH OF THE API
// const basePath = "http://localhost:3000/"

//This is the main function used to get data from the database
const getData =(url)=>
    new Promise((resolve, reject)=>{
        fetch(url)
        .then(response=> response.json())
        .then(json => resolve(json))
        .catch(error => reject(error))
    })

//This is the main function used to send data to the database
function sendData(data, method, path){
    fetch(`${basePath}${path}`, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res =>{
        console.log("Request complete: ",res);
        return res.json();
    })
}


getData(`${basePath}`)
    .then(data => console.log(data))
    .catch(error => console.log(error.message));

// The booking would be done by making sure that each room has their
// booking table, in the table when I call it it returns all the bookings that 
// room have and the dates the user have selected would be checked in that array
// if they clash the room will not be available if they do not it would be
// available
