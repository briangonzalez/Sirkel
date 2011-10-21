
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head profile="http://gmpg.org/xfn/11">
	<title>JHeartbeat 0.1 Beta</title>
	<script src="jquery-1.0.1.pack.js" type="text/javascript"></script>
	<script src="heartbeat.js" type="text/javascript"></script>
	<style>
	BLOCKQUOTE {
		background-color: #DDF;
		border: 1px dashed #00D;
		width: 50%;
	}
	</style>
</head>
<body>

<h1>JHeartbeat 0.1.1 Beta</h1>

<script>
$(document).ready(function() {
	$.jheartbeat.set({
		url: "heartbeat.asp",
		delay: 3000
	});
});
</script>


<p>
	Download links:
	<ul>
		<li><a href="heartbeat.zip">Download without JQuery (2 KB)</a></li>
		<li><a href="heartbeat_wJQuery.zip">Download with JQuery (11 KB)</a></li>
	</ul>
</p>

<p>JHeartbeat is a plugin for <a href="http://jquery.com/" target="_blank">JQuery 1.0.1</a> that allows a web page to periodically poll the server.  This polling can be used to keep the user's session alive or to download updated information.</p>

<p>To use JHeartbeat, add the following to the HEAD section of your website.</p>

<p>
	<blockquote>
		<pre>
	&lt;script type="text/javascript" src="heartbeat.js"&gt;&lt;/script&gt;</pre>
	</blockquote>
</p>

<p>Next, initialize the JTicker plugin by adding the following code:</p>

<p>
	<blockquote>
		<pre>
	$(document).ready(function() {
		$.jheartbeat.set({
			<strong>url: "heartbeat.asp"</strong>,
			<strong>delay: 3000</strong>
		}<em>, function () {
			// Callback Function
		}</em>);
	});</pre>
	</blockquote>
</p>

<p>The options (Bolded) are recommended.  You can omit either of them, but then defaults will be used.  The callback function (Italics) is optional.  When the JHeartbeat object is set, a hidden div with the id of HeartBeatDIV is created.  The contents of the "heartbeat" page will be loaded into this div.  You can use the callback function to manipulate this data if need be.  A sample "heartbeat" page is included in the Zip file.</p>


</body>
</html>