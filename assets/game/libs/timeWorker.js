function timedCount()
{
	postMessage("timer worker frame"),
	setTimeout("timedCount()",16.66666666666667)
}
timedCount();