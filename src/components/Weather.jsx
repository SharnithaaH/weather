import React, { useEffect, useState, useRef } from 'react'
import './Weather.css'

import drizzle_icon from '../assets/drizzle.png'
import cloud_icon from '../assets/cloud.png'
import snow_icon from '../assets/snow.png'
import rainy_icon from '../assets/rainy.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'
import clear_icon from '../assets/clear.png'
import search_icon from '../assets/search.png'


const Weather = () => {
  const inputRef = useRef()
  const[weatherData, setWeatherData]=useState(false);
  const [clothingSuggestion, setClothingSuggestion] = useState("");

  const allIcons={
    "01d" : clear_icon,
    "01n" : clear_icon,
    "02d" : cloud_icon,
    "02n" : cloud_icon,
    "03d" : drizzle_icon,
    "03n" : drizzle_icon,
    "04d" : drizzle_icon,
    "04n" : drizzle_icon,
    "09d" : rainy_icon,
    "09n" : rainy_icon,
    "10d" : rainy_icon,
    "10n" : rainy_icon,
    "13d" : snow_icon,
    "13n" : snow_icon,
  }
  function suggestClothing(temp, condition) {
  if (temp > 30) {
    if (condition === "Clear" || condition === "Clouds") {
      return "It's quite hot and sunny. Lightweight cotton clothing and sunglasses are recommended.";
    } else if (condition === "Rain") {
      return "Warm and rainy weather. Opt for breathable fabrics and keep an umbrella handy.";
    }
  } else if (temp >= 20 && temp <= 30) {
    return "Mild weather. Comfortable attire such as t-shirts and jeans would be appropriate.";
  } else if (temp < 20) {
    if (condition === "Rain" || condition === "Snow") {
      return "Cold and wet conditions. A warm jacket and waterproof footwear are advised.";
    } else {
      return "Cool weather. Consider wearing a sweater or hoodie to stay warm.";
    }
  } else {
    return "Please dress appropriately based on your comfort and local weather conditions.";
  }
}


  const search = async (city)=>{
    if(city === ""){
      alert("Enter City Name");
      return;
    }
    try{
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json(url);
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon;

      const temperature = Math.floor(data.main.temp);
      const condition = data.weather[0].main;
    
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon

      })
      const suggestion = suggestClothing(temperature, condition);
      console.log("Clothing suggestion:", suggestion);  // Debug
      setClothingSuggestion(suggestion);
    }catch(error){
      console.log("Error fetching weather:", error);
     
    }
  }

  useEffect(()=>{
    search("Chennai")
  },[])
  return (
    <div className='weather'>
        <div className="search-bar">
            <input ref={inputRef} type = "text" placeholder='Search'/>
            <img src={search_icon} alt="" onClick={()=>search(inputRef.current.value)}/>
        </div>
        <img src ={weatherData.icon} alt="" className='weather-icon' height/>
        <p className='temperature'>{weatherData.temperature}°c</p>
        <p className='location'>{weatherData.location}</p>
        <div className="weather-data">
          <div className="col">
            <img src={humidity_icon} alt=""/>
            <div>
              <p>{weatherData.humidity} %</p>
              <span>Humidity</span>
            </div>
          </div>
          <div className="col">
            <img src={wind_icon} alt=""/>
            <div>
              <p>{weatherData.windSpeed} km/hr</p>
              <span>Wind</span>
            </div>
          </div>
        </div>
        <div className="clothing-suggestion">
            <h4> Clothing Suggestion:</h4>
            <p>{clothingSuggestion}</p>
          </div>
    </div>
  )
}

export default Weather