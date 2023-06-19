$(document).ready(function () {
  $(document).ready(function () {
    $("#relode").click(function () {
      $("#div1").load("customer/customer.html");
    });
  });

  setTimeout(function getusers() {
    fetch("http://localhost:9090/api/v1/customers",{
        method: "GET",
        headers: {
            Authorization: 'Bearer ' + keycloak.token,
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        }
    })
      .then((Response) => {
        return Response.json();
      })
      .then((data) => {
        let users = data;
        sort(users);
      });
  }, 100);

  function sort(users) {
    userTable(users);

    document.getElementById("sortName").onclick = function () {
      users.sort((a, b) => {
        const modelA = a.userLegalName.toUpperCase();
        const modelB = b.userLegalName.toUpperCase();
        if (modelA < modelB) {
          return -1;
        }
        if (modelA > modelB) {
          return 1;
        }
        return 0;
      });
      userTable(users);
    };

    document.getElementById("sortAdress").onclick = function () {
      users.sort((a, b) => {
        const modelA = a.adress.toUpperCase();
        const modelB = b.adress.toUpperCase();
        if (modelA < modelB) {
          return -1;
        }
        if (modelA > modelB) {
          return 1;
        }
        return 0;
      });
      userTable(users);
    };
    document.getElementById("sortOrders").onclick = function () {
      users.sort((a, b) => a.userBookings.length - b.userBookings.length);
      userTable(users);
    };
    document.getElementById("sortId").onclick = function () {
      users.sort((a, b) => a.userId - b.userId);
      userTable(users);
    };
  }
});

function userTable(users) {
  let a = "";
  document.querySelector("table tbody").innerHTML = a;

  document.getElementById("filterbtn").onclick = function () {
    const nr = document.getElementById("filterInput").value;
    let a = "";
    document.querySelector("table tbody").innerHTML = a;
    users.forEach((user) => {
      if (nr == user.userBookings.length) {
        const markup = `<th>${user.userId}</th> <td>${user.userLegalName} </td><td>${user.adress} </td> <td>${user.userBookings.length}</td> `;
        document
          .querySelector("table tbody")
          .insertAdjacentHTML("beforeend", markup);
      }
    });
  };
  document.getElementById("noFilterbtn").onclick = function () {
    let a = "";
    document.querySelector("table tbody").innerHTML = a;
    users.forEach((user) => {
      console.log(user.userBookings);
      const markup = `<th>${user.userId}</th> <td>${user.userLegalName} </td><td>${user.adress} </td> <td>${user.userBookings.length}</td> `;
      document
        .querySelector("table tbody")
        .insertAdjacentHTML("beforeend", markup);
    });
  };

  users.forEach((user) => {
    console.log(user.userBookings);
    const markup = `<th>${user.userId}</th> <td>${user.userLegalName} </td><td>${user.adress} </td> <td>${user.userBookings.length}</td> `;
    document
      .querySelector("table tbody")
      .insertAdjacentHTML("beforeend", markup);
  });
}

