import { BeatLoader } from 'react-spinners'
import style from './App.module.css'
import { Form } from './components/Form/Form'
import { WeatherDetail } from './components/WeatherDetail/WeatherDetail'
import { useWeather } from './hooks/useWeather'
import { Alert } from './components/Alert/Alert'

function App() {
  const {weather, fetchWeather, hasWeatherData, loading, notFound } = useWeather()

  return (
    <>
      <div className={style.title}></div>
      <div className={style.container}>
        <Form 
          fetchWeather={fetchWeather}
        />
        { loading &&
            <div className={style.spinner}><BeatLoader color='white'/></div>
        }
        {
          hasWeatherData && <WeatherDetail weather={weather}/>
        }
        {
          notFound && <Alert>Ciudad no encontrada</Alert>
        }
      </div>
    </>
  )
}

export default App
