BluetoothTizenClient = (function() {
	
	function BluetoothTizenClient() {
		
		this.adapter = null;
		this.serverDevice = null;
		this.serviceUUID = null;
		this.serviceName = "Simple Service";
		this.clientSocket = null;
	}
	
	BluetoothTizenClient.prototype = {
		
			getAdapter : function() {
				
				try {
					
					this.adapter = tizen.bluetooth.getDefaultAdapter();
					
				}
				catch (e) {
						
					console.log(e);
				}
					
				console.log("name:" + this.adapter.name + " address:" + this.adapter.address + 
						" powered:" + this.adapter.powered + " visible:" + this.adapter.visible);
				
				if (!this.adapter.powered)
				{
				   alert("Bluetooth is not enabled");
				}
				
			},
			
			discoveryDevices : function() {
				
				if (this.adapter) {
					
					var callbackOnsuccessDiscover =	{
						ondevicefound: onsuccessDeviceFound	
					};
					
					this.adapter.discoverDevices(callbackOnsuccessDiscover, onerrorDiscover);
					
					function onsuccessDeviceFound(device) {
						
						//console.log("name:" + device.name + " address:" + device.address + 
						//		" powered:" + device.powered + " visible:" + device.visible);
						
					}
					function onerrorDiscover(e) {
						
						console.log(e);
						
					}
				}
			},
			
			getDeviceByAddress : function(deviceAddress) {
				
				if (this.adapter) {
					
					var self = this;
				
					this.adapter.getDevice(deviceAddress, onsuccessGetDevice, onerrorGetDevice);
					
					function onsuccessGetDevice(device) {
						
						self.serverDevice = device;
						
					}
					function onerrorGetDevice(e) {
						
						console.log(e);
						
					}
					
				}
			},
				
			bondServerAndClient : function(serverDeviceAddress, callbackView) {
				
				console.log();
				
				if (this.adapter != null) {
					
					var self = this;
					
					console.log("bondServerAndClient");
					
					this.adapter.createBonding(serverDeviceAddress, onsuccessBonding, onerrorBonding);
					
					function onsuccessBonding(deviceBonding) {
						
						self.serverDevice = deviceBonding;
						
						if (callbackView) 
							callbackView(self.serverDevice);
						
						console.log(deviceBonding);
						console.log("isBonded:" + deviceBonding.isBonded + " isConnected:" + deviceBonding.isConnected 
									+ " isTrusted:" + deviceBonding.isTrusted);
						console.log(deviceBonding.uuids);
							
					}
					function onerrorBonding(e) {
						alert("Bonding was Failed");
						console.log(e);
					}
					
				}
			},
			
			unbondServerAndClient : function(serverDeviceAddress) {
				if (this.adapter) {
					this.adapter.destroyBonding(serverDeviceAddress);
				}
			},
			
			connectToServerDevice : function(serviceId, callbackMessageView, callbackStatusView) {
				
				if (this.adapter && this.serverDevice) {
					
					if (this.serverDevice.uuids.indexOf(serviceId) != -1)
					{
						var self = this;
						
						this.serverDevice.connectToServiceByUUID(serviceId, onsuccessConnect, onerrorConnect);
						
						function onsuccessConnect(socket) {
							
							self.serviceUUID = serviceId;
							self.clientSocket = socket;
							
							if (callbackStatusView)
								callbackStatusView(serviceId);
							
							socket.onmessage = function() {
								
								var data = socket.readData();
								
								var input = String.fromCharCode.apply(String, data)
								
								var inputObj = JSON.parse(input);
								
								if (callbackMessageView)
									callbackMessageView(inputObj["sender"], inputObj["message"], new Date(), false);
								
								console.log(input);

							};

							socket.onclose = function() {
								if (callbackStatusView)
									callbackStatusView(null);
								
								console.log("Client socket was closed");
							};
							
						}
						function onerrorConnect(e) {
							
							console.log(e);
							
						}
					}
					else
					{
						alert("Service was not found");
						console.log("Service was not found");
					}
					
				}
				
			},
			
			sendMessage : function(message, callbackView) {
				
				if (this.clientSocket != null && this.clientSocket.state == "OPEN")
				{
					var sender = localStorage.getItem("nickname");
					
					var outputObj = {
							sender: sender,
							adapter: this.adapter.address,
							message: message,
						};
					
					var strOutputObj = JSON.stringify(outputObj);
					
					var i = 0,
						lenList = strOutputObj.length,
						output = [];
					
					for(i; i < lenList; i++) {
						
						var code = strOutputObj.charCodeAt(i);
						output.push(code);
					}
					
					this.clientSocket.writeData(output);
					
					if(callbackView)
						callbackView(sender, message, new Date(), true);
					
				}	
			},
			
			closeSocket : function() {
				
				if (this.clientSocket != null && this.clientSocket.state === "OPEN")
				{
			     
					this.clientSocket.close();
					
				}	

			}
				
	};
	
	return BluetoothTizenClient;
	
})();