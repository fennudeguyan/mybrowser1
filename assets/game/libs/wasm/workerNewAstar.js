importScripts('workerAstar.js?v=12', 'astar.js?v=12');


var _pathFinder = null;
async function initPathFinding(blockData, width, height) {
	if(!_pathFinder){
		_pathFinder = new self.PathFinder();
		await _pathFinder.init();
	}
	// 清理资源
	_pathFinder.cleanup();
	//创建
	_pathFinder.createMap(width, height);
	// 更新地图
	_pathFinder.updateMap(blockData);
}

onmessage = function(event){
	var data=event.data;
	console.log("子线程收到");
	var myType = data[7];
	var blockData = data[0];
	var width = data[1];
	var height = data[2];
	var startX = data[3];
	var startY = data[4];
	var endX = data[5];
	var endY = data[6];
	
	if(myType == "astarInit"){
		if(!_pathFinder){
			_pathFinder = new self.PathFinder();
			_pathFinder.init();
		}
	}
	else if(myType == "astarUpdateData"){
		// 清理资源
		_pathFinder.cleanup();
		//创建
		_pathFinder.createMap(width, height);
		// 更新地图
		_pathFinder.updateMap(blockData);
	}
	else if(myType == "astarFindRoad"){
		var path = _pathFinder.findPath(startX, startY, endX, endY);
			
		postMessage(path);
	}
	
	console.log("子线程收到,type="+myType);
	//console.log(data);
	/**var myType = data[7];
	if(myType != null && myType == "MyAstar"){
		var blockData = data[0];
		var width = data[1];
		var height = data[2];
		var startX = data[3];
		var startY = data[4];
		var endX = data[5];
		var endY = data[6];
		var startTime = new Date().getTime();
		
		var astar = new SmoothAstar();
		astar.init(blockData, width, height);
		var ret = astar.findPath(
			{x: startX, y: startY},  // 起点
			{x: endX, y: endY}  // 终点
		);
		astar.clear();

		//var mAStar = new UtilAStar;
		//mAStar.TheInit(blockData,width,height,startX,startY,endX,endY);
		//var ret = mAStar.findPath();
		
var endTime = new Date().getTime();
console.log("花费1-" + (endTime-startTime));
		//console.log(ret);
		//mAStar.TheDest();
		endTime = new Date().getTime();
console.log("花费2-" + (endTime-startTime));
		postMessage(ret);

	}**/
}