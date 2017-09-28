function initMap() {
        var place = {lat: 39.099727 ,lng: -94.578567};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: place
        });
        var marker = new google.maps.Marker({
          position: place,
          map: map
        });
      }
