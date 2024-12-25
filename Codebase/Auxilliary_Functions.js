const weatherImagesDay = {
    "clear_sky.png": require('./assets/WeatherIcons/day/clear_sky.png'),
    "few_clouds.png": require('./assets/WeatherIcons/day/few_clouds.png'),
    "cloudy.png": require('./assets/WeatherIcons/day/cloudy.png'),
    "rain.png": require('./assets/WeatherIcons/day/rain.png'),
    "thunderstorm.png": require('./assets/WeatherIcons/day/thunderstorm.png'),
    "snow.png": require('./assets/WeatherIcons/day/snow.png'),
    "smoke.png": require("./assets/WeatherIcons/day/smoke.png")
};

const weatherImagesNight = {
    "clear_sky.png": require('./assets/WeatherIcons/night/clear_sky.png'),
    "few_clouds.png": require('./assets/WeatherIcons/night/few_clouds.png'),
    "cloudy.png": weatherImagesDay["cloudy.png"],
    "rain.png": weatherImagesDay["rain.png"],
    "thunderstorm.png": weatherImagesDay["thunderstorm.png"],
    "snow.png": weatherImagesDay["snow.png"],
    "smoke.png": weatherImagesDay["smoke.png"]
};
  

export function capitalizeTitle (txt) {
    return txt.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
  
export function chooseImage(id, timesArr) {
    /*Note that due to the limitations of the API free-tier, we only get the sunrise and sunset time for
    current day. This results in two consequences for how we handle future forecasts:
        1) Our future dates will guess sunset/sunrise time based on the current days sunset/sunrise times
        2) We must shift back future times that are not less than 24 hours away from the current sunrise time 
            to be able to compare fairly 
    */

    dt = timesArr[0]
    while (dt - timesArr[1] >= 86400) {
        dt-=86400
    }

    let arrToUse = (dt >= timesArr[1] && dt < timesArr[2]) ? weatherImagesDay : weatherImagesNight

    let idCut = id.slice(0,2)
    switch (idCut) {
        case "01":
            return arrToUse["clear_sky.png"]
        case "02":
            return arrToUse["few_clouds.png"]
        case "03":
        case "04":
            return arrToUse["cloudy.png"]
        case "09":
        case "10":
            return arrToUse["rain.png"]
        case "11":
            return arrToUse["thunderstorm.png"]
        case "13":
            return arrToUse["snow.png"]
        case "50":
            return arrToUse["smoke.png"]
        default:
            return ""
    }
}

export function getCurrentTime(dateObject){
    let hours = dateObject.getUTCHours()
    let marker

    if (hours == 0) {
        hours = 12
        marker = "am"
    }
    else if (hours < 12) {
        marker = "am"
    }
    else if (hours == 12) {
        marker = "pm"
    }
    else if (hours > 12) {
        hours-=12
        marker = "pm"
    }

    let minutes = dateObject.getUTCMinutes()

    if (minutes<10){
        minutes = "0"+minutes
    }

    return (hours + ":" + (minutes + marker))
}

export function getDate(dateObject, withYear){
    /* dd/mm/yyyy format */
    if (!withYear) {
        return dateObject.getUTCDate() + "/" + (dateObject.getUTCMonth()+1)
    }
    else {
        return dateObject.getUTCDate() + "/" + (dateObject.getUTCMonth()+1) + "/" + dateObject.getUTCFullYear()
    }
}