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
		var element = document.getElementById('deviceProperties');
		element.innerHTML = 'Device Model: '    + device.model    + '<br />' +
							'Device Cordova: '  + device.cordova  + '<br />' +
							'Device Platform: ' + device.platform + '<br />' +
							'Device UUID: '     + device.uuid     + '<br />' +
							'Device Version: '  + device.version  + '<br />';
    }
};



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
            'Logística 1.0:', // title
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

			//Llamo nuevamente al léctor de código de barras.
			//loop(codigoQR);  
        }, 
        //Si no, ejecuta la función error.
        function (error) {
            notificacion("Ha ocurrido un error al escanear.");
        }
    );
}

function verRuta(){
    console.log('ejecutaste el boton Ruta');
    navigator.notification.alert('Ejecutaste el boton Ruta', alertDismissed, 'Eventos Logistica', 'Aceptar');
}

//Config WS
//Mostrar los parámetros de conexión al WS.
function ToolsButton(){
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
			sleep(5000);
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
						return false;
					}


}