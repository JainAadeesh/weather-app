// const url = 'https://weather-api138.p.rapidapi.com/weather?city_name=goa';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'x-rapidapi-key': '00211c4191msh0c533e4eddd4469p11cf59jsnfb7996d59ba6',
// 		'x-rapidapi-host': 'weather-api138.p.rapidapi.com'
// 	}
// };

//     async function fetchData() {
//         try {
//             const response = await fetch(url, options);
//             const data = await response.json();
//             console.log(data);
            
            
//             // Select the div
//             const weatherDiv = document.getElementById("nam");

//             // Update the div with fetched data
//             weatherDiv.innerHTML = `
//                     <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
//                     <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
//                     <p><strong>Weather:</strong> ${data.weather[0].description}</p>
//             `;
//         } catch (error) {
//             document.getElementById("nam").innerHTML = "Error fetching data!";
//             console.error("Error fetching data:", error);
//         }
//     }

//     fetchData();




    let arr = [1,2,3,4];
   let me = arr.map(num=>[num,num*num])
   console.log(me);
   