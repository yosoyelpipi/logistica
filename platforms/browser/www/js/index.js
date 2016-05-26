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

	window.localStorage.setItem("activo", "home");
	
	var existe = window.localStorage.getItem("existe_db");
	
	versiExite(existe);
	//Habilita la funci�n del bot�n atr�s.
	document.addEventListener("backbutton", onBackKeyDown, false);

	//Habilita la funci�n del bot�n men�.
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
//Trabajar esto para avisar que el nivel de bater�a es bajo cuando est� por debajo del 5%...en desarrollo...
function onBatteryStatus(status) {
    console.log("Level: " + status.level + " isPlugged: " + status.isPlugged);
}

//DESDE ACA COMIENZO MIS FUNCIONES...
function versiExite(a){
	var a;
	if(!a){
		creaDB();
		//alert('True' + a);
	}else{
		//alert('False' + a);
	}
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

function progressBar(x,c){
	var c;
	var x;
	var porcentaje = c * 100/ x;
	document.getElementById("progressbar").style.width = ""+ parseInt(porcentaje) +"%";
	$("#por").html(parseInt(porcentaje) + '%');

}

/*
Traer Gu�a de Transporte
*/
	
function traerGuia(a){
	var a;	
	$("#falseprogress").show();	

	var insert = window.localStorage.getItem('insert');

	if(insert==null){
		var server = window.localStorage.getItem('server');
		var base = window.localStorage.getItem('base');
		var user = window.localStorage.getItem('user');
		var pass = window.localStorage.getItem('pass');
		$.getJSON("http://leocondori.com.ar/app/logistica/www/obtenerguia.php", {ws: server, base:base, usuario:user, pass:pass, guia: a}, resultGuia, "json");		
	}else{
		
		navigator.notification.confirm(
			'Ya tenés una guía de transporte cargada. Si volvés a cargar una nueva vas a perder todos los datos relacionados ¿Querés agregar una nueva?', // message
			onConfirma,            // callback to invoke with index of button pressed
			'Logistica',           // title
			['Cargar nueva','Ver la guía guardada']         // buttonLabels
		);	

		function onConfirma(buttonIndex) {
			//alert('You selected button ' + buttonIndex);
			
			if(buttonIndex == 1){
				var server = window.localStorage.getItem('server');
				var base = window.localStorage.getItem('base');
				var user = window.localStorage.getItem('user');
				var pass = window.localStorage.getItem('pass');
				$.getJSON("http://leocondori.com.ar/app/logistica/www/obtenerguia.php", {ws: server, base:base, usuario:user, pass:pass, guia: a}, resultGuia, "json");		
			}else{
				$("#falseprogress").hide();
				//alert('Tengo que leer la que está guardada en la base de datos.');
				syncPrepare();
			}		
		}
	}
}	

function resultGuia(respuesta){
	$("#falseprogress").hide();
	
        if(respuesta.ItsLoginResult == 1){			
            alert('Error : ' + respuesta.motivo);
			$("#progress").fadeOut(6000);
			console.log('Si hay error entró acá');
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
			console.log('Voy a ocultar el progress bar');*/
			//document.getElementById("progressB").style.display = "initial";
			
			$("#GuiaDeTransporte").html('');			
			for(var x=0; x<respuesta.Detalle.length; x++){
			
			var num_com = respuesta.Detalle[x]["FK_ERP_COM_VEN"];
			var idd_det_com = respuesta.Detalle[x]["IDD"];
			var orden_det_com = respuesta.Detalle[x]["ORDEN"];	
				
			$("#GuiaDeTransporte").append('<tr>' +
										'<td>' +
											'<div class="btn-group" role="group">' +
												'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
												  'Ejecutar' +
												  '<span class="caret"></span>' +
												'</button>' +
												'<ul class="dropdown-menu">' +
												  '<li><a href="javascript: SendData(\'' + num_com + '\',0, 1)"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Enviar alerta</a></li>' +
												  '<li role="separator" class="divider"></li>' +
												  '<li><a href="javascript: SendData(\'' + num_com + '\', \'' + idd_det_com + '\',2)">Entregado</a></li>' +
												  '<li><a href="javascript: SendData(\'' + num_com + '\', \'' + idd_det_com + '\',3)">Devuelto</a></li>' +
												  '<li><a href="javascript: SendData(\'' + num_com + '\', \'' + idd_det_com + '\',4)">Devuelto por cliente</a></li>' +
												  '<li><a href="javascript: SendData(\'' + num_com + '\', \'' + idd_det_com + '\',6)">Despachado</a></li>' +
												  '<li><a href="javascript: SendData(\'' + num_com + '\', \'' + idd_det_com + '\',5)">Entregado parcial</a></li>' +
												'</ul>' +
											  '</div>' +
										'</td>' +
										'<td>'+ num_com +'</td>' +
										'<td>'+ orden_det_com +'</td>' +
									'</tr>');
									
			successOne(num_com, orden_det_com, idd_det_com);
			
			//console.log('Este es el nuevo dato: ' + respuesta.Detalle[x]["IDD"]);						
						
			}//Fin del for
			
		setTimeout(function(){ verRuta(); }, 2000);
		}		
}//Fin Result Guía




//Insertar nuevos registros
/*function tempBrunitox(x,y){
	 var x;
	 var y;
	 console.log('Numero de comprobante: ' + x);
	 console.log('Orden: ' + x);
}*/

	function successOne(x,y,idd){
		var x;
		var y;
		var idd;
        var  db = window.openDatabase("ERPITRISLOG2", "1.0", "Guia de Transporte", 200000);
		db.transaction(function queryDBUno(tx) {
			tx.executeSql("INSERT INTO erp_gui_tra (id, entero, orden) values ('"+ x +"', '"+ idd + "', ' "+ y + "') ", [], function querySuccessUno(tx, results) {

			console.log('Numero de comprobante: ' + x);
	 		console.log('Orden: ' + x);
			 
			window.localStorage.setItem('insert', 'true');

			}, function errorCBUnoo(err) {
				console.log("errorCBUnoo(err) | Error : " + err.code);
			});
		}, function errorCBUno(err) {
			console.log("errorCBUno(err) | Error processing SQL: " + err.code);
		});
	}


//Fin Insertar nuevos registros





/* Testeo la conexi�n */
    $("#conexion").click(function(){
        console.log('Hiciste click en el botón con ID "conexion". ');
                var url = window.localStorage.getItem("server");
                $("#conectandonos").show();
                $.getJSON("http://leocondori.com.ar/app/local/testws.php", {ws: url}, resultConn, "json");          
        })

/* Funci�n captura la respuesta del testeo de conexi�n */
		function resultConn(respuesta){
			if (respuesta.valor == 1){
				$("#conectandonos").hide();				   
				//alert('Conexi�n creada con �xito.');
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

/* Funci�n que captura la respuesta del testeo del login */
    function ItsLogin(Response){
        if (Response.ItsLoginResult == 1){
            $("#conectandonos").hide();				   
            //alert('Error : ' + Response.motivo);
			navigator.notification.alert(Response.motivo, alertDismissed, 'Eventos Logistica', 'Aceptar');
        }else{
            $("#conectandonos").hide();
            //alert('Login realizado con �xito: ' + Response.session);
			navigator.notification.alert(Response.session, alertDismissed, 'Eventos Logistica', 'Aceptar');
        }
    }		

//Funci�n de conexi�n.
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
	states[Connection.NONE]     = '¡Atención! tu dispositivo no tiene conexion a datos, no podrás sincronizar, sin embargo podrés seguir trabajando de manera offline.';

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

//Bot�n atr�s
function onBackKeyDown(){
			navigator.notification.vibrate(1000);
            navigator.notification.confirm(
            '¿Estas seguro que queres salir de la aplicacion?',  // message
            onConfirm, // callback
            'Logistica 1.0:', // title
            ['Si, salir', 'Cancelar'] // buttonName
			);
		}
		
// Funci�n activada. Bot�n Men�.
function onMenuKeyDown() {
	//alert('No hay opciones de menu disponible por el momento');
						navigator.notification.vibrate(900);
						navigator.notification.alert('No hay opciones de menu disponible por el momento', 
						alertDismissed, 
						'Logística 1.0', 
						'Aceptar');     
	}
//Funci�n Sleep
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
	
function agregar(){
    console.log('ejecutaste el bot�n agregar');
    //navigator.notification.alert('Ejecutaste el bot�n agregar', alertDismissed, 'Eventos Logistica', 'Aceptar');
	
	//Ejecuto el lector de c�digo de barras
    cordova.plugins.barcodeScanner.scan(
        //Si el scaneo del barcode Scanner funciona ejecuta la funci�n result
        function (result) {  
            //Guardamos el resultado del c�digo QR o c�digo de barras en una variable
            var codigoQR=result.text;
            //Introducimos esa variable en el campo 
            //ANDA ESCRIBE RESULTADOS
			//$('#guianumero').html('<input type="hidden" class="form-control" id="CodBarrasLeido" value="'+codigoQR+'">');
			navigator.notification.alert('Elegiste cargar en tu aplicación la siguiente guia de transporte' + codigoQR, alertDismissed, 'Eventos Logistica', 'Aceptar');
			traerGuia(codigoQR);
			//Llamo nuevamente al l�ctor de c�digo de barras.
			//loop(codigoQR);  
        }, 
        //Si no, ejecuta la funci�n error.
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
	
    console.log('ejecutaste el boton Ruta con este valor');
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
//Mostrar los par�metros de conexi�n al WS.
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
	//$('#navbar').collapse('hide');
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



function onPrompt(results) {
    alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
}

function ItsPrompt(){
navigator.notification.prompt(
    'Please enter your name',  // message
    onPrompt,                  // callback to invoke
    'Registration',            // title
    ['Ok','Exit'],             // buttonLabels
    'Jane Doe'                 // defaultText
);
}


//Base de datos
function creaDB(){
	db = window.openDatabase("ERPITRISLOG2", "1.0", "Guia de Transporte", 200000);
	db.transaction(creaNuevaDB, errorDB, crearSuccess);
	}

function creaNuevaDB(tx){
	console.log("Creando base de datos.");
	
	//tx.executeSql('DROP TABLE IF EXISTS erp_gui_tra');

	//Creo la tabla ERP_EMPRESAS
	tx.executeSql('DROP TABLE IF EXISTS erp_gui_tra');
	var empresas = "CREATE TABLE IF NOT EXISTS erp_gui_tra ( " +
		  		   "id VARCHAR(50) PRIMARY KEY, " +
		           "entero VARCHAR(10), " +
				   "orden VARCHAR(13) )";			   
	tx.executeSql(empresas);
}

function crearSuccess(){
	console.log('La base y tablas se crearon con �xito.');
	//Marco a la aplicaci�n para que sepa que la base de datos ya est� creada.
	window.localStorage.setItem("existe_db", 1);
}

function errorDB(err){
	console.log("Error procesando SQL:" + err.message);
	navigator.notification.alert("Existio un error a nivel SQL: " + err.message, alertDismissed, 'Logistica', 'Ok');
}


// process the confirmation dialog result
function onConfirm(buttonIndex) {
    //alert('You selected button ' + buttonIndex);
	if(buttonIndex==1){
		//Ejecuto la funci�n para depurar la tabla y crearla de nuevo.
		creaDB();
		volverAbout();
		$("#log").html('<div class="alert alert-info" role="alert">¡Excelente! ya tenés tu base de datos regenerada.</div>');
		$("#log").fadeOut(5000);
		//setTimeout(function(){  }, 2000);
		
	}
}
// process the confirmation dialog result
function onConfirmApp(buttonIndex) {
    //alert('You selected button ' + buttonIndex);
	if(buttonIndex==1){
		//Ejecuto la funci�n para depurar la app completa.
		localStorage.clear();
		location.reload();
	}
}

// Show a custom confirmation dialog
//
function depuraBase() {
    navigator.notification.confirm(
        'Estas seguro que querés depurar la base de datos? Esto borrara las guía de transportes que tengas guardadas.', // message
         onConfirm,            // callback to invoke with index of button pressed
        'Borrar base de datos',           // title
        ['Proceder','Salir']         // buttonLabels
    );
}

function depuraApp() {
    navigator.notification.confirm(
        'Todos los datos de esta aplicación se eliminarán permanentemente, incluído todos los archivos, ajustes, cuentas, bases de datos, etc', // message
         onConfirmApp,            // callback to invoke with index of button pressed
        '¿Elim datos aplicación?',           // title
        ['Proceder','Salir']         // buttonLabels
    );
}

//Ver la guía de transporte guardada

function syncPrepare(){
	var  db = window.openDatabase("ERPITRISLOG2", "1.0", "Guia de Transporte", 200000);
	db.transaction(syncArt, errorDB);
}

function syncArt(tx){
	console.log("Buscando guía de transporte guardada...");
	tx.executeSql('select * from erp_gui_tra', [], syncArtSuccess, errorDB);
}

function syncArtSuccess(tx, results){
	console.log("Recibidos de la base de datos erp_gui_tra " + results.rows.length + " registros");
	if(results.rows.length == 0){
		console.log("La tabla erp_gui_tra está vacía.");
		navigator.notification.alert("No hay guía de transporte guardada.", alertDismissed, 'Logistica', 'ok');
	}else{
	$("#GuiaDeTransporte").html('');		
		var contenido =[];
		for(var i=0; i<results.rows.length; i++){
				var art = results.rows.item(i);
				contenido[i]=(art.id, art.entero, art.orden);
				
				//console.log(art.id);
				//console.log(art.orden);
				//console.log('Aca recupere el IDD--> ' + art.entero);
//<a href="javascript: ToolsButton()">				
$("#GuiaDeTransporte").append('<tr>' +
										'<td>' +
											'<div class="btn-group" role="group">' +
												'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
												  'Ejecutar' +
												  '<span class="caret"></span>' +
												'</button>' +
												'<ul class="dropdown-menu">' +
												  '<li><a href="javascript: SendData(\'' + art.id + '\',0, 1)"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Enviar alerta</a></li>' +
												  '<li role="separator" class="divider"></li>' +
												  '<li><a href="javascript: SendData(\'' + art.id + '\', \'' + art.entero + '\',2)">Entregado</a></li>' +
												  '<li><a href="javascript: SendData(\'' + art.id + '\', \'' + art.entero + '\',3)">Devuelto</a></li>' +
												  '<li><a href="javascript: SendData(\'' + art.id + '\', \'' + art.entero + '\',4)">Devuelto por cliente</a></li>' +
												  '<li><a href="javascript: SendData(\'' + art.id + '\', \'' + art.entero + '\',6)">Despachado</a></li>' +
												  '<li><a href="javascript: SendData(\'' + art.id + '\', \'' + art.entero + '\',5)">Entregado parcial</a></li>' +
												'</ul>' +
											  '</div>' +
										'</td>' +
										'<td>'+ art.id +'</td>' +
										'<td>'+ art.orden +'</td>' +
									'</tr>');
									
													
				/*//E|Entregado|D|Devuelto|C|Devuelto por causa del cliente|S|Despachado|P|Entregado parcial
				$("#jsonPed").append('<button type="button" id="paraCen" onclick="erpCenNow(\''+art.id+'\', \''+art.fk_erp_empresas+'\', \''+art.fk_erp_articulos+'\', \''+art.precio+'\', \''+art.cantidad+'\')" class="list-group-item">Empresa: '+art.fk_erp_empresas+' | Artículo: '+ art.fk_erp_articulos +'</button>');
				*/
            }//Fin del bucle FOR
			
			//Ahora te llevo a la sección RUTA con un delay de 1 segundo
			//setTimeout(function(){ verRuta(); }, 1000);
			verRuta();			
	}//Cierro el else	
}//Fin de la función syncArtSuccess

function SendData(id, idd, proceso){
	var id;
	var idd;
	var proceso;
	//alert(':-)');
	//alert('Enviar correo a este ID ' + id + ' para realizar este proceso ' + proceso + ' y este es el IDD ' + idd);	
	
	var server = window.localStorage.getItem('server');
	var base = window.localStorage.getItem('base');
	var user = window.localStorage.getItem('user');
	var pass = window.localStorage.getItem('pass');
	
	
	//Valido, si el proceso es 1 entonces debo mandar mail.
	if(proceso == 1){
		$.getJSON("http://leocondori.com.ar/app/logistica/www/sendmail.php", {ws: server, base:base, usuario:user, pass:pass, guia: id, idd: idd}, resultMail, "json");	
	}else{
		alert('Enviar correo a este ID ' + id + ' para realizar este proceso ' + proceso + ' y este es el idd: ' + idd);
		$.getJSON("http://leocondori.com.ar/app/logistica/www/modify.php", {ws: server, base:base, usuario:user, pass:pass, guia: id, idd: idd, accion: proceso}, resultModify, "json");	
	}				
}


function resultMail(respuesta){
			$("#falseprogress").hide();
	
			if(respuesta.ItsLoginResult == 1){			
				alert('Error : ' + respuesta.motivo);
				$("#progress").fadeOut(6000);
				console.log('Si hay error entró acá');
			}else{
				alert(respuesta.ItsLoginResult);
				/*
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
				*/
				//document.getElementById("progressB").style.display = "initial";
			}
	}
	
function resultModify(respuesta){
		
	if(respuesta.ItsLoginResult != 0){
		alert('Error resultModify : ' + respuesta.motivo);
	}else{
		alert('resultModify ok : ' + respuesta.mensaje);
	}
	
}	