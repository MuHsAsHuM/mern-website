import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import locationsData from './locations.json';  // Import JSON directly

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
    minPrice: '',
    maxPrice: ''
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    const minPriceFromUrl =  urlParams.get("minPrice");
    const maxPriceFromUrl =  urlParams.get("maxPrice");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl||
      minPrice||
      maxPrice
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
        minPrice: minPriceFromUrl || '',
        maxPrice: maxPriceFromUrl || '',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {

    if(e.target.id === "minPrice" || e.target.id === "maxPrice"){
      setSidebardata({...sidebardata, [e.target.id]: e.target.value})
    }

    if (e.target.id === "type") {
      setSidebardata({ ...sidebardata, type: e.target.value });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (+sidebardata.minPrice > +sidebardata.maxPrice){
      console.log(sidebardata.minPrice, sidebardata.maxPrice)
      alert('Min price must smaller than max price');
      return;
    }
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    urlParams.set("minPrice", sidebardata.minPrice);
    urlParams.set("maxPrice", sidebardata.maxPrice);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);

  const [locations, setLocations] = useState({});

  useEffect(() => {
    setLocations(locationsData);
  }, []);

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setDistricts(locations[city] || []);
  };

  return (
    <div className="flex flex-col md:flex-row ">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen gap-1">
        <div className="flex items-center gap-2 font-bold text-lg"> Property Search </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="items-center">
            <label className="font-semibold text-md">Search term</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Keyword..."
              className="border rounded-lg p-3 w-full focus:border-indigo-500 focus:ring-indigo-500 cursor-auto"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="items-center">
          <label className="font-semibold text-md">Property Type</label>
          <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              placeholder="Type of property"
              id="type"
              className="border w-full rounded-lg p-3 focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">Both rent & sale</option>
              <option value="rent">Rent Only</option>
              <option value="sale">Sale Only</option>
          </select>
          </div>
          <div className=" gap-2 flex-wrap items-center">
            <div className="flex gap-2">
            <label className="font-semibold text-md">Offer</label>
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
            </div>
          </div>
          <div className=" gap-2 flex-wrap items-center">
            <label className="font-semibold text-md">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="items-center">
          <label className="font-semibold text-md">Min Price</label>
          <input
              type="number"
              placeholder="Min Price"
              value={sidebardata.minPrice}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:border-indigo-500 focus:ring-indigo-500 cursor-auto"
              id="minPrice"
              //onChange={(e) => setSidebardata({ ...sidebardata, minPrice: e.target.value })}
            />
            </div>
            <div className="items-center">
            <label className="font-semibold text-md">Max Price</label>
          <input
            className="border rounded-lg p-3 w-full focus:border-indigo-500 focus:ring-indigo-500 cursor-auto"
            type="number"
            placeholder="Max Price"
            id="maxPrice"
            onChange={handleChange}
            value={sidebardata.maxPrice}
            //onChange={(e) => setSidebardata({ ...sidebardata, maxPrice: e.target.value })}
          />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3 w-full"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>


      <div className="flex-1">
        <h1 className="text-4xl font-bold border-b p-3 text-slate-700 mt-5 text-center">
          Property Result
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}