import React from 'react';
import {
  HomeOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  BarsOutlined
} from '@ant-design/icons';
import { Table, Menu } from 'antd';
import { Chart } from "react-google-charts";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/Public.css'
import { useNavigate,useLocation } from 'react-router-dom';
import {
    APIProvider,
    Map,
    Marker,
    useMarkerRef,
    InfoWindow,
    AdvancedMarker,
    Pin
  } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';

import { Header } from 'antd/es/layout/layout';

const TableData = () => {
  const location = useLocation();
  const [mapData,setMapData] = useState([]);
  const [istoggle,setIsToggle] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({});
  const [infoDisplay, setInfoDisplay] = useState({});

  useEffect(() => {
    getReviewData(JSON.parse(location.state["tabledata"]))
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
      }
      setCurrentLocation(pos);
  })
  },[]);
      const navigate = useNavigate();
      const [tableData, setTableData] = useState([]);
      const [barGraphData, setBarGraphData] = useState([['Review Count','Yelp Reviews Chart']]);
      
      const [content,setContent] = useState("2");
      
      
      const [markerRef, marker] = useMarkerRef();
      const [mapref,mapper] = useMarkerRef();

      
      const params = {
        findName : "doctor",
        zipCode : "60616"
      }
      const options = {
        title: 'Yelp Reviews Chart',
        chartArea: { width: '50%' },
        hAxis: {
          title: 'Name',
          minValue: 0,
          
        },
        vAxis: {
          title: 'Review Count',
          
        },
      };
      const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Phone',
          dataIndex: 'display_phone',
          key: 'phone',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
            title: 'Closed',
            dataIndex: 'is_closed',
            key: 'is_closed',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
        },
        {
            title: 'Reviews',
            dataIndex: 'review_count',
            key: 'review_count',
        },
    ]
    async function getReviewData(data)
    {
       var tabdat = [];
       var grphdat = [['Review Count','Yelp Reviews Chart']];
       var mapdat = [];
        for (let index = 0; index < data.length; index++) {
            var arrObj = {
                "name" : '',
                "display_phone" : '',
                "address" : '',
                "is_closed" : '',
                "rating" : '',
                "review_count" : ''
        };
        var mapobj = {};
        var arrarr = [];
            arrObj.name = data[index].name;
            arrarr.push(data[index].name);
            arrObj.display_phone = data[index].display_phone;
            arrObj.address = data[index].location.address1;
            arrObj.is_closed = data[index].is_closed == false ? 'Closed' : 'Open';
            arrObj.rating = data[index].rating;
            arrObj.review_count = data[index].review_count;
            arrarr.push(data[index].review_count) 
            mapobj['lat'] =  data[index].coordinates.latitude;
            mapobj['lng'] =  data[index].coordinates.longitude;
            mapobj["name"] = data[index].name;
            mapobj["display_phone"] = data[index].display_phone;
            mapobj["address"] = data[index].location.address1;
            mapobj["rating"] = data[index].rating;
            tabdat[index] = arrObj; 
            grphdat[index+1] = arrarr;
            mapdat[index] = mapobj;
        }
        setTableData(tabdat);
        setBarGraphData(grphdat);
        setMapData(mapdat);

        

}
const togglewindow = (values) => {
  setInfoDisplay(values)
  setIsToggle(true)
}
const closeInfoWindow = () => {
  setIsToggle(false)
}

return (
    <>
    <Header>
      <Menu theme="dark" mode="horizontal" onSelect={(event) => {
          if(event.key !== "1")
          {
            setContent(event.key)
          }
      }} >
      <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => {
            navigate("/",{state:location.state["homedata"]});
          }}>
            Home
          </Menu.Item>
        <Menu.Item key="2" icon={<BarsOutlined />}>Yelp Reviews</Menu.Item>
        <Menu.Item key="3" icon={<BarChartOutlined />}>Yelp Chart</Menu.Item>
        <Menu.Item key="4" icon={<EnvironmentOutlined />}>Google Map</Menu.Item>
      </Menu>
    </Header>
{
  content === "2" &&
  <>
  <h3><u>Yelp Reviews</u></h3>
  <Table columns={columns} dataSource={tableData}/>
  </>
}
{
  content === "3" &&

    <Chart
  chartType="BarChart"
  data={barGraphData}
  width="100%"
  height="600px"
  legendToggle
/>
}
{
  content === "4" &&
  <div className='d-flex'>   

  <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY.replace(/[<>]/g, '')}>
  <Map zoom={10} center={{lat: -34.397, lng: 150.644 }} mapId={'mymap'} className="d-flex position-fixed  w-100 h-100">
  <InfoWindow anchor={mapper} position={currentLocation}>
  You are here
</InfoWindow>

<Marker ref={mapref} position={currentLocation} />

  {   
  mapData.map((cord) =>
  <>
  <AdvancedMarker  position={{ "lat": cord.lat, "lng": cord.lng}} onClick={() => {togglewindow(cord)}} ><Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} /></AdvancedMarker>
  {/* <Marker position={{ "lat": cord.lat, "lng": cord.lng}} onClick={() => {
  
  }} />  */}
  </>)  
}
{ istoggle &&
<InfoWindow  position={{ "lat": infoDisplay.lat, "lng": infoDisplay.lng}} onCloseClick={closeInfoWindow}>
    <b>Name :</b> {infoDisplay.name} <br/>
    <b>Phone :</b> {infoDisplay.display_phone}<br/>
    <b>Address :</b> {infoDisplay.address}<br/>
    <b>Rating :</b> {infoDisplay.rating}<br/>
  </InfoWindow>
}
</Map>
</APIProvider>
</div>
}
</>
 
);
};

export default TableData;