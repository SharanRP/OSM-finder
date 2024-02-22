import Map from "./Map";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react"; // Import Spinner component from Chakra UI

export default function App() {
  const [coords, setCoords] = useState({ latitude: "", longitude: "" });
  const [coords2, setCoords2] = useState({ 0: '19.22',1 :'19.23',2:'73.08',3:'73.09'});
  const [display_name, setName] = useState("");
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(getCurrentCityName, error, options);
  }, []);

  function error(err) {
    if (err.code === 1 || err.code === 2 || err.code === 3) {
      alert(err.message);
    } else {
      alert(err);
    }
  }

  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
  };

  async function getCurrentCityName(position) {
    setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });

    let url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;

    try {
      setLoading(true);
      const response = await fetch(url, { method: "GET", mode: "cors" });
      const data = await response.json();
      console.log(data);
      setName(data.display_name);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching current city name:", error);
      alert("Error fetching current city name. Please try again.");
    }
  }

  function update(field) {
    return (e) => {
      const value = e.currentTarget.value;
      setAddress((address) => ({ ...address, [field]: value }));
    };
  }

  async function getData(url) {
    try {
      setLoading(true);
      const response = await fetch(url, { method: "GET", mode: "cors" });
      const data = await response.json();
      setName(data[0].display_name);
      setCoords({ latitude: data[0].lat, longitude: data[0].lon });
      setCoords2({0:data.boundingbox[0] , 1:data.boundingbox[1] , 2:data.boundingbox[2] ,3:data.boundingbox[3]});
      console.log(coords2)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please try again.");
    }
  }

  function submitHandler(e) {
    e.preventDefault();

    let url = `https://nominatim.openstreetmap.org/search?street=${address.street}&city=${address.city}&state=${address.state}&country=${address.country}&postalcode=${address.postalcode}&format=json`;

    getData(url);
  }


  return (
    <div className="grid grid-cols-3 gap-4 p-3 py-4  items-stretch justify-center h-screen bg-gray-900 text-white">
      <div className="col-span-1 flex-row">
        <div className="max-w-md  rounded-lg h-full shadow-lg bg-gray-800 p-6 mb-8 flex-1">
        <h1 className="text-4xl justify-center text-center items-center font-bold py-2 my-2 mb-8">Enter The Address</h1>
          <form className="space-y-6">
            <input
              value={address.street || ""}
              placeholder="Street"
              onChange={update("street")}
              className=" w-full rounded-lg p-2"
              type="text"
            />
            <input
              placeholder="City"
              type="text"
              value={address.city || ""}
              onChange={update("city")}
              className="w-full rounded-lg p-2"
            />
            <input
              placeholder="State"
              type="text"
              value={address.state || ""}
              onChange={update("state")}
              className="w-full rounded-lg p-2"
            />
            <input
              placeholder="Zip Code"
              type="text"
              value={address.postalcode || ""}
              onChange={update("postalcode")}
              className="w-full rounded-lg p-2"
            />
            <input
              placeholder="Country"
              type="text"
              value={address.country || ""}
              onChange={update("country")}
              className="w-full rounded-lg p-2"
            />
            <button onClick={(e) => submitHandler(e)} className="btn rounded-lg w-full my-2 bg-gradient-to-tr text-2xl text-white from-cyan-600 to-cyan-400 p-3">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="col-span-2  h-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="xl" style={{height:'3rem' , width:'3rem'}} />
          </div>
        ) : (
          <Map coords={coords} coords2={coords2} display_name={display_name} />
        )}
      </div>
    </div>
  );
}
