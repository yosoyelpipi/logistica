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
$accion = $_GET["accion"];
$idd = $_GET["idd"];
$fua='';

$tipo = substr($id, 0, -1);
$num_com = substr($id, 0, -1); 
//GrabarTXT($fua,'FEC_ULT_ACT');


/*
$ws = "http://itris.no-ip.com:3000/ITSWS/ItsCliSvrWS.asmx?WSDL";
$bd = "TOMA_INVENTARIO";
$user = "lcondori";
$pass = "123";
$id = 'DFB 000100000101';
$accion = 6;
$idd = '350';
$fua='';
//Este no tiene mail $id='DFBA000100010209';
//$id='DFBA000100010209';

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
		    //echo '<br>Esto paso con el login: '.$ItsLoginResult = $login['ItsLoginResult'];		
		    $session = $login['UserSession'];
            //echo json_encode(array("ItsGetDataResult"=>$ItsGetDataResult, "motivo"=>$err));
            if($login['ItsLoginResult'] <> 0){
                //Me loguee CON problemas.
                            $LastErro = $client->call('ItsGetLastError', array('UserSession' => $session) );
                            /*
                            <ItsGetLastErrorResult>int</ItsGetLastErrorResult>
                            <Error>string</Error>
                            */
                            $err = utf8_encode($LastErro['Error']);
                            echo json_encode(array("ItsLoginResult"=>$LastErro['ItsGetLastErrorResult'], "motivo"=>$err));
                            //->
                            $texto = $ItsGetDate.' - '.$ws.' | '.$user.' | '.$err;
                            GrabarTXT($texto,"ItsExceptions");
                        }else{
                                $ItsPrepareModify = $client->call('ItsPrepareModify', array('UserSession' => $session, 'ItsClassName' => 'ERP_DET_GUI_TRA', 'IDRecord'=>$idd) );				
                                $ItsPrepareModifyResult = $ItsPrepareModify ["ItsPrepareModifyResult"];
                            
                                if($ItsPrepareModifyResult <> 0){
                                    $LastErro = $client->call('ItsGetLastError', array('UserSession' => $session) );
                                    //Me guardo el resultado en una variable.
                                    //echo  $LastErro['Error'];
                                    echo json_encode(array("ItsLoginResult"=>1, "motivo"=>$LastErro['Error']));
                                }else{
                                //echo '<br>Este es el DataSession: '.$DataSession = $ItsPrepareModify["DataSession"];
                                $DataSession = $ItsPrepareModify["DataSession"];

                                $ItsGetRecord = $client->call('ItsGetRecord', array('UserSession' => $session, 'ItsClassName' => 'ERP_DET_GUI_TRA', 'IDRecord' => $idd ) );
                               // echo '<br>Esto es lo que dice el: ItsGetRecordResult-> '.$ItsGetRecordResult = $ItsGetRecord['ItsGetRecordResult'];
                                
                                if($ItsGetRecord['ItsGetRecordResult'] <> 0){
                                    $LastErro = $client->call('ItsGetLastError', array('UserSession' => $session) );
                                    //Me guardo el resultado en una variable.
                                    //echo  $LastErro['Error'];
                                    echo json_encode(array("ItsLoginResult"=>1, "motivo"=>$LastErro['Error']));
                                }else{
                                
                                        $XMLData = $ItsGetRecord['XMLData'];
                                        //GrabarXML($XMLData, 'ERP_DET_GUI_TRA_INI');
                                        
                                        $ITS = new SimpleXMLElement($XMLData);
                                        
                                        if($accion == 2){
                                            //$ITS->ROWDATA->ROW['ESTADO']="Entregado";
                                            $ITS->ROWDATA->ROW['Z_ESTADO']="Entregado";
                                            $accion = "Entregado";    
                                        }
                                        
                                        if($accion == 3){
                                            $ITS->ROWDATA->ROW['Z_ESTADO']="Devuelto";
                                            $accion = "Devuelto";    
                                        }
                                        
                                        if($accion == 4){
                                            $ITS->ROWDATA->ROW['Z_ESTADO']="Devuelto por causa del cliente";
                                            $accion = "Devuelto por causa del cliente";    
                                        }
                                        
                                        if($accion == 5){
                                            $ITS->ROWDATA->ROW['Z_ESTADO']="Entregado parcial";
                                            $accion = "Entregado parcial";    
                                        }
                                        
                                        if($accion == 6){
                                            $ITS->ROWDATA->ROW['Z_ESTADO']="Despachado";
                                            $accion = "Despachado";    
                                        }
                                        
                                        //E|Entregado|D|Devuelto|C|Devuelto por causa del cliente|S|Despachado|P|Entregado parcial
                                        //Guardo el archivo con la modificación
                                        $iXMLData = $ITS->asXML();
                                        //GrabarXML($iXMLData, 'ERP_DET_GUI_TRA_FIN');
                                        
                                        $ItsSetData = $client->call('ItsSetData', array('UserSession' => $session, 'DataSession' => $DataSession, 'iXMLData' => $iXMLData ) );                                           
                                        //$ItsSetDataResult = $ItsSetData['ItsSetDataResult'];
                                        
                                        if($ItsSetData['ItsSetDataResult'] <> 0){
                                            $LastErro = $client->call('ItsGetLastError', array('UserSession' => $session) );
                                            //Me guardo el resultado en una variable.
                                            //echo  $LastErro['Error'];
                                            echo json_encode(array("ItsLoginResult"=>1, "motivo"=>$LastErro['Error']));
                                        }else{
                                            $oXMLData = $ItsSetData['oXMLData'];
                                            //GrabarXML($oXMLData, 'oERP_DET_GUI_TRA_FIN');
                                            
                                            $ItsPost = $client->call('ItsPost', array('UserSession' => $session, 'DataSession' => $DataSession) );
                                            //echo '<br> Esto dijo el ($ItsPost[ItsPostResult]'.$ItsPost['ItsPostResult'];
                                            
								            if($ItsPost['ItsPostResult'] <> 0){
                                                $LastErro = $client->call('ItsGetLastError', array('UserSession' => $session) );
                                                //Me guardo el resultado en una variable.
                                                //echo  $LastErro['Error'];
                                                echo json_encode(array("ItsLoginResult"=>1, "motivo"=>$LastErro['Error']));                                               
                                            }else{
                                                $FinXMLData = $ItsPost['XMLData'];
                                                //GrabarXML($FinXMLData, 'outFinERP_DET_GUI_TRA_FIN');
                                                echo json_encode(array("ItsLoginResult"=>$ItsPost['ItsPostResult'],"Accion"=>$accion, "NumCom"=> $id, "mensaje"=>'Dato insertado con exito'));
                                            }
                                            
                                        }
                                
                                }//Cierre del ELSE ItsGetRecordResult <> 0
                                
                           }//Cierre del ELSE ItsPrepareModifyResult <> 0
                               
                        }//Cierre del ELSE ItsLoginResult <> 0            
}//Fin del ELSE que valida si conectó al WS con éxito.
//E|Entregado|D|Devuelto|C|Devuelto por causa del cliente|S|Despachado|P|Entregado parcial