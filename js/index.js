/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');							
    },
	
    // Update DOM on a Received Event
    receivedEvent: function(id) {
	//Habilita la función del botón atrás.
	document.addEventListener("backbutton", onBackKeyDown, false);
	//Habilita la función del botón menú.
	
	document.addEventListener("menubutton", onMenuKeyDown, false);
	
	window.addEventListener("batterystatus", onBatteryStatus, false);
	
		var element = document.getElementById('deviceProperties');
		element.innerHTML = 'Device Model: '    + device.model    + '<br />' +
							'Device Cordova: '  + device.cordova  + '<br />' +
							'Device Platform: ' + device.platform + '<br />' +
							'Device UUID: '     + device.uuid     + '<br />' +
							'Device Version: '  + device.version  + '<br />';
    }
	
};
//Trabajar esto para avisar que el nivel de batería es bajo cuando esté por debajo del 5%...en desarrollo...
function onBatteryStatus(status) {
    console.log("Level: " + status.level + " isPlugged: " + status.isPlugged);
}


	$('#wifi').on('click', function () {
		console.log('wifi');
		window.localStorage.setItem("method","wifi");
		document.getElementById("wifi").className = "btn btn-default active";
		document.getElementById("mix").className = "btn btn-default";
		document.getElementById("3g-4g").className = "btn btn-default";		
        $('#wifi').html('<b>WIFI</b>');
		$('#mix').html('MIX');
		$('#3g-4g').html('3G/4G');		
		
	});
	
	$('#3g-4g').on('click', function () {
		console.log('3g-4g');
		window.localStorage.setItem("method","3g-4g");
		document.getElementById("wifi").className = "btn btn-default";
		document.getElementById("mix").className = "btn btn-default";
		document.getElementById("3g-4g").className = "btn btn-default  active";
        $('#wifi').html('WIFI');
		$('#mix').html('MIX');
		$('#3g-4g').html('<b>3G/4G</b>');
		navigator.notification.alert("Podes experimentar perdidas de datos o lentitud si tu dispositivo no cuenta con una conexion estable. Te recomendamos que uses Wi-Fi.", alertDismissed, 'Logistica 1.0', 'Aceptar');		
	});
	$('#mix').on('click', function () {
		console.log('mix');
		window.localStorage.setItem("method","mix");
		document.getElementById("wifi").className = "btn btn-default";
		document.getElementById("mix").className = "btn btn-default active";
		document.getElementById("3g-4g").className = "btn btn-default";
        $('#wifi').html('WIFI');
		$('#mix').html('<b>MIX</b>');
		$('#3g-4g').html('3G/4G');
		
	});
/*
function enviarMail(comprobante){
	var comprobante;
	navigator.notification.alert("Ok, vamos a mandar mail a " + comprobante, alertDismissedMail(comprobante), 'Logistica 1.0', 'Aceptar');
}
*/	

 // alert dialog dismissed
        function enviarMail(comprobante){
			$("#leyendo").html('<div class="progress">' + 
									'<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">'+
										'<span class="sr-only">100% Complete</span>'+
									'</div>'+
								'</div>');
			var comprobante;
			//alert(c);
			var server = window.localStorage.getItem('server');
			var base = window.localStorage.getItem('base');
			var user = window.localStorage.getItem('user');
			var pass = window.localStorage.getItem('pass');
			$.getJSON("http://leocondori.com.ar/app/logistica/www/sendmail.php", {ws: server, base:base, usuario:user, pass:pass, id: comprobante}, resultMail, "json");
        }		
		
		function resultMail(respuesta){
			$("#leyendo").hide();
			if(respuesta.ItsLoginResult == 1){
				alert('Error');
			}else{
				//alert('Exito al enviar');
				$("#success").show();
				$("#success").html('Exito al enviar mail');
				
				setTimeout(function(){$("#success").hide();},4000); // 3000ms = 3s				
			}			
		}
	
function accion(comprobante, update){
	var comprobante;
	var update;
	navigator.notification.alert("Ok, vamos a actualizar el " + comprobante + ' con la siguiente accion ' + update, alertDismissed, 'Logistica 1.0', 'Aceptar');		
}

	
function programarAviso(){
	setTimeout(function(){mostrarAviso()},3000); // 3000ms = 3s	
}
function mostrarAviso(){
	$("#progress").hide();	
	verRuta();	
}
	
	
function progressBar(x,c){
	var x;
	var c;
	var porcentaje = x * 100/ c;
	console.log('Cantidad: '+ x);
	console.log('Contado: '+ c);
		//console.log(parseInt(porcentaje));
	$("#por").html('');
	$("#por").html(parseInt(porcentaje)+'%');
	document.getElementById("progressbar").style.width = ""+ parseInt(porcentaje) +"%";
}

/*
Traer Guía de Transporte
*/	
function traerGuia(a){
	$("#falseprogress").show();
	var a;
	var server = window.localStorage.getItem('server');
	var base = window.localStorage.getItem('base');
	var user = window.localStorage.getItem('user');
	var pass = window.localStorage.getItem('pass');
	$.getJSON("http://leocondori.com.ar/app/logistica/www/obtenerguia.php", {ws: server, base:base, usuario:user, pass:pass, guia: a}, resultGuia, "json");
	$("#falseprogress").html('');
	$("#falseprogress").html('<div class="progress">' +
								'<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">' +
									'<span class="sr-only">45% Complete</span>' +
								'</div>' +
							 '</div');					 
}	

function resultGuia(respuesta){
        if(respuesta.ItsLoginResult == 1){			
            alert('Error : ' + respuesta.motivo);
			$("#falseprogress").fadeOut();
			console.log('Si hay error entré acá');
        }else{
			/*alert(respuesta.ItsLoginResult);
			alert(respuesta.ItsGetDate);
			alert(respuesta.Cantidad);
			alert(respuesta.Fecha[0]);
			alert(respuesta.Id[0]);
			    for(var x=0; x<respuesta.Detalle.length; x++){                    
                    var orden = respuesta.Detalle[x]["ORDEN"];
                    var comprobante = respuesta.Detalle[x]["FK_ERP_COM_VEN"];
					alert(comprobante);
                }		
			console.log('Voy a ocultar el progress bar');
			//$("#progress").hide();
			*/
			$("#falseprogress").hide();
			$("#progress").show();
			$("#progress").html('');
			$("#progress").html('<div class="progress">' +
									'<div class="progress-bar progress-bar-info" id="progressbar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="0%">' +
									'<p id="por"></p>' +
									'</div>' +
								'</div>	');
			
			$("#GuiaDeTransporte").html('');
			var x=0;	
			while(x<respuesta.Cantidad){
				var orden = respuesta.Detalle[x]["ORDEN"];
				console.log('Con esto arranque ' + x);
				$("#GuiaDeTransporte").append('<tr>' +
											'<td>' +
												'<div class="btn-group" role="group">' +
													'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
													  'Ejecutar' +
													  '<span class="caret"></span>' +
													'</button>' +
													'<ul class="dropdown-menu">' +
													  '<li><a href="javascript: enviarMail(\''+respuesta.Detalle[x]["FK_ERP_COM_VEN"]+'\')"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Enviar alerta</a></li>' +
													  '<li role="separator" class="divider"></li>' +
													  '<li><a href="javascript: accion(\''+respuesta.Detalle[x]["FK_ERP_COM_VEN"]+'\', \'e\');">Entregado</a></li>' +
													  '<li><a href="javascript: accion(\''+respuesta.Detalle[x]["FK_ERP_COM_VEN"]+'\', \'d\');">Devuelto</a></li>' +
													  '<li><a href="javascript: accion(\''+respuesta.Detalle[x]["FK_ERP_COM_VEN"]+'\', \'dc\');">Devuelto por cliente</a></li>' +
													  '<li><a href="javascript: accion(\''+respuesta.Detalle[x]["FK_ERP_COM_VEN"]+'\', \'ep\');">Entregado parcial</a></li>' +
													'</ul>' +
												  '</div>' +
											'</td>' +
											'<td>'+respuesta.Detalle[x]["FK_ERP_COM_VEN"]+'</td>' +
											'<td>'+respuesta.Detalle[x]["ORDEN"]+'</td>' +
										'</tr>');
					console.log(x,respuesta.Cantidad);
					progressBar(x,respuesta.Cantidad);					
					console.log('Con esto termine ' + x++);					

			}//Fin del for
		progressBar(respuesta.Cantidad,respuesta.Cantidad);	
		programarAviso();
		}		
}

/* Testeo la conexión */
    $("#conexion").click(function(){
        console.log('Hiciste click en el botón con ID "conexion". ');
                var url = window.localStorage.getItem("server");
                $("#conectandonos").show();
                $.getJSON("http://leocondori.com.ar/app/local/testws.php", {ws: url}, resultConn, "json");          
        })

/* Función captura la respuesta del testeo de conexión */
		function resultConn(respuesta){
			if (respuesta.valor == 1){
				$("#conectandonos").hide();				   
				//alert('Conexión creada con éxito.');
				navigator.notification.alert('Conexion creada con exito', alertDismissed, 'Eventos Logistica', 'Aceptar');
			}else{
				$("#conectandonos").hide();
				navigator.notification.alert('No se puede acceder a la ruta seleccionada ', alertDismissed, 'Eventos Logistica', 'Aceptar');
			}
		}

/* Testeo-Login */
    $("#testlogin").click(function(){
	$("#conectandonos").show();	
    var WebService = window.localStorage.getItem("server");
	var BaseDeDatos = window.localStorage.getItem("base");
	var Usuario = window.localStorage.getItem("user");
	var Clave = window.localStorage.getItem("pass");	
        $.getJSON("http://leocondori.com.ar/app/local/itslogin.php", {ws: WebService, base: BaseDeDatos, usuario: Usuario, pass: Clave}, ItsLogin, "json");
    })

/* Función que captura la respuesta del testeo del login */
    function ItsLogin(Response){
        if (Response.ItsLoginResult == 1){
            $("#conectandonos").hide();				   
            //alert('Error : ' + Response.motivo);
			navigator.notification.alert(Response.motivo, alertDismissed, 'Eventos Logistica', 'Aceptar');
        }else{
            $("#conectandonos").hide();
            //alert('Login realizado con éxito: ' + Response.session);
			navigator.notification.alert(Response.session, alertDismissed, 'Eventos Logistica', 'Aceptar');
        }
    }		

//Función de conexión.
function validateConnection(){
	var networkState = navigator.connection.type;
	var states = {};
	states[Connection.UNKNOWN]  = 'No podemos determinar tu tipo de conexión a una red de datos.';
	states[Connection.ETHERNET] = 'Estás conectado a la red mediante Ethernet connection, estamos listo para sincronizar los datos.';
	states[Connection.WIFI]     = 'Estás conectado a la red mediante WiFi, estamos listo para sincronizar los datos.';
	states[Connection.CELL_2G]  = 'Estás conectado a la red mediante Cell 2G connection, estamos listo para sincronizar los datos.';
	states[Connection.CELL_3G]  = 'Estás conectado a la red mediante Cell 3G connection, estamos listo para sincronizar los datos.';
	states[Connection.CELL_4G]  = 'Estás conectado a la red mediante Cell 4G connection, estamos listo para sincronizar los datos.';
	states[Connection.CELL]     = 'Estás conectado a la red mediante Cell generic connection, podrías experimentar lentitud en la sincronización.';
	states[Connection.NONE]     = '¡Atención! tu dispositivo no tiene conexion a datos, no podrás sincronizar, sin embargo podrás seguir trabajando de manera offline.';

	if(navigator.network.connection.type == Connection.WIFI){
			return 0;
		}else if (navigator.network.connection.type == Connection.ETHERNET){
			return 1;
		}else if (navigator.network.connection.type == Connection.CELL_2G){
			return 2;
		}else if (navigator.network.connection.type == Connection.CELL_3G){
			return 3;
		}else if (navigator.network.connection.type == Connection.CELL_4G){
			return 4;
		}else if (navigator.network.connection.type == Connection.CELL){
			return 5;
		}else if (navigator.network.connection.type == Connection.NONE){
			return 6;
		}else{
			return 7;	
		}	
}

function checkwifi(){
	var resultado = validateConnection();
		if(resultado == 0){	
			navigator.notification.alert('Genial, estas conectado a una red WiFi', alertDismissed, 'Eventos Logistica', 'Aceptar');
		}else{			
			navigator.notification.alert('No estas conecado a ninguna red wi-fi. No vas a poder cargar guias de transporte ni modificar los estados de envio', alertDismissed, 'Eventos Logistica', 'Aceptar');
		}
}

    // process the confirmation dialog result
    function onConfirm(buttonIndex) {
		if (buttonIndex==1){
			navigator.app.exitApp();
			}
    }

//Botón atrás
function onBackKeyDown(){
			navigator.notification.vibrate(1000);
            navigator.notification.confirm(
            '¿Estas seguro que queres salir de la aplicacion?',  // message
            onConfirm, // callback
            'Logistica 1.0:', // title
            ['Si, salir', 'Cancelar'] // buttonName
			);
		}
		
// Función activada. Botón Menú.
function onMenuKeyDown() {
	//alert('No hay opciones de menu disponible por el momento');
						navigator.notification.vibrate(900);
						navigator.notification.alert('No hay opciones de menu disponible por el momento', 
						alertDismissed, 
						'Logística 1.0', 
						'Aceptar');     
	}
//Función Sleep
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
	
function agregar(){
    console.log('ejecutaste el botón agregar');
    //navigator.notification.alert('Ejecutaste el botón agregar', alertDismissed, 'Eventos Logistica', 'Aceptar');
	
	//Ejecuto el lector de código de barras
    cordova.plugins.barcodeScanner.scan(
        //Si el scaneo del barcode Scanner funciona ejecuta la función result
        function (result) {  
            //Guardamos el resultado del código QR o código de barras en una variable
            var codigoQR=result.text;
            //Introducimos esa variable en el campo 
            //ANDA ESCRIBE RESULTADOS
			//$('#guianumero').html('<input type="hidden" class="form-control" id="CodBarrasLeido" value="'+codigoQR+'">');
			navigator.notification.alert('Elegiste cargar en tu aplicación la siguiente guia de transporte' + codigoQR, alertDismissed, 'Eventos Logistica', 'Aceptar');
			traerGuia(codigoQR);
			//Llamo nuevamente al léctor de código de barras.
			//loop(codigoQR);  
        }, 
        //Si no, ejecuta la función error.
        function (error) {
            notificacion("Ha ocurrido un error al escanear.");
        }
    );
}

	function cleaner(){
				navigator.notification.vibrate(1000);
				navigator.notification.confirm(
				'Estas seguro que queres borrar las datos de conexion?',  // message
				onConfirmCleaner, // callback
				'Logistica 1.0:', // title
				['Si, borrar', 'Cancelar'] // buttonName
				);	
	}


    // process the confirmation dialog result
    function onConfirmCleaner(buttonIndex) {
			if (buttonIndex==1){
			window.localStorage.setItem("server","");
			window.localStorage.setItem("base","");
			window.localStorage.setItem("user","");
			window.localStorage.setItem("pass","");
			navigator.notification.alert("Actualizamos con exito los datos de conexion", alertDismissed, 'Logistica 1.0', 'Aceptar');
			location.reload();
			}
    }


function verRuta(){
    console.log('ejecutaste el boton Ruta');
    //navigator.notification.alert('Ejecutaste el boton Ruta', alertDismissed, 'Eventos Logistica', 'Aceptar');
	var ocultar = window.localStorage.getItem("activo");
	window.localStorage.setItem("activo", "ruteo");
	$("#home").toggle("slide", {direction: "up"}, 500, function(){$("#ruteo").toggle("slide", {direction: "right"}, 500);});
}
//Volver desde el ingreso de valores del WS hacia el HOME.
function volverahome(){
	window.localStorage.setItem("activo", "home");
	$("#ruteo").toggle("slide", {direction: "right"}, 500, function (){$("#home").toggle("slide", {direction: "up"}, 500);});				
}


//Config WS
//Mostrar los parámetros de conexión al WS.
function ToolsButton(){
	if (!window.localStorage.getItem("server") || !window.localStorage.getItem("base") || !window.localStorage.getItem("user") || !window.localStorage.getItem("pass")){
		document.getElementById("limpiar").style.display="none";
		document.getElementById("testconexion").style.display="none";
		document.getElementById("titulo").style.display="none";
	}else{
		$('#actionform').html('Actualizar');
	}
		var ele = window.localStorage.getItem("method");
		if (ele=='wifi'){
			document.getElementById("wifi").className = "btn btn-default active";
			document.getElementById("mix").className = "btn btn-default";
			document.getElementById("3g-4g").className = "btn btn-default";
			$('#wifi').html('<b>WIFI</b>');
			$('#mix').html('MIX');
			$('#3g-4g').html('3G/4G');
		}else if(ele=='mix'){
			document.getElementById("mix").className = "btn btn-default active";
			document.getElementById("wifi").className = "btn btn-default";
			document.getElementById("3g-4g").className = "btn btn-default";			
			$('#wifi').html('WIFI');
			$('#mix').html('<b>MIX</b>');
			$('#3g-4g').html('3G/4G');
		}else if(ele=='3g-4g'){
			document.getElementById("3g-4g").className = "btn btn-default active";
			document.getElementById("wifi").className = "btn btn-default";
			document.getElementById("mix").className = "btn btn-default";		
			$('#wifi').html('WIFI');
			$('#mix').html('MIX');
			$('#3g-4g').html('<b>3G/4G</b>');			
		}else{
			document.getElementById("wifi").className = "btn btn-default active";
			document.getElementById("mix").className = "btn btn-default";
			document.getElementById("3g-4g").className = "btn btn-default";			
			window.localStorage.setItem("method","wifi");
			$('#wifi').html('<b>WIFI</b>');
			$('#mix').html('MIX');
			$('#3g-4g').html('3G/4G');			
		}		

	window.localStorage.setItem("activo", "configws");
	$("#home").toggle("slide", {direction: "up"}, 500, function(){$("#configws").toggle("slide", {direction: "right"}, 500);});
	
	document.getElementById("rutaws").value = window.localStorage.getItem("server");
	document.getElementById("base").value = window.localStorage.getItem("base");
	document.getElementById("userws").value = window.localStorage.getItem("user");
	document.getElementById("password").value = window.localStorage.getItem("pass");
	}
//Volver desde el ingreso de valores del WS hacia el HOME.
function volver(){
	window.localStorage.setItem("activo", "home");
	$("#configws").toggle("slide", {direction: "right"}, 500, function (){$("#home").toggle("slide", {direction: "up"}, 500);});				
}

//FIN Config WS

//About
function aboutConfig(){
	var ocultar = window.localStorage.getItem("activo");
	window.localStorage.setItem("activo", "about");
	$("#"+ocultar+"").toggle("slide", {direction: "up"}, 500, function(){$("#about").toggle("slide", {direction: "right"}, 500);});
}
//Volver desde del about hacia el HOME.
function volverAbout(){
	var ocultar = window.localStorage.getItem("activo");
	window.localStorage.setItem("activo", "home");
	$("#"+ ocultar +"").toggle("slide", {direction: "right"}, 500, function (){$("#home").toggle("slide", {direction: "up"}, 500);});				
}
//Fin About

 // alert dialog dismissed
        function alertDismissed() {
            // do something
			console.log('ahhhhhhh');
        }

//Grabo los datos del WebService.
function submitForm(){
				var _webs = $("[name='rutaws']").val();
				var _users = $("[name='userws']").val();
				var _pass = $("[name='password']").val();
				var _base = $("[name='base']").val();

				if(_webs==""){
					navigator.notification.vibrate(500);
					$("#errorwebser").html('<div id="bdinfoerr" class="form-group has-error has-feedback">' +
											'<label class="control-label" for="rutaws">Este campo es obligatorio!</label>'+
											'<input type="text" class="form-control" id="rutaws" name="rutaws" aria-describedby="inputError1Status">' +
											'<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
											'<span id="inputError1Status" class="sr-only">(error)</span>' +
										   '</div>'
										);
					$("#errorwebser").effect("shake");
					return false;					
					}else{
						$("#errorwebser").html('<div class="form-group has-success has-feedback">'+
													'<label class="control-label" for="rutaws">Validado!</label>'+
													'<input type="text" class="form-control" id="rutaws" name="rutaws" aria-describedby="inputSuccess1Status" value='+ _webs +'>'+
													'<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>'+
													'<span id="inputSuccess1Status" class="sr-only">(success)</span>'+
												'</div>');
												
	                window.localStorage.setItem("server", _webs);
					}
				
				if(_base==""){
					navigator.notification.vibrate(500);
					$("#errordb").html('<div id="bdinfoerr" class="form-group has-error has-feedback">' +
											'<label class="control-label" for="base">Este campo es obligatorio!</label>'+
											'<input type="text" class="form-control" id="base" name="base" aria-describedby="inputError2Status">' +
											'<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
											'<span id="inputError2Status" class="sr-only">(error)</span>' +
									   '</div>'
										);
					$("#errordb").effect("shake");					
					return false;					
					}else{
						$("#errordb").html('<div class="form-group has-success has-feedback">'+
													'<label class="control-label" for="base">Validado!</label>'+
													'<input type="text" class="form-control" id="base" name="base" aria-describedby="inputSuccess2Status" value='+ _base +'>'+
													'<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>'+
													'<span id="inputSuccess2Status" class="sr-only">(success)</span>'+
												'</div>'); 
												
						window.localStorage.setItem("base", _base);
					}
					
				if(_users==""){
					navigator.notification.vibrate(500);
					$("#erroruser").html('<div id="bdinfoerr" class="form-group has-error has-feedback">' +
											'<label class="control-label" for="userws">Este campo es obligatorio!</label>'+
											'<input type="text" class="form-control" id="userws" name="userws" aria-describedby="inputError3Status">' +
											'<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
											'<span id="inputError3Status" class="sr-only">(error)</span>' +
									   '</div>'
										);
					$("#erroruser").effect("shake");						
					return false;					
					}else{
						$("#erroruser").html('<div class="form-group has-success has-feedback">'+
													'<label class="control-label" for="userws">Validado!</label>'+
													'<input type="text" class="form-control" id="userws" name="userws" aria-describedby="inputSuccess3Status" value='+ _users +'>'+
													'<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>'+
													'<span id="inputSuccess3Status" class="sr-only">(success)</span>'+
												'</div>');
						window.localStorage.setItem("user", _users);						
					}

				if(_pass==""){
					navigator.notification.vibrate(500);
					$("#errorpass").html('<div id="bdinfoerr" class="form-group has-error has-feedback">' +
											'<label class="control-label" for="password">Este campo es obligatorio!</label>'+
											'<input type="text" class="form-control" id="password" name="password" aria-describedby="inputError4Status">' +
											'<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
											'<span id="inputError4Status" class="sr-only">(error)</span>' +
									   '</div>'
										);
					$("#errorpass").effect("shake");											
					return false;					
					}else{
						$("#errorpass").html('<div class="form-group has-success has-feedback">'+
													'<label class="control-label" for="password">Validado!</label>'+
													'<input type="text" class="form-control" id="password" name="password" aria-describedby="inputSuccess4Status" value='+ _pass +'>'+
													'<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>'+
													'<span id="inputSuccess4Status" class="sr-only">(success)</span>'+
												'</div>');
						window.localStorage.setItem("pass", _pass);
						navigator.notification.alert("Actualizamos con exito los datos de conexion", alertDismissed, 'Logistica 1.0', 'Aceptar');
						location.reload();
					}
}