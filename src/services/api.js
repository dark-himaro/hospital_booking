import axios from 'axios';
//const axios = require('axios'); // legacy way
export const LoginApi = async (params) => {
  var returnData;
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/login',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : JSON.stringify(params)
    };
    
    await axios.request(config)
    .then((response) => {

      returnData =  {
        statusCode : response.status,
      data : response.data}
        ;
    })
    .catch((error) => {
      returnData =  {
        statusCode : error.response.status,
      data : error.response.data}
        ;
    });
    return returnData;
    
    
}

export const CreateAccountApi = async (params) => {
  var returnData;
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/create-account',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify(params)
  };
  
  await axios.request(config)
  .then((response) => {
    returnData =  {
      statusCode : response.status,
    data : response.data}
      ;
  })
  .catch((error) => {
    returnData =  {
      statusCode : error.response.status,
    data : error.response.data}
      ;
  });
  return returnData;
}
export const BookAppointment = async (params) => {
  var returnData;
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/book-doctor',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify(params)
  };
  
  await axios.request(config)
  .then((response) => {
    returnData =  {
      statusCode : response.status,
    data : response.data}
      ;
  })
  .catch((error) => {
    returnData =  {
      statusCode : error.response.status,
    data : error.response.data}
      ;
  });
  return returnData;
}

export const AddDoctor = async (params) => {
  console.log("getting");
  var returnData;
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/add-doctor',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify(params)
  };
  
  await axios.request(config)
  .then((response) => {
    returnData =  {
      statusCode : response.status,
    data : response.data}
      ;
  })
  .catch((error) => {
    returnData =  {
      statusCode : error.response.status,
    data : error.response.data}
      ;
  });
  return returnData;
}

export const reviewEditor = async (params) => {
  var value = {};
  if(params.type == "write")
  {
  value = {
    type : params.type,
    data : {
      doctor_id: params.id,
      username: params.user_name,
      review: params.review,
    }
  }
}
  else {
    value = {
      type : params.type,
      data : {
        doctor_id: params.doctor_id,
      }
    }
  }
  console.log("getting");
  var returnData;
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/review',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify(value)
  };
  
  await axios.request(config)
  .then((response) => {
    returnData =  {
      statusCode : response.status,
    data : response.data}
      ;
  })
  .catch((error) => {
    returnData =  {
      statusCode : error.response.status,
    data : error.response.data}
      ;
  });
  return returnData;
}

export const UpdateDoctor = async (params) => {
  console.log("params",params);
  var returnData;
  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/update-doctor',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify(params)
  };
  
  await axios.request(config)
  .then((response) => {
    returnData =  {
      statusCode : response.status,
    data : response.data}
      ;
  })
  .catch((error) => {
    returnData =  {
      statusCode : error.response.status,
    data : error.response.data}
      ;
  });
  return returnData;
}
export const DeleteDoctor = async (params) => {
  var returnData;
  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/delete-doctor',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify(params)
  };
  
  await axios.request(config)
  .then((response) => {
    returnData =  {
      statusCode : response.status,
    data : response.data}
      ;
  })
  .catch((error) => {
    returnData =  {
      statusCode : error.response.status,
    data : error.response.data}
      ;
  });
  return returnData;
}
export const deleteAppointment = async (params) => {
  var returnData;
  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/delete-appointment',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify(params)
  };
  
  await axios.request(config)
  .then((response) => {
    returnData =  {
      statusCode : response.status,
    data : response.data}
      ;
  })
  .catch((error) => {
    returnData =  {
      statusCode : error.response.status,
    data : error.response.data}
      ;
  });
  return returnData;
}

export const getAppointmentList = async (params) => {
  var returnData;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://localhost:3000/get-appointment?user=${params["user"]}&usertype=${params["usertype"]}`,
    headers: { 
      'Content-Type': 'application/json'
    }
  };
await axios.request(config)
.then((data) => {
  returnData = data.data;
})
return returnData;
}

export const getDoctorId = async (params) => {
  var returnData;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://localhost:3000/get-doctorid?id=${params}`,
    headers: { 
      'Content-Type': 'application/json'
    }
  };
await axios.request(config)
.then((response) => {

  returnData =  {
    statusCode : response.status,
  data : response.data}
    ;
})
.catch((error) => {
  returnData =  {
    statusCode : error.response.status,
  data : error.response.data}
    ;
});
return returnData;
}
export const getPatient = async (params) => {
  var returnData;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://localhost:3000/user-details?username=${params}`,
    headers: { 
      'Content-Type': 'application/json'
    }
  };
await axios.request(config)
.then((data) => {
  returnData = data.data;
})
return returnData;
}

export const getDoctorList = async (params) => {
  var returnData;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://localhost:3000/get-doctor?id=${params}`,
    headers: { 
      'Content-Type': 'application/json'
    }
  };
await axios.request(config)
.then((data) => {
  returnData = data.data;
})
return returnData;
}

export const getByZipcode = async (params) => {
  var returnData;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://localhost:3000/yelp-data?key=${params.find}&zipcode=${params.zipcode}&isnearme=${params.isnearme}`,
    headers: { 
      'Content-Type': 'application/json'
    }
  };
await axios.request(config)
.then((data) => {
  returnData = data.data.businesses;
})
return returnData;
}