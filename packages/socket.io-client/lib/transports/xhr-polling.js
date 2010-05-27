/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@rosepad.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2009 RosePad <dev@rosepad.com>
 */

(function(){

	var empty = new Function();

	io.Transport['xhr-polling'] = io.Transport.XHR.extend({

		type: 'xhr-polling',

		connect: function(){
			var self = this;
			this._xhr = this._request(+ new Date, 'GET');
			this._xhr.onreadystatechange = function(){
				var status;
				if (self._xhr.readyState == 4){
					self._xhr.onreadystatechange = empty;
					try { status = self._xhr.status; } catch(e){}
					if (status == 200){
						if (self._xhr.responseText.length) self._onData(self._xhr.responseText);
						self.connect();
					}
				}
			};
			this._xhr.send();
		}

	});

	io.Transport['xhr-polling'].check = function(){
		return io.Transport.XHR.check();
	};

})();