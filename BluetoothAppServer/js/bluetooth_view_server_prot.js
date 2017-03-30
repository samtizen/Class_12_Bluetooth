BluetoothViewServer = (function() {
	
	function BluetoothViewServer() {
		
		
	}
	
	BluetoothViewServer.prototype = {
			
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
					$status.val("Your Service is not registered");
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
			showClients: function(clients, recipients) {
				
				var htmlCode = "",
					checked = false;
			
				for (var key in clients) {
					
					htmlCode += '<div class="ui-user-block">' +
									'<label>' + 
										'<input id="'+ clients[key].peer.address +'"class="ui-checkbox ui-content-checkbox"  type="checkbox" value="'+ 
												clients[key].peer.address +'"  style="vertical-align:middle;"/>' +
											'<span style="margin-left:10px;">'+ clients[key].peer.name +'</span><br>' +
											'<span style="margin-left:10px; font-size:16px">'+ clients[key].peer.address +'</span>' +
									'</label>' +
								'</div>';
					
				}
				$("#users-window").html(htmlCode);
				
				var i = 0,
					lenList = recipients.length;
				
				for (i; i < lenList; i++) {
					document.getElementById(recipients[i]).checked = true;
				}	
					
			}
			
	}
	
	
	return BluetoothViewServer;
})();