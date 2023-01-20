const div = document.getElementById("dropdown");
const target = document.getElementById("places");
const not_scroll = document.getElementById("not_scroll");
const selectedLocations = [];
const locationData = [];

// minimize the dropdown
const minimize = function minimize() {
    const mini = document.getElementById("mini");
    const exp = document.getElementById("exp");
    mini.style.display = "none";
    exp.style.display = "block";
    not_scroll.style.overflow = "hidden";
    target.style.overflow = "hidden";
    $("#places").animate({
        height: 0,
    }, 500);
}
// expand the dropdown
const expand = function expand() {
    mini.style.display = "block";
    exp.style.display = "none";
    not_scroll.style.overflow = "hidden";
    target.style.overflow = "auto"
    $("#places").animate({
        height: "30rem",
    }, 500);
}
//  collapse the  dropdown
const collapse = function collapse() {
    target.style.display = "none";
    const mini = document.getElementById("mini");
    const coll = document.getElementById("coll");
    const exp = document.getElementById("exp");
    const uncoll = document.getElementById("uncoll");
    mini.style.display = "none";
    exp.style.display = "none";
    coll.style.display = "none";
    uncoll.style.display = "block";
    uncoll.style.transform = "rotate(270deg)"
    div.style.transform = "rotate(-90deg)";
    div.style.marginTop = "200px"
}
// uncollapse the dropdown
const uncollapse = function uncollapse() {
    uncoll.style.display = "none";
    target.style.display = "block";
    coll.style.display = "block";
    mini.style.display = "block";
    exp.style.display = "none";
    div.style.marginTop = "100px";
    div.style.transform = "rotate(0deg)";
    target.style.height = "30rem";
}

//load country data from json file
let listData; 
// (function () {
//     $.ajax({
//         url: 'locations.json', 
//         success: function (data) { 
//             formatData(data); 
//         }
//     })
// })();
fetch("./locations.json")
    .then(response=>response.json())
    .then(data=>formatData(data));

//format city name followed by country name separated by "-"
function formatData(data) {
    listData = data.map(place => {
        return {
            "name": (place.capital || 'Not provided') + "-" + place.name,
            "flag": place.flag
        }
    }).sort(rearrange);
    loadList(listData);
}

//sorts the data using rearrange function by comparing consecutive data
function rearrange(a, b) {
    const placeA = a.name.toUpperCase();
    const placeB = b.name.toUpperCase();
    if (placeA > placeB) {
        return 1;
    } else if (placeA < placeB) {
        return -1;
    }
}

// creates a list of city-country names in html
function loadList(data) {
    locationData.length = 0;
    let result = ``;
    let indexedResult = ``;
    const indexes = [];
    data.forEach((place) => {
        result += `<li place-index="${place.name[0]}">
                    <input value="${place.name}" class="check" type="checkbox" onclick="setSelectedLocations(event)"
                    id="${place.name}"/>
                    <img class="flag" src="${place.flag}"/>
                    <label title="${place.name}" for= "${place.name}" class="city-name">${place.name}</label>
                </li>`;
        locationData.push(place.name);
        const index = place.name[0];
      //creating index
        if (!indexes.includes(index)) {
            indexes.push(index);
            indexedResult += `<div class="index">${index}</div>`
        }
    });
    $('#indexes').html(indexedResult);
    $('#results').html(result);

    // checking the checkboxes if the value exists in selectedLocations list
    if (selectedLocations.length) {
        selectedLocations.forEach(x => {
            if (document.getElementById(x)) {
                document.getElementById(x).checked = true;
            }
        });
    }
}

//alphabetical indexing  
$('#indexes').on('click', '.index', function (event) {
    const index = $(this).text();
    console.log(index);
    $(`li[place-index="${index}"]`)[0].scrollIntoView({ behavior: "smooth" });
});

//searching a name in the list
let searchList = document.getElementById("search")
searchList.addEventListener("input", () => {
    let data = listData.filter((place) => place.name.toLowerCase().includes(search.value.toLowerCase()));
    loadList(data);
})

//apply filter alerts selected country name
const apply = () => {
    // var checkboxes = document.querySelector('.check');
    var array = [];
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        array.push(checkboxes[i].value);
    }
    window.alert(array);
}

// unchecking all selected location
const uncheck = function uncheck() {
    selectedLocations.length = 0;
    $('input[type=checkbox]').prop('checked', false);
}

// checking all location
const checkAll = function checkAll() {
    selectedLocations.length = 0;
    locationData.forEach(x => selectedLocations.push(x));
    $('input[type=checkbox]').prop('checked', true);
}

//Managing the selected location in selectedLocations array
function setSelectedLocations(event) {
    if (event.target.checked) {
        selectedLocations.push(event.target.value);
    } else {
        const unSelectedLocationIndex = selectedLocations.findIndex(x => x === event.target.value);
        if (unSelectedLocationIndex != -1) {
            selectedLocations.splice(unSelectedLocationIndex, 1);
        }
    }
}