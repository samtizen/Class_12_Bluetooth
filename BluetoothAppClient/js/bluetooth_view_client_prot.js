BluetoothViewClient = (function() {
	
	function BluetoothViewClient() {
		
		
	}
	
	BluetoothViewClient.prototype = {
			
			showStatus: function(adapterId, elementText, elementStatus) {
				
				var $txt = $("#" + elementText),
					$status = $("#" + elementStatus);
				
				if (adapterId != null) {
					$txt.val(adapterId.address);
					$status.css("color", "green");
					$status.text("OK");
				}
				else {
					$txt.val("");
					$status.css("color", "#4d4d4d");
					$status.val("No Adapter");
				}
				
			},
			showStatusAdapter: function(adapter) {
				
				var $txt = $("#txt-my-address"),
					$status = $("#div-my-address-status");
				
				if (adapter != null) {
					$txt.val(adapter.address);
					$status.css("color", "green");
					$status.text("OK");
				}
				else {
					$txt.val("");
					$status.css("color", "#4d4d4d");
					$status.val("No Adapter");
				}
			},
			showStatusBondDevice: function(server) {
				
				var $txt = $("#txt-service-address"),
					$status = $("#div-service-address-status");
				
				if (server != null) {
					$txt.val(server.address);
					$status.css("color", "green");
					$status.text("OK");
				}
				else {
					$status.css("color", "#4d4d4d");
					$status.val("No Bond Device");
				}
			},
			showStatusService: function(service) {
				
				var $txt = $("#txt-service-id"),
					$status = $("#div-service-id-status");
				
				if (service != null) {
					$txt.val(service);
					$status.css("color", "green");
					$status.text("OK");
				}
				else {
					$status.css("color", "#4d4d4d");
					$status.val("No Connection");
				}
			},
			showMessage: function(sender, message, time, isMyMessage) {
				
				var className = "ui-message-block-left";
				if (isMyMessage === true) {
					className = "ui-message-block-right";
					$("#txt-message").val("");
				}
				
				var strTime = time.toLocaleTimeString().split(" ")[0] + " " + time.toLocaleDateString();

				var htmlCode = '<div class="'+className+'">' +
									'<div><p class="ui-chat-nickname"><b>'+sender+'</b><span style="font-size:12px;"> '+ strTime + '</span></p></div>' +
									'<div style="margin:-7px 0px -7px 0px;"><div class="ui-message-triangle"></div></div>' +
									'<div class="ui-message-text-block">' +
									'	<p class="iu-message-text">'+message+'</p>' +
									'</div>' +
								'</div>';
				
				$("#chat-window").prepend(htmlCode);
				
			},
			showNickname: function(adapterName) {
				
				var $txtNick = $("#txt-nickname");
				
				if ($txtNick.val()) {
					
					$txtNick.val(adapterName);
				}		
				
			}
	}
	
	
	return BluetoothViewClient;
})();