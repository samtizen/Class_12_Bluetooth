
(function () {
	
	var bluetoothMain = {},
		bluetoothClient,
		bluetoothView;
	
	bluetoothMain.init = function() {

		// Init
		$().ready(initMain);
		
		// Page 1: bluetooth-main
		$("#bluetooth-main").on("pagebeforeshow", displayBTMain);
		$("#btn-settings").click(showSettingsPage);
		$("#btn-send-msg").click(sendMessage);

		// Page 2: bluetooth-settings
		$("#bluetooth-settings").on("pagebeforeshow", displayBTSettings);
		
		$("#btn-back-main-settings").click(backToMainFromSettings);
		$("#btn-save-settings").click(saveSettings);
		
		$("#btn-get-adapter").click(getAdapter);
		$("#btn-discovery-devices").click(discoveryDevices);
		$("#btn-bond-devices").click(bondDevices);
		$("#btn-connect-service").click(connectToService);
		
		
		bluetoothView = new BluetoothViewClient();
		bluetoothClient = new BluetoothTizenClient();
	};
	
	// Init
	function initMain() {
		
		console.log("Init");
		
		if (localStorage.getItem("server"))
			$("#txt-service-address").val(localStorage.getItem("server"));
		else
			$("#txt-service-address").val("50:C8:E5:C2:E5:AB");
		
		if (localStorage.getItem("service"))
			$("#txt-service-id").val(localStorage.getItem("service"));
		else
			$("#txt-service-id").val("3AE5E916-ECBF-11E6-B006-92361F002671");
		
		if (localStorage.getItem("nickname"))
			$("#txt-nickname").val(localStorage.getItem("nickname"));
		
		bluetoothView.showStatusAdapter(bluetoothClient.adapter);
		bluetoothView.showStatusBondDevice(bluetoothClient.serverDevice);
		bluetoothView.showStatusService(bluetoothClient.serviceUUID);
		//bluetoothClient.connectToServerDevice(bluetoothClient.serviceUUID);
	}
	
	// Page 1: bluetooth-main
	function displayBTMain() {
		$("#bluetooth-main").css("display", "block");
		$("#bluetooth-settings").css("display", "none");
	}
	function showSettingsPage() {
		
		tau.changePage("bluetooth-settings", {transition: "flip", reverse: false});
		
	}
	function sendMessage() {
		
		var msgText = $("#txt-message").val();
		//msgText += "\n";
		bluetoothClient.sendMessage(msgText, bluetoothView.showMessage);
	}
	
	// Page 2: bluetooth-settings
	function displayBTSettings() {
		$("#bluetooth-main").css("display", "none");
		$("#bluetooth-settings").css("display", "block");
	}
	function backToMainFromSettings() {
		
		var nickname = $("#txt-nickname").val();
		
		if(!nickname) {
			
			if (!localStorage.getItem("nickname") && bluetoothClient.adapter.name)
				localStorage.setItem("nickname", bluetoothClient.adapter.name);
			
		} 
		
		tau.back();
		
	}
	function saveSettings() {
		
		var serverAddress = $("#txt-service-address").val();
		var serviceId = $("#txt-service-id").val();
		var nickname = $("#txt-nickname").val();
		
		localStorage.setItem("server", serverAddress);
		localStorage.setItem("service", serviceId);
		localStorage.setItem("nickname", nickname);
		
		bluetoothClient.adapter.setName("nickname", onsuccess);
		
		function onsuccess() {
			
			console.log("New Adapter Name; " + bluetoothClient.adapter.name);
			
			tau.back();
		}

	}
	function getAdapter() {
		
		bluetoothClient.getAdapter();
	
		bluetoothView.showStatusAdapter(bluetoothClient.adapter);
		
		bluetoothView.showNickname(bluetoothClient.adapter.name);
	}
	function discoveryDevices() {
		
		bluetoothClient.discoveryDevices();
		
	}
	function bondDevices() {
		
		var serverAddress = $("#txt-service-address").val();
		
		bluetoothClient.bondServerAndClient(serverAddress, bluetoothView.showStatusBondDevice);
		
	}
	function connectToService() {
		
		var serviceId = $("#txt-service-id").val();
		
		bluetoothClient.connectToServerDevice(serviceId, bluetoothView.showMessage, bluetoothView.showStatusService);
		
	}
	
	return bluetoothMain;
	
})().init();