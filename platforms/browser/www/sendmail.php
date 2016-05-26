<?php
ini_set('max_execution_time', 99000);
ini_set('memory_limit', '-1');
ini_set('max_input_vars','-1');

//Función para ser usada para grabar los archivos que vayan entregando los métodos de Itris.
function GrabarXML($XMLData,$nombre){
							$now = date('Ymd-H-i-s');
							$fp = fopen($nombre.$now.".xml", "a");
							fwrite($fp, $XMLData. PHP_EOL);
							fclose($fp);	
						}

						//Función para ser usada para grabar los archivos que vayan entregando los métodos de Itris.
function GrabarTXT($String,$name){
	$now = date('Ymd-H-i-s');
	$fpt = fopen($name.".log", "a");
	fwrite($fpt, $String. PHP_EOL);
	fclose($fpt);
}
header("Access-Control-Allow-Origin: *");
date_default_timezone_set("America/Argentina/Buenos_Aires");
$ItsGetDate = date("Y/m/d H:i:s");
require_once('lib/nusoap.php');


$ws = $_GET["ws"];
$bd = $_GET["base"];
$user = $_GET["usuario"];
$pass = $_GET["pass"];
$id = $_GET["guia"];
$idd = $_GET["idd"];
$fua='';


//GrabarTXT($fua,'FEC_ULT_ACT');

/*
$ws = "http://itris.no-ip.com:3000/ITSWS/ItsCliSvrWS.asmx?WSDL";
$bd = "TOMA_INVENTARIO";
$user = "lcondori";
$pass = "123";
$fua = '';
//Este no tiene mail $id='DFBA000100010209';
//$id='DFBA000100010209';
$id = 'DFB 000100000101';
//EXISTE MAIL PARA ESTE $id = 'DFB 000100000101';
*/

$client = new nusoap_client($ws,true);
	$sError = $client->getError();
	if ($sError) {
		echo json_encode(array("ItsLoginResult"=>1, "motivo"=>"No se pudo conectar al WebService indicado."));
		$texto = $ItsGetDate.' - '.$ws.' | '.$user.' | No se pudo conectar al WebService indicado.';
		GrabarTXT($texto,"ItsExceptions");
	}else{
		
		$login = $client->call('ItsLogin', array('DBName' => $bd, 'UserName' => $user, 'UserPwd' => $pass, 'LicType'=>'WS') );			
		//->
		$error = $login['ItsLoginResult'];
		
		$session = $login['UserSession'];
		
		if($error<>0){
		//Me loguee CON problemas.
					$LastErro = $client->call('ItsGetLastError', array('UserSession' => $session) );
					 $err = utf8_encode($LastErro['Error']);
					echo json_encode(array("ItsLoginResult"=>$error, "motivo"=>$err));
					//->
					$texto = $ItsGetDate.' - '.$ws.' | '.$user.' | '.$err;
					GrabarTXT($texto,"ItsExceptions");
				}else{
				//Logueado con éxito.
				//Ahora voy a buscar el mail tomando como base el número de comprobante, el cliente y llegar al mail.
				$empresas = $client->call('ItsGetData', array('UserSession' => $session, 'ItsClassName' => 'ERP_APP_MAIL', 'RecordCount'=>'-1', 'SQLFilter'=>"ID = '".$id."'", 'SQLSort'=>'') );
				
				$ItsGetDataResult = $empresas["ItsGetDataResult"];
				
				
				//Ahora verifico si no hubo error al querer recuperar el mail del cliente que tiene la factura.
					if($ItsGetDataResult<>0){
					//Error al recuperar el mail mediante el número de comprobante	
								$LastErro = $client->call('ItsGetLastError', array('UserSession' => $session) );
								$err = utf8_encode($LastErro['Error']);
								echo json_encode(array("ItsGetDataResult"=>$ItsGetDataResult, "motivo"=>$err));
								//->
								$texto = $ItsGetDate.' - '.$ws.' | '.$user.' | '.$err;
								GrabarTXT($texto,"ItsExceptions");
							}else{
								$DataEmpresas = $empresas["XMLData"];
								GrabarXML($DataEmpresas,'ERP_APP_MAIL');
								
								$ITS = new SimpleXMLElement($DataEmpresas);
								$email = $ITS->ROWDATA->ROW['EMAIL'];
								$Camion = $ITS->ROWDATA->ROW['CAMION'];
								$fotoCamion = $ITS->ROWDATA->ROW['FOTO_CAMION'];
								$Chofer = $ITS->ROWDATA->ROW['CHOFER'];
								$fotoChofer = $ITS->ROWDATA->ROW['FOTO_CHOFER'];
								$iXMLData = $ITS->asXML();
				
					//Ejecuté el recupero de mail mediante el número de comprobante sin problemas.			
								if($email==""){
									//->
									//echo '<br> Entré acá porque está el mail vacío';
								//Ahora verifico si el cliente tiene o no mail asociado.	
									$parametros = $client->call('ItsGetData', array('UserSession' => $session, 'ItsClassName' => 'ERP_PARAMETROS', 'RecordCount'=>'-1', 'SQLFilter'=>'', 'SQLSort'=>'') );
									$ItsGetDataResult = $parametros["ItsGetDataResult"];
									$MailParametros = $parametros["XMLData"];
									
									if($ItsGetDataResult<>0){
															$LastErro = $client->call('ItsGetLastError', array('UserSession' => $session) );
															$err = utf8_encode($LastErro['Error']);
															echo json_encode(array("ItsGetDataResult"=>$ItsGetDataResult, "motivo"=>$err));
															$texto = $ItsGetDate.' - '.$ws.' | '.$user.' | '.$err;
															GrabarTXT($texto,"ItsExceptions");
									}else{
											//No tiene mail mail...debo usar la de parámetros.
											//echo '<br>  No tiene mail mail...debo usar la de parámetros.';
											$ITS = new SimpleXMLElement($MailParametros);
											$emailDepo = $ITS->ROWDATA->ROW['MAIL_ADM_DEPO'];
											//Lo grabo y lo asigno en una variable.
											$iXMLData = $ITS->asXML();
											
											$destinatario = $emailDepo; 
											$asunto = "No tiene mail uso el de parametros"; 
											$cuerpo = ' 
											<html> 
											<head> 
											   <title>Como este cliente no tiene mail</title> 
											</head> 
											<body> 
											<h1>Voy a usar el de parámetros</h1> 
											<p> 
											<b>Bienvenidos a mi correo electrónico de prueba</b>. Estoy encantado de tener tantos lectores. Este cuerpo del mensaje es del artículo de envío de mails por PHP. Habría que cambiarlo para poner tu propio cuerpo. Por cierto, cambia también las cabeceras del mensaje. 
											</p>
											<img src="'.$fotoCamion.'">
											<br>
											<img src="'.$fotoChofer.'">
											</body> 
											</html> 
											'; 

				//para el envío en formato HTML 
				$headers = "MIME-Version: 1.0\r\n"; 
				$headers .= "Content-type: text/html; charset=iso-8859-1\r\n"; 

				//dirección del remitente 
				$headers .= "From: Leo Condori <lcondori@gmail.com>\r\n"; 

				//dirección de respuesta, si queremos que sea distinta que la del remitente 
				//$headers .= "Reply-To: mariano@desarrolloweb.com\r\n"; 

				//ruta del mensaje desde origen a destino 
				//$headers .= "Return-path: holahola@desarrolloweb.com\r\n"; 

				//direcciones que recibián copia 
				//$headers .= "Cc: maria@desarrolloweb.com\r\n"; 

				//direcciones que recibirán copia oculta 
				//$headers .= "Bcc: pepe@pepe.com,juan@juan.com\r\n"; 

				if(mail($destinatario,$asunto,$cuerpo,$headers)){
					echo json_encode(array("ItsLoginResult"=>$ItsGetDataResult, "ItsGetDate"=>$ItsGetDate, "Email"=>$emailDepo, "NumCom"=>$id));
				}else{
					echo json_encode(array("ItsLoginResult"=>1, "ItsGetDate"=>$ItsGetDate, "Email"=>$emailDepo, , "NumCom"=>$id, "Motivo"=>'No se pudo enviar el mail.'));
				} 
									}
								}else{
										//echo '<br> Ok, tieme mail el cliente.';
										//GrabarXML($DataEmpresas, 'guiadetransporte');
										$ITS = new SimpleXMLElement($DataEmpresas);
										$emailFac = $ITS->ROWDATA->ROW['EMAIL'];
										//Lo grabo y lo asigno en una variable.
										$iXMLData = $ITS->asXML();
															
											$destinatario = $emailFac; 
											$asunto = "El cliente tiene mail"; 

//incluyo el mail para empresas que tienen mail definido 
include('mail.php');
											

				//para el envío en formato HTML 
				$headers = "MIME-Version: 1.0\r\n"; 
				$headers .= "Content-type: text/html; charset=iso-8859-1\r\n"; 

				//dirección del remitente 
				$headers .= "From: Leo Condori <lcondori@gmail.com>\r\n"; 

				//dirección de respuesta, si queremos que sea distinta que la del remitente 
				//$headers .= "Reply-To: mariano@desarrolloweb.com\r\n"; 

				//ruta del mensaje desde origen a destino 
				//$headers .= "Return-path: holahola@desarrolloweb.com\r\n"; 

				//direcciones que recibián copia 
				//$headers .= "Cc: maria@desarrolloweb.com\r\n"; 

				//direcciones que recibirán copia oculta 
				//$headers .= "Bcc: pepe@pepe.com,juan@juan.com\r\n";
				if(mail($destinatario,$asunto,$cuerpo,$headers)){
					echo json_encode(array("ItsLoginResult"=>$ItsGetDataResult, "ItsGetDate"=>$ItsGetDate, "Email"=>$emailFac, "NumCom"=>$id));
				}else{
					echo json_encode(array("ItsLoginResult"=>1, "ItsGetDate"=>$ItsGetDate, "Email"=>$emailFac,"NumCom"=>$id, "Motivo"=>'No se pudo enviar el mail.'));
				} 															
				//echo json_encode(array("ItsLoginResult"=>$ItsGetDataResult, "ItsGetDate"=>$ItsGetDate, "Email"=>$emailFac));
								}
								$LogOut = $client->call('ItsLogout', array('UserSession' => $session) );								
							}		
					}
		}
?>