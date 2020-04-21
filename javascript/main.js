var map;
        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 3,
                center: { lat: 6.2518400, lng: -75.5635900 }
            });
        }

        function show(id) {
            if (document.getElementById) { //se obtiene el id
                if ('vehiculos' === id) {
                    var elementVehiculo = document.getElementById(id); //se define la variable "el" igual a nuestro div
                    var elementEntregas = document.getElementById(
                        'entregas'); //se define la variable "el" igual a nuestro div
                    var elementPersonas = document.getElementById(
                        'personas'); //se define la variable "el" igual a nuestro div
                    elementVehiculo.style.display = 'block'; //damos un atributo display:none que oculta el div
                    elementEntregas.style.display = 'none'; //damos un atributo display:none que oculta el div
                    elementPersonas.style.display = 'none'; //damos un atributo display:none que oculta el div
                } else if ('entregas' === id) {
                    var elementVehiculo = document.getElementById(
                        'vehiculos'); //se define la variable "el" igual a nuestro div
                    var elementEntregas = document.getElementById(id); //se define la variable "el" igual a nuestro div
                    var elementPersonas = document.getElementById(
                        'personas'); //se define la variable "el" igual a nuestro div
                    elementVehiculo.style.display = 'none'; //damos un atributo display:none que oculta el div
                    elementEntregas.style.display = 'block'; //damos un atributo display:none que oculta el div
                    elementPersonas.style.display = 'none'; //damos un atributo display:none que oculta el div

                } else {
                    var elementVehiculo = document.getElementById(
                        'vehiculos'); //se define la variable "el" igual a nuestro div
                    var elementEntregas = document.getElementById(
                        'entregas'); //se define la variable "el" igual a nuestro div
                    var elementPersonas = document.getElementById(id); //se define la variable "el" igual a nuestro div
                    elementVehiculo.style.display = 'none'; //damos un atributo display:none que oculta el div
                    elementEntregas.style.display = 'none'; //damos un atributo display:none que oculta el div
                    elementPersonas.style.display = 'block';
                }
            }
        }

var firebaseConfig = {
    apiKey: "AIzaSyDXncff8YzYT8pInsSN6L9X2RQQuJtEcW8",
    authDomain: "entregas-app-274619.firebaseapp.com",
    databaseURL: "https://entregas-app-274619.firebaseio.com",
    projectId: "entregas-app-274619",
    storageBucket: "entregas-app-274619.appspot.com",
    messagingSenderId: "537460917119",
    appId: "1:537460917119:web:82767af97026ae0551d04a"
};

firebase.initializeApp(firebaseConfig);

var dbrefVehiculo = firebase.database().ref('class_vehiculo');

dbrefVehiculo.on('value', function (snapshot) {
    document.getElementById('listVehiculos').innerHTML = '';
    document.getElementById('vehiculo_asignado').innerHTML = '';

    snapshot.forEach(function (childSnapshot) {
        let value = childSnapshot.val();
        document.getElementById('listVehiculos').innerHTML += `
                <li class="list-group-item row">
                    <div class="col">
                        <p class="text-secondary">Tipo: ${value.tipo_vehiculo}</p>
                        <h4>${childSnapshot.key}</h4> 
                    </div>
                </li>
                `
        document.getElementById('vehiculo_asignado').innerHTML += `
                <option> ${childSnapshot.key}</option>
                `
    })

});

var dbrefTipo = firebase.database().ref('class_tipo_vehiculo');

dbrefTipo.on('value', function (snapshot) {
    document.getElementById('tipo_vehiculo').innerHTML = '';

    snapshot.forEach(function (childSnapshot) {
        document.getElementById('tipo_vehiculo').innerHTML += `
                <option> ${childSnapshot.key}</option>
                `
    })

});

var dbrefEstadoPaquete = firebase.database().ref('class_estado_paquete');

dbrefEstadoPaquete.on('value', function (snapshot) {
    document.getElementById('estado').innerHTML = '';

    snapshot.forEach(function (childSnapshot) {
        document.getElementById('estado').innerHTML += `
                <option> ${childSnapshot.key}</option>
                `
    })

});

var dbrefPaquetes = firebase.database().ref('class_paquete');

dbrefPaquetes.on('value', function (snapshot) {
    document.getElementById('listPaquetes').innerHTML = '';
    snapshot.forEach(function (childSnapshot) {
        let value = childSnapshot.val();
        document.getElementById('listPaquetes').innerHTML += `
                <li class="list-group-item">
                    <p class="text-secondary">guia: ${childSnapshot.key}</p>
                    <h6>Direccion: ${value.direccion_entrega}</h6>
                    <h6>Persona Asignada: ${value.persona_asignada}</h6>
                    <h6>Estado: ${value.estado}</h6>
                    
                    <div class="row">
                        ${value.estado === 'entregado' ? '<i text-align:center class="fas fa-check-circle"></i>' : '<i class="fa fa-clock"></i>'}
                    </div>
                </li>
                `
    })

});

var dbrefPersonas = firebase.database().ref('class_persona');

dbrefPersonas.on('value', function (snapshot) {
    document.getElementById('listPersonas').innerHTML = '';
    document.getElementById('persona_asignada').innerHTML = '';

    var markers = [];

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    snapshot.forEach(function (childSnapshot) {
        let value = childSnapshot.val();
        document.getElementById('listPersonas').innerHTML += `
                <li class="list-group-item">
                    <h6>${value.nombre}</h6>
                    <pclass="text-secondary">Vehiculo Asignado: ${value.vehiculo_asignado}</p>
                </li>
                `
        document.getElementById('persona_asignada').innerHTML += `
                <option> ${childSnapshot.key}</option>
                `

        var personPos = { lat: parseFloat(value.latitud), lng: parseFloat(value.longitud) };

        var marker = new google.maps.Marker({
            position: personPos,
            label: value.nombre + " Vehiculo: " + value.vehiculo_asignado
        });

        markers.push(marker);

    })

    // Add a marker clusterer to manage the markers.

    var markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

});

function writeNewPaquete() {
    let descripcion_paquete = document.paquete.descripcion_paquete.value;
    let direccion_entrega_paquete = document.paquete.direccion_entrega.value
    let estado_paquete = document.paquete.estado.value;
    let persona_asignada_paquete = document.paquete.persona_asignada.value;

    if (!descripcion_paquete || !direccion_entrega_paquete || !estado_paquete || !persona_asignada_paquete)
        return;

    firebase.database().ref('class_paquete/').push({
        descripcion: descripcion_paquete,
        direccion_entrega: direccion_entrega_paquete,
        estado: estado_paquete,
        persona_asignada: persona_asignada_paquete
    });

    $("#paqueteModal .close").click()
}

function writeNewVehiculo() {

    let placa = document.vehiculo.placa.value;
    let descripcion = document.vehiculo.descripcionVehiculo.value
    let tipo_vehiculo = document.vehiculo.tipo_vehiculo.value;

    if (!placa || !descripcion || !descripcion)
        return;

    firebase.database().ref('class_vehiculo/' + placa).set({
        descripcion: descripcion,
        tipo_vehiculo: tipo_vehiculo
    });

    $("#vehiculoModal .close").click()
}

function writeNewPersona() {
    let cedula = document.persona.cedula.value;
    let nombre = document.persona.nombre.value
    let password = document.persona.password.value;
    let vehiculo_asignado = document.persona.vehiculo_asignado.value;


    if (!cedula || !nombre || !password || !vehiculo_asignado)
        return;


    firebase.database().ref('class_persona/' + cedula).set({
        latitud: 0,
        longitud: 0,
        nombre: nombre,
        password: password,
        vehiculo_asignado: vehiculo_asignado
    });

    $("#personaModal .close").click()

}