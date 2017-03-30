/*
 * File: bluetooth_server_main.js
 * Application: Bluetooth Server
 * Author: Sergei Papulin
 * 
 * Bluetooth:
 * https://developer.tizen.org/ko/development/guides/web-application/connectivity-and-wireless/bluetooth?langredirect=1
 * https://developer.tizen.org/dev-guide/latest/org.tizen.web.apireference/html/device_api/mobile/tizen/bluetooth.html
 * https://developer.tizen.org/development/sample/web/Communication/Bluetooth_Chat
 * 
 * AppControl + Bluetooth
 * https://developer.tizen.org/ko/development/guides/web-application/application-management/application-information-and-controls/application-controls/common-application-controls?langredirect=1#settings_bluetooth
 * 
 * Icons: 
 * http://www.flaticon.com/
 * 
 */

(function() {
	
	var bluetoothMain = {},
		bluetoothServer,
		bluetoothView,
		recipients = [];
	
	bluetoothMain.init = function() {
		
		// Init
		$().ready(initMain);
		
		// Page 1: bluetooth-main
		$("#bluetooth-main").on("pagebeforeshow", displayBTMain);
		$("#btn-settings").click(showSettingsPage);
		$("#btn-send-msg").click(sendMessage);
		$("#btn-contacts").click(showAddContacts);

		// Page 2: bluetooth-settings
		$("#bluetooth-settings").on("pagebeforeshow", displayBTSettings);
		
		$("#btn-back-main-settings").click(backToMainFromSettings);
		$("#btn-save-settings").click(saveSettings);
		
		$("#btn-get-adapter").click(getAdapter);
		$("#btn-register-service").click(registerService);
		//$("#btn-unregister-service").click(unregisterService);
		//$("#btn-discovery-devices").click(discoveryDevices);
		
		// Page 3: bluetooth-add-contacts
		$("#bluetooth-add-contacts").on("pagebeforeshow", displayBTContacts);
		
		$("#btn-back-main-contacts").click(backToMainFromContacts);
		$("#btn-save-contacts").click(saveContacts);
		
		
		bluetoothServer = new BluetoothTizenServer();
		bluetoothView = new BluetoothViewServer();
	};
	
	// Init
	function initMain() {
		
		console.log("Init");
		
		if (localStorage.getItem("server"))
			$("#txt-service-address").val(localStorage.getItem("server"));
		
		if (localStorage.getItem("service"))
			$("#txt-service-id").val(localStorage.getItem("service"));
		else
			$("#txt-service-id").val("3ae5e916-ecbf-11e6-b006-92361f002671");
		
		bluetoothView.showStatusAdapter(bluetoothServer.adapter);
		bluetoothView.showStatusRegisterService(bluetoothClient.serviceUUID);
		recipients = localStorage.getItem("recipients").split(",");

	}
	
	// Page 1: bluetooth-main
	function displayBTMain() {
		$("#bluetooth-main").css("display", "block");
		$("#bluetooth-settings").css("display", "none");
		$("#bluetooth-add-contacts").css("display", "none");
	}
	function showSettingsPage() {
		
		tau.changePage("bluetooth-settings", {transition: "flip", reverse: false});
		
	}
	function sendMessage() {
		
		var msgText = $("#txt-message").val();
		//msgText += "\n";
		bluetoothServer.sendMessage(msgText, recipients, bluetoothView.showMessage);
	}
	function showAddContacts() {
		
		console.log("showAddContacts");
		
		tau.changePage("bluetooth-add-contacts", {transition: "flip", reverse: false});
	}
	
	// Page 2: bluetooth-settings
	function displayBTSettings() {
		$("#bluetooth-main").css("display", "none");
		$("#bluetooth-settings").css("display", "block");
		$("#bluetooth-add-contacts").css("display", "none");
	}
	function backToMainFromSettings() {
		
		tau.back();
		
	}
	function saveSettings() {
		
		var serviceId = $("#txt-service-id").val();
		
		localStorage.setItem("service", serviceId);
		
		tau.back();
	}
	function getAdapter() {
		
		bluetoothServer.getAdapter();
	
		bluetoothView.showStatusAdapter(bluetoothServer.adapter);
	}
	function registerService() {
		
		var serviceId = $("#txt-service-id").val();
		
		bluetoothServer.registerServiceByUUID(serviceId, bluetoothView.showMessage, bluetoothView.showStatusService);
	}
	
	// Page 3: bluetooth-add-contacts
	function displayBTContacts() {
		$("#bluetooth-main").css("display", "none");
		$("#bluetooth-settings").css("display", "none");
		$("#bluetooth-add-contacts").css("display", "block");
		
		showClients();
	}
	
	function showClients() {
		
		var clients = bluetoothServer.serviceSocket;
		
		bluetoothView.showClients(clients, recipients);
	}
	
	function backToMainFromContacts() {
		tau.back();
	}
	
	function saveContacts() {
		
		var checkedList = [];
		
		$(".ui-content-checkbox:checkbox:checked").each(function(){
			
			console.log(this.id);
			checkedList.push(this.id);
			
		});
		
		recipients = checkedList;
		
		localStorage.setItem("recipients", checkedList.join(","));
		
		tau.back();
		
	}
	
	/*
	function getAdapter() {
		
		bluetoothServer.getAdapter();
		
	}
	
	function registerService() {
		
		bluetoothServer.registerServiceByUUID();
		
	}
	
	function unregisterService() {
		
		bluetoothServer.unregisterServiceByUUID();
		
	}
	
	function sendMessage() {
		
		bluetoothServer.sendMessage("Hello from Service");
		
	}
	function discoveryDevices() {
		
		bluetoothClient.discoveryDevices();
		
	}
	
	*/
	return bluetoothMain;
	
})().init();