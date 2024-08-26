import axios from "axios"
import { z } from 'zod' 
/* import { object, number, string, InferOutput, parse } from 'valibot' */
import { SearchType } from "../types"
import { useMemo, useState } from "react"

// Zod
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  })
})

export type Weather = z.infer<typeof Weather>

// Valibot
/* const WeatherSchema = object({
  name: string(),
  main: object({
    temp: number(),
    temp_max: number(),
    temp_min: number(),
  })
})
type Weather = InferOutput<typeof WeatherSchema> */

const initialState = {
  name: '',
    main: {
      temp: 0,
      temp_max: 0,
      temp_min: 0
    }
}

export const useWeather = () => {

  const [weather, setWeather] = useState<Weather>(initialState)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY
    setWeather(initialState)
    setLoading(true)
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
      const { data } = await axios(geoUrl)

      if(!data[0]) {
        setNotFound(true)
        return
      }
    
      const lat = data[0].lat
      const lon = data[0].lon

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

      // Formas de tipar una llamada de una api (No recomendable Types (x))
      // Valibot
    /*   const { data: weatherResults } = await axios(weatherUrl)
      const result = parse(WeatherSchema, weatherResults) */

      // Tipar respuesta mediante Zod
      const { data: weatherResults } = await axios(weatherUrl)
      const result = Weather.safeParse(weatherResults)
      if(result.success) {
        setWeather(result.data)
      }
      


    } catch (error) {
      console.error(error)
    } finally { setLoading(false) }
  }

  const hasWeatherData = useMemo(() => weather.name, [weather])

  return {
    fetchWeather,
    weather,
    hasWeatherData,
    loading,
    notFound
  }
}
