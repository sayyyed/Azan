import { useState, useEffect, useRef} from 'react';
import './App.css';
import moment from 'moment/moment';
function App() {

  const [azan, setAzan] = useState({});
  const [fetchUrl, setFetchUrl] = useState("");
  const [error, setError] = useState("");
  
  const refCountry = useRef("Egypt");
  const refCity = useRef("Cairo");
  const refDate = useRef(moment().format('DD-MM-YYYY'));

  const BASE_URL = "http://api.aladhan.com/v1/timingsByCity/";
  
  const fetchData = async (url) => {
    const response = await fetch(url);
    const obj = await response.json();
    if(obj.code === 200)
    {
      setAzan(obj.data);
      setError("");
    }
    else
    {
      console.log(obj.data);
      setError(obj.data);
      setAzan({});
    }
  }

  const handleInputs = () => {
    const _date = moment(refDate.current.value).format('DD-MM-YYYY');
    const _country = refCountry.current.value;
    const _city = refCity.current.value;

    const u = `${BASE_URL}${_date}?city=${_city}&country=${_country}`;
    setFetchUrl(u);
  }

  useEffect(() => {
    fetchData(fetchUrl);
  }, [fetchUrl]);

  return (
    <div className="app">

      {error !== '' && <p className='error-message'>{error}</p>}

      <div className='search'>
        <input type='date' ref={refDate}/>
        <input type='text' placeholder='Country' ref={refCountry}/>
        <input type='text' placeholder='City' ref={refCity}/>
        <button onClick={handleInputs}>Search</button>
      </div>
      {
      Object.getOwnPropertyNames(azan).length !== 0 && 
        <div className='card'>
          <div className='card-header'>
            <h2 className='city'>{refCity.current.value} - {refCountry.current.value}</h2>
            <h2 className='date'>{azan.date["readable"]}</h2>
            <h4 className='month'>{azan.date["hijri"]["month"]["ar"]}: {azan.date.hijri.date}</h4>
          </div>
          <div className='card-content'>
            {Object.keys(azan.timings).map(d => 
            {
              if(d === 'Imsak' || d === 'Midnight' || d === 'Firstthird' || d === 'Lastthird')
                return "";
                
              return(
              <div key={d} className='timing'>
                <h3 className='timiing-title'>{d}</h3>
                <h3>{azan.timings[d]}</h3>
              </div>
            )

            })}
          </div>
      </div>
    }

    </div>
  );
}

export default App;