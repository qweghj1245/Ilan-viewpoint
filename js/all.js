"use strict";

// AIzaSyACrqtiPfVFjqaZgCqz4CFXrpLA_dxXBYs
var map;

function initMap() {
  var hos = {
    lat: 24.723245,
    lng: 121.789160
  };
  map = new google.maps.Map(document.getElementById('map'), {
    center: hos,
    zoom: 10,
    styles: [{
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#444444"
      }]
    }, {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{
        "color": "#f2f2f2"
      }]
    }, {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{
        "saturation": -100
      }, {
        "lightness": 45
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [{
        "visibility": "simplified"
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{
        "color": "#46bcec"
      }, {
        "visibility": "on"
      }]
    }]
  });
  $.ajax({
    type: "GET",
    url: "https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/YilanCounty?$format=JSON",
    success: function success(data) {
      var class1 = [];
      var type = new Set();
      var chooseClass = document.querySelector('#type');
      data.forEach(function (item) {
        if (item.Class1 === undefined) {
          return;
        } else {
          type.add(item.Class1);
        }
      });
      class1 = Array.from(type);
      var str = '';

      function classList() {
        str += "<option selected=\"selected value=\"\u8ACB\u9078\u64C7\">\u8ACB\u9078\u64C7\u985E\u5225</option>";

        for (var i = 0; i < class1.length; i++) {
          str += "<option value='".concat(class1[i], "'>").concat(class1[i], "</option>");
        }

        chooseClass.innerHTML = str;
      }

      classList();
      var marker; // 單一個值

      var markers = []; // 存所有marker

      var pos = [];
      var current = '';
      var info = document.querySelector('#info');
      chooseClass.addEventListener('change', changClass);

      function changClass(e) {
        var str2 = '';

        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }

        pos = data.filter(function (item) {
          return item.Class1 === e.target.value;
        });
        pos.forEach(function (item) {
          var str = {};
          var place = {};
          place.lat = parseFloat(item.Position.PositionLat);
          place.lng = parseFloat(item.Position.PositionLon);
          str.map = map;
          str.position = place;
          str.title = item.Name;
          marker = new google.maps.Marker(str);
          markers.push(marker);
          var infowindow = new google.maps.InfoWindow({
            content: item.Name
          });
          marker.addListener('click', function (e) {
            infowindow.open(map, marker);
            infowindow.setPosition(e.latLng);

            if (current != '') {
              current.close();
              current = '';
            }

            current = infowindow;
          });
          str2 += "\n          <tr>\n            <td>".concat(item.Name, "</td>\n            <td>").concat(item.OpenTime, "</td>\n            <td>").concat(item.Phone, "</td>\n            <td>").concat(item.Address, "</td>\n            <td class=\"d-md-table-cell d-none\">").concat(item.TicketInfo, "</td>\n          </tr>");
        });
        info.innerHTML = str2;
      }
    }
  });
}
//# sourceMappingURL=all.js.map
