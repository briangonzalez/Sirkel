<%
Response.Expires = 3
Response.Expiresabsolute = Now() - 1
Response.AddHeader "pragma","no-cache"
Response.AddHeader "cache-control","private"
Response.CacheControl = "no-cache"
	
Response.Clear
Response.Write "1"
Response.End
%>