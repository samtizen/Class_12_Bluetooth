BluetoothTizenServer = (function() {
	
	function BluetoothTizenServer() {
		
		this.adapter = null;
		this.clientDevice = null;
		this.serviceUUID = null;
		this.serviceName = "Simple Service";
		this.serviceHandler = null;
		this.serviceSocket = {};
	}
	
	BluetoothTizenServer.prototype = {
		
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
						
						console.log("name:" + device.name + " address:" + device.address + 
								" powered:" + device.powered + " visible:" + device.visible);
						
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
						
						self.clientDevice = device;
						
					}
					function onerrorGetDevice(e) {
						
						console.log(e);
						
					}
					
				}
			},
				
			bondServerAndClient : function(clientDeviceAddress) {
				
				if (this.adapter) {
				
					this.adapter.createBonding(clientDeviceAddress, onsuccessBonding, onerrorBonding);
					
					function onsuccessBonding(deviceBonding) {
							
						console.log(deviceBonding);
						console.log("isBonded:" + deviceBonding.isBonded + " isConnected:" + deviceBonding.isConnected 
									+ " isTrusted:" + deviceBonding.isTrusted);
						console.log(deviceBonding.uuids);
							
					}
					function onerrorBonding(e) {
						
							console.log(e);
					}
					
				}
			},
			
			unbondServerAndClient : function(clientDeviceAddress) {
				if (this.adapter) {
					this.adapter.destroyBonding(clientDeviceAddress);
				}
			},
			
			registerServiceByUUID : function(serviceId, callbackMessageView, callbackStatusView) {
				
				if (this.adapter) {
				
					var self = this;
					
					this.adapter.registerRFCOMMServiceByUUID(serviceId, this.serviceName, onsuccessRegister, onerrorRegister);
					
					function onsuccessRegister(recordHandler) {
						
						self.serviceHandler = recordHandler;
						
						if (callbackStatusView)
							callbackStatusView(recordHandler.uuid);
						
						console.log("registerRFCOMMServiceByUUID");
						console.log(recordHandler);
						
						recordHandler.onconnect = function(socket)
						{
														
							console.log("Client connected: " + socket.peer.name + "," + socket.peer.address);
							
							self.serviceSocket[socket.peer.address] = socket;
							
							console.log(self.serviceSocket);
							
							socket.onmessage = function()
							{
								var data = socket.readData();
								
								var input = String.fromCharCode.apply(String, data);
							
								var inputObj = JSON.parse(input);
								
								if (callbackMessageView)
									callbackMessageView(inputObj["sender"], inputObj["message"], new Date(), false);
								
								console.log(input);
							};
							
							socket.onclose = function()
							{
								delete self.serviceSocket[socket.peer.address];
								
								console.log("Service socket was closed");
							};
							
						};
					}
					
					function onerrorRegister(e) {
						
						console.log(e);
						
					}
				}
			},
			
			unregisterServiceByUUID : function() {
				
				if (this.serviceHandler != null) {
					
					this.serviceHandler.unregister(onsuccessUnregister, onerrorUnregister);
					
					var self = this;
					
					function onsuccessUnregister() {
						
						self.serviceHandler = null;
						console.log("Service was unregistered");
					}
					function onerrorUnregister(e) {
						
						console.log(e);
						
					}
					
				}
				
			},
			sendMessage : function(message, recipients, callbackView) {
				
				var i = 0,
					lenList = recipients.length;
				
				for (i; i < lenList; i++) {
					
					var curSocket = this.serviceSocket[recipients[i]]
					
					if (curSocket != null && curSocket.state == "OPEN") {
						
						var sender = "SERVER";
						
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
						
						curSocket.writeData(output);
						
						callbackView(sender, message, new Date(), true);
						
					}
				}
			},

	};
	
	return BluetoothTizenServer;
	
})();