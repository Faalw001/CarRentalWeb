$(document).ready(function () {
  $("#relode").click(function () {
    $("#div1").load("car/car.html");
  });
});
setTimeout(
  //GET CAR
  function getallcars() {
    fetch("http://localhost:9090/api/v1/cars", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + keycloak.token,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let cars = data;
        sort(cars);
      });
  },
  100
);
function sort(cars) {
  carTable(cars);
  document.getElementById("sortModel").onclick = function () {
    cars.sort((a, b) => {
      const modelA = a.model.toUpperCase();
      const modelB = b.model.toUpperCase();
      if (modelA < modelB) {
        return -1;
      }
      if (modelA > modelB) {
        return 1;
      }
      return 0;
    });

    carTable(cars);
  };
  document.getElementById("sortName").onclick = function () {
    cars.sort((a, b) => {
      const nameA = a.carName.toUpperCase();
      const nameB = b.carName.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    carTable(cars);
  };
  document.getElementById("sortPrice").onclick = function () {
    cars.sort((a, b) => a.pricePerDay - b.pricePerDay);
    carTable(cars);
  };
  document.getElementById("sortId").onclick = function () {
    cars.sort((a, b) => a.carId - b.carId);
    carTable(cars);
  };
}

function carTable(cars) {
  let a = ""; // detta för att rensa tabellen och skicka in cars array på nytt sorterat.
  document.querySelector("table tbody").innerHTML = a;
  cars.forEach((car) => {
    const markup = `<th>${car.carId} </th> <td>${car.carName} </td> <td>${car.model} </td> <td>${car.pricePerDay}</td>`;
    document
      .querySelector("table tbody")
      .insertAdjacentHTML("beforeend", markup);
  });
}

//POST CAR
function postcar() {
  let ccname = document.getElementById("cn").value;
  let ccmodel = document.getElementById("cm").value;
  let ccprice = document.getElementById("cp").value;
  fetch("http://localhost:9090/api/v1/addcar", {
    method: "POST",
    body: JSON.stringify({
      carName: ccname,
      model: ccmodel,
      pricePerDay: ccprice,
    }),
    headers: {
      Authorization: "Bearer " + keycloak.token,
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

// PUT CAR
function putCar() {
  let ucid = document.getElementById("ucId").value;
  let ucname = document.getElementById("ucn").value;
  let ucmodel = document.getElementById("ucm").value;
  let ucprice = document.getElementById("ucp").value;
  fetch("http://localhost:9090/api/v1/updatecar", {
    method: "PUT",
    body: JSON.stringify({
      carId: ucid,
      carName: ucname,
      model: ucmodel,
      pricePerDay: ucprice,
    }),
    headers: {
      Authorization: "Bearer " + keycloak.token,
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}
// DELETE CAR
function deleteCar() {
  // Method after confirmation
  let ccid = document.getElementById("cdId").value;
  fetch("http://localhost:9090/api/v1/deletecar", {
    method: "DELETE",
    body: JSON.stringify({
      carId: ccid,
    }),
    headers: {
      Authorization: "Bearer " + keycloak.token,
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

/// Denna metod är för att kolla att den bilen som ska raderas är bokad eller inte//
function deleteCarBookings() {
  let deleteCarId = document.getElementById("cdId").value;
  let ordersWithThisCar = [];
  console.log("getAllBookings");
  fetch("http://localhost:9090/api/v1/customers", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + keycloak.token,
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((Response) => {
      return Response.json();
    })
    .then((data) => {
      const bookedCarIds = [];

      // behöver få fram vilka som är canceled eller inte på bookings
      // Behöver oxå veta vilka ordrar som har denna car id (för att ersätta)

      for (var i = 0; i < data.length; i++) {
        // console.log(data[i]);
        for (var j = 0; j < data[i].userBookings.length; j++) {
          if (
            data[i].userBookings[j].canceled === false &&
            data[i].userBookings[j].carId == deleteCarId
          ) {
            console.log(data[i].userBookings[j].canceled);
            bookedCarIds.push(data[i].userBookings[j].carId);
            ordersWithThisCar.push(data[i].userBookings[j]); // List of orders with this car
          }
        }
      }
      console.log("deleteCarBooking method");

      deleteCarType(deleteCarId, ordersWithThisCar);

      //måste hämta car ID för den raderade bilen
    });
}

function deleteCarType(deleteCarId, ordersWithThisCar) {
  let deleteCarModel;
  let carsIdOfModel = [];
  fetch("http://localhost:9090/api/v1/cars", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + keycloak.token,
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      data.forEach((car) => {
        if (car.carId == deleteCarId) {
          deleteCarModel = car.model; //hittar tyo/modelen av bilen som ska raderas
          console.log(deleteCarModel);
        }
      });
      data.forEach((car) => {
        // Skapa en ersättningslista av bilar med samma typ
        if (car.model == deleteCarModel && car.carId != deleteCarId) {
          // Uteslut bilen själv
          carsIdOfModel.push(car); //Lista av bilar med samma model som den som ska raderas.
        }
      });

      //////
      if (carsIdOfModel.length >= 1) {
        updateUserOrder(carsIdOfModel, ordersWithThisCar);
      } else {
        updateUserOrderCancel(ordersWithThisCar);
      }
    });
}

function updateUserOrder(carsIdOfModel, ordersWithThisCar) {
  ordersWithThisCar.forEach((currentOrder) => {
    console.log(
      "inside orderWithThisCar loop" +
        currentOrder.carId +
        " --- " +
        carsIdOfModel[0].carId
    );

    updateBooking(currentOrder);
  });

  function updateBooking(currentOrder) {
    console.log("update fetch");

    fetch("http://localhost:9090/api/v1/updateorder", {
      method: "PUT",
      body: JSON.stringify({
        bookingId: currentOrder.bookingId,
        userId: currentOrder.userId,
        carId: carsIdOfModel[0].carId,
        startDay: currentOrder.startDay,
        endDay: currentOrder.endDay,
      }),
      headers: {
        Authorization: "Bearer " + keycloak.token,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }
  console.log("end");
  deleteCar();
}

function updateUserOrderCancel(ordersWithThisCar) {
  ordersWithThisCar.forEach((currentOrder) => {

updateBookingCancel(currentOrder);
  });

  
  function updateBookingCancel(currentOrder) {
    console.log(currentOrder);

    
    fetch("http://localhost:9090/api/v1/cancelorder", {
      method: "PUT",
      body: JSON.stringify({
        bookingId: currentOrder.bookingId,
        canceled: true,
      }),
      headers: {
        Authorization: 'Bearer ' + keycloak.token,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }
  deleteCar();
}
