/**
	The missing SVG.toDataURL library for your SVG elements.

	Usage: SVGElement.toDataURL( type, { options } )

	Returns: the data URL, except when using native PNG renderer (needs callback).

	type	MIME type of the exported data.
			Default: image/svg+xml.
			Must support: image/png.
			Additional: image/jpeg.

	options is a map of options: {
		callback: function(dataURL)
			Callback function which is called when the data URL is ready.
			This is only necessary when using native PNG renderer.
			Default: undefined.

		[the rest of the options only apply when type="image/png" or type="image/jpeg"]

		renderer: "native"|"canvg"
			PNG renderer to use. Native renderer¹ might cause a security exception.
			Default: canvg if available, otherwise native.

		keepNonSafe: true|false
			Export non-safe (image and foreignObject) elements.
			This will set the Canvas origin-clean property to false, if this data is transferred to Canvas.
			Default: false, to keep origin-clean true.
			NOTE: not currently supported and is just ignored.

		keepOutsideViewport: true|false
			Export all drawn content, even if not visible.
			Default: false, export only visible viewport, similar to Canvas toDataURL().
			NOTE: only supported with canvg renderer.
	}

	See original paper¹ for more info on SVG to Canvas exporting.

	¹ http://svgopen.org/2010/papers/62-From_SVG_to_Canvas_and_Back/#svg_to_canvas
*/

var test = (function() {
	var my = {};

	my.dataUrls = function (svg, callback) {
		var start = new Date();
		var datas = [];
		var blocks = $(svg).find('g:eq(2) > .blocklyDraggable');
		blocks.each(function () {
			exportImage(this).then(function (data) {
				console.log(data);
				datas.push(data);
				if(datas.length === blocks.length) {
					console.log(new Date() - start);
					callback(datas);
				}
			});
		});
	}

	function XMLSerialize(svg) {
		function XMLSerializerForIE(s) {
			var out = "";

			out += "<" + s.nodeName;
			for (var n = 0; n < s.attributes.length; n++) {
				out += " " + s.attributes[n].name + "=" + "'" + s.attributes[n].value + "'";
			}

			if (s.hasChildNodes()) {
				out += ">\n";

				for (var n = 0; n < s.childNodes.length; n++) {
					out += XMLSerializerForIE(s.childNodes[n]);
				}

				out += "</" + s.nodeName + ">" + "\n";

			} else out += " />\n";

			return out;
		}


		if (window.XMLSerializer) {
			debug("using standard XMLSerializer.serializeToString")
			return (new XMLSerializer()).serializeToString(svg);
		} else {
			debug("using custom XMLSerializerForIE")
			return XMLSerializerForIE(svg);
		}

	}

	var font_family =  "'NanumGothic', '나눔고딕','NanumGothicWeb', '맑은 고딕', 'Malgun Gothic', Dotum";

	function classToStyle(dom, clone_dom, a, b) {
		var $dom = $(dom);
		var $clone_dom = $(clone_dom);

		if($dom.prop('localName') === 'image') {
			a('1');
			(function ($dom, $clone_dom) {
				var image = new Image();
				image.src = $dom.attr('xlink:href');
				image.onload = function () {
					var canvas = document.createElement('canvas');
					canvas.width = image.width;
					canvas.height = image.height;
					var ctx = canvas.getContext("2d");
					ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
					try{
						console.log(canvas.toDataURL());
						$clone_dom.attr('xlink:href', canvas.toDataURL());
						$clone_dom.attr('style', 'width:500px; height:500px');

					} catch(e) {

					}
					b('1');
				}
			})($dom, $clone_dom);
		}

		var style_object = window.getComputedStyle(dom, null);
		var style_text = '';
		for(var i = 0; i < style_object.length; i++) {
			if(style_object[i] === 'font-family') {
				style_text += style_object[i] + ':' + style_object[style_object[i]] + ', ' + font_family + '; ';
				continue;
			}
			style_text += style_object[i] + ':' + style_object[style_object[i]] + '; ';
		}
		$clone_dom.attr('style', style_text);
		var dom_childrens = $dom.children();
		var clone_childrens = $clone_dom.children();
		if(dom_childrens.length > 0) {
			dom_childrens.each(function(idx) {
				classToStyle(this, clone_childrens[idx],a,b);
			});
		}

		if($(clone_dom).parent().length === 0) {
			if($(clone_dom).find('image').length === 0) {
				b();
			}
		}
	}

	function utf8dataURLencode(s, svg_element) {
		var class_set = {};
		var ignore_set = ['blocklyPath', 'blocklyText'];
		var font_family =  "'NanumGothic', '나눔고딕','NanumGothicWeb', '맑은 고딕', 'Malgun Gothic', Dotum";
		var svg_bbox = svg_element.getBBox();
		var transform = $(svg_element).parent().attr('transform');
		var default_width = 400 + (svg_bbox.width );
		var default_height = 400 + (svg_bbox.height );

		var b64 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="' + default_width + '" height="' + default_height + '">' + s + '</svg>';

		return b64;
	}

	function debug(s) {
		console.log("SVG.toDataURL:", s);
	}


	function exportImage(_svg) {
		var defer = $.Deferred();

		(function () {
			var _svg_clone = $(_svg).clone();
			var k = [];
			var d= [];
			classToStyle(_svg, _svg_clone[0], function () {
				k.push('1');
			}, function () {
				d.push('1');

				if(k.length <= d.length) {
				// _svg_clone.attr('transform', 'translate(50,50)');
				var svg_xml = XMLSerialize(_svg_clone[0]);
				var enocode_data = utf8dataURLencode(svg_xml, _svg);
				var svg_img = new Image();
				$('body').append(svg_img);
				svg_img.src = enocode_data;



				svg_img.onload = function() {
					debug("exported image size: " + [svg_img.width, svg_img.height])

					var canvas = document.createElement('canvas');
					canvas.width = svg_img.width;
					canvas.height = svg_img.height;
					var ctx = canvas.getContext("2d");
					ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
					// ctx.drawImage(this, 0, 0);

					var w = canvas.width,
					h = canvas.height,
					pix = {x:[], y:[]},
					enocode_data = ctx.getImageData(0,0,canvas.width,canvas.height),
					x, y, index;

					for (y = 0; y < h; y++) {
						for (x = 0; x < w; x++) {
							index = (y * w + x) * 4;
							if (enocode_data.data[index+3] > 0) {
								pix.x.push(x);
								pix.y.push(y);
							}
						}
					}
					pix.x.sort(function(a,b){return a-b});
					pix.y.sort(function(a,b){return a-b});
					var n = pix.x.length-1;

					w = pix.x[n] - pix.x[0];
					h = pix.y[n] - pix.y[0];
					var cut = ctx.getImageData(pix.x[0]-25, pix.y[0]-25, w+25, h+25);

					canvas.width = w+50;
					canvas.height = h+50;
					ctx.putImageData(cut, 0, 0);

					// SECURITY_ERR WILL HAPPEN NOW
					var png_dataurl = canvas.toDataURL('image/png');
					debug('image/png' + " length: " + png_dataurl.length);

					// if (options.callback) options.callback( png_dataurl );
					// else debug("WARNING: no callback set, so nothing happens.");

					defer.resolve(png_dataurl);
				}

				svg_img.onerror = function() {
					console.log(
						"Can't export! Maybe your browser doesn't support " +
						"SVG in img element or SVG input for Canvas drawImage?\n" +
						"http://en.wikipedia.org/wiki/SVG#Native_support"
					);
					// defer.error();
				}

				}

			});

		})(_svg, defer);

		return defer;
		// NOTE: will not return anything
	}

	return my;
})();
