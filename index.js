$(function () {
    // Запрос к API сайта с погодными данными, который срабатывает по умолчанию и выводит данные для Самары
    var searchLink = 'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=a4c3fdb4e5a742fa9fa200835191401&lang=ru&tp=12&q=Samara&cc=no&mca=no&format=json';
    // Функция вывода из JSON-файла, полученного от API и создание элементов в index.html   
    function weather() {
        // Запрос    
        req = new XMLHttpRequest();
        req.open("GET", searchLink, true);
        req.send();
        req.onload = function () {
            json = JSON.parse(req.responseText);
            // Создание элементов    
            var ul = document.createElement('ul');
            ul.className = 'b-weather owl-carousel';
            for (var i = 0; i < 4; i++) {
                var div = document.createElement('div');
                div.className = 'b-weather__day';
                ul.appendChild(div);
                //Преобразование даты из JSON-файла в более удобный формат
                var timeStr = json.data.weather[i].date;
                var date = new Date(timeStr);
                var day = date.getDate();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var dateStr = day + "." + month + "." + year;
                //  
                var p = document.createElement('p');
                p.className = 'b-weather__date';
                p.innerHTML = dateStr;
                div.appendChild(p);
                p = document.createElement('p');
                p.className = 'b-weather__logo';
                p.innerHTML += '<img class="b-weather__img" src="' + json.data.weather[i].hourly[1].weatherIconUrl[0].value + '">';
                div.appendChild(p);
                p = document.createElement('p');
                p.className = 'b-weather__dayTemp';
                p.innerHTML = '<i class="fas fa-sun"></i>   ' + json.data.weather[0].hourly[1].tempC + ' <sup>o</sup>C';
                div.appendChild(p);
                p = document.createElement('p');
                p.className = 'b-weather__nightTemp';
                p.innerHTML = '<i class="fas fa-moon"></i>   ' + json.data.weather[i].hourly[0].tempC + ' <sup>o</sup>C';
                div.appendChild(p);
                p = document.createElement('p');
                p.className = 'b-weather__descr';
                p.innerHTML = json.data.weather[i].hourly[1].lang_ru[0].value;
                div.appendChild(p);
            };
            document.body.children[0].appendChild(ul);
            //
            // Применение разметки для слайдера owl-carousel          
            $('.owl-carousel').owlCarousel({
                loop: true,
                margin: 5,
                nav: true,
                navText: ["", ""],
                items: 3,
                slideBy: 1
            });
            //          
        };
    };
    // Функция определения города и страны по координатам. По умолчанию выдается Самара.   
    function yourLocation() {
        // Запрос к геокодеру Яндекса
        var locationLink = "https://geocode-maps.yandex.ru/1.x/?apikey=959ef85a-fdbb-4a09-aadb-7e380f402fc9&geocode=50.189036599999994,53.244896&format=json";
        reqLoc = new XMLHttpRequest();
        reqLoc.open("GET", locationLink, true);
        reqLoc.send();
        reqLoc.onload = function () {
            jsonObject = JSON.parse(reqLoc.responseText);
            // Создание объекта для вывода города и страны в index.html      
            var p = document.createElement('p');
            p.className = 'b-city__name';
            p.innerHTML = jsonObject.response.GeoObjectCollection.featureMember[0].GeoObject.description;
            var cityElement = document.getElementById('b-weather__city');
            cityElement.appendChild(p);
            //
        };
    };
    // Функция для геозапроса координат пользователя в браузере.     
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    // Функция срабатывает, если клиент разрешил доступ к местоположению и выводит его текущие координаты
    function success(pos) {
        var crd = pos.coords;
        var Latitude = pos.coords.latitude;
        var Longitude = pos.coords.longitude;
        //Добавление координат в запрос к сайту с погодными данными
        var searchLink = 'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=a4c3fdb4e5a742fa9fa200835191401&lang=ru&tp=12&q=' + Latitude + ',' + Longitude + '&cc=no&mca=no&format=json';
        //
        //Добавление координат в запрос к сайту для определения города и страны
        var locationLink = 'https://geocode-maps.yandex.ru/1.x/?apikey=959ef85a-fdbb-4a09-aadb-7e380f402fc9&geocode=' + Latitude + ',' + Longitude + '&format=json';
        //
        weather();
        yourLocation();
    };
    //Функция срабатывает, если пользователь не разрешил доступ к местоположению. В этом случае будут выведены погодные данные для города Самары
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        weather();
        yourLocation();
    };
    //Собственно функция для запроса местоположения пользователя из браузера       
    navigator.geolocation.getCurrentPosition(success, error, options);
});
