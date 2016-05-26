<?php
ini_set('max_execution_time', 99000);
ini_set('memory_limit', '-1');
ini_set('max_input_vars','-1');

function ordename ($a, $b) {
    return $a['ORDEN'] - $b['ORDEN'];
}
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
$guia = $_GET["guia"];
$fua='';

//GrabarTXT($fua,'FEC_ULT_ACT');
/*
$ws = "http://itris.no-ip.com:3000/ITSWS/ItsCliSvrWS.asmx?WSDL";
$bd = "TOMA_INVENTARIO";
$user = "lcondori";
$pass = "123";
$fua = '';
$guia = 'TRA 080100000002';
*/
$client = new nusoap_client($ws,true);
	$sError = $client->getError();
	if ($sError) {
		echo json_encode(array("ItsLoginResult"=>1, "motivo"=>"No se pudo conectar al WebService indicado."));
		$texto = $ItsGetDate.' - '.$ws.' | '.$user.' | No se pudo conectar al WebService indicado.';
		GrabarTXT($texto,"ItsExceptions");
	}else{
		$login = $client->call('ItsLogin', array('DBName' => $bd, 'UserName' => $user, 'UserPwd' => $pass, 'LicType'=>'WS') );			
		$error = $login['ItsLoginResult'];
		$session = $login['UserSession'];
		if($error<>0){
					$LastErro = $client->call('ItsGetLastError', array('UserSession' => $session) );
					 $err = utf8_encode($LastErro['Error']);
					echo json_encode(array("ItsLoginResult"=>$error, "motivo"=>$err));
					$texto = $ItsGetDate.' - '.$ws.' | '.$user.' | '.$err;
					GrabarTXT($texto,"ItsExceptions");
				}else{
				$empresas = $client->call('ItsGetRecord', array('UserSession' => $session, 'ItsClassName' => 'ERP_GUI_TRA', 'IDRecord'=>$guia) );
				$ItsGetDataResult = $empresas["ItsGetRecordResult"];
				$DataEmpresas = $empresas["XMLData"];

					if($ItsGetDataResult<>0){
								$LastErro = $client->call('ItsGetLastError', array('UserSession' => $session) );
								$err = utf8_encode($LastErro['Error']);
								echo json_encode(array("ItsGetDataResult"=>$ItsGetDataResult, "motivo"=>$err));
								$texto = $ItsGetDate.' - '.$ws.' | '.$user.' | '.$err;
								GrabarTXT($texto,"ItsExceptions");
							}else{
								//GrabarXML($DataEmpresas, 'guiadetransporte');
								$ITS = new SimpleXMLElement($DataEmpresas);
								//Grabo la variable.
								$fecha = $ITS->ROWDATA->ROW['FECHA'];
								$id = $ITS->ROWDATA->ROW['ID'];
								
								$erp_empresas=simplexml_load_string($DataEmpresas) or die("Error: Cannot create object");
								$array = json_decode(json_encode($erp_empresas), 1);
								$langs = $array['ROWDATA']['ROW']['ERP_DET_GUI_TRA']['ROWERP_DET_GUI_TRA'];
								$count = sizeof($langs);
								$i='';
								if($count==''){$counts=0;} 
								for ($i=0; $i<sizeof($langs); $i++) {
									$langs[$i]['@attributes']['FK_ERP_COM_VEN'];
									$langs[$i]['@attributes']['ORDEN'];
								$detalle = array('FK_ERP_COM_VEN'=>$langs[$i]['@attributes']['FK_ERP_COM_VEN'],'ORDEN'=>$langs[$i]['@attributes']['ORDEN']);									
								$salida[] = $detalle;
								}
								$salidaor=usort($salida, 'ordename');
								//GrabarTxt($salidaor,'array');
								echo json_encode(array("ItsLoginResult"=>$ItsGetDataResult, "ItsGetDate"=>$ItsGetDate, "Cantidad"=>$i,"Fecha"=>$fecha,"Id"=>$id,"Detalle"=>$salida));
								$LogOut = $client->call('ItsLogout', array('UserSession' => $session) );
								//Lo grabo y lo asigno en una variable.
								$iXMLData = $ITS->asXML();
							}		
					}
		}
?>