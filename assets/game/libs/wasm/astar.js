// astar.js

// SmoothAstar类 - WebAssembly路径查找包装器
class SmoothAstar {
    constructor() {
        this.module = null;
        this.astar = null;
        this.width = 0;
        this.height = 0;
    }

    // 日志级别枚举
    static LogLevel = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };

    // 设置日志级别
    setLogLevel(level) {
        if (!this.module) {
            throw new Error('请先初始化WebAssembly模块');
        }
        this.module.ccall(
            'set_log_level',
            null,
            ['number'],
            [level]
        );
    }

    // 分配内存
    malloc(size) {
        if (!this.module) {
            throw new Error('请先初始化WebAssembly模块');
        }
        return this.module.ccall(
            'js_malloc',
            'number',
            ['number'],
            [size]
        );
    }

    // 释放内存
    free(ptr) {
        if (!this.module) {
            throw new Error('请先初始化WebAssembly模块');
        }
        this.module.ccall(
            'js_free',
            null,
            ['number'],
            [ptr]
        );
    }

    // 初始化WebAssembly模块
    async init() {
        if (this.module) {
            return;
        }
        
        try {
            this.module = self.Module;
            console.log('WebAssembly模块加载成功');
        } catch (error) {
            console.error('WebAssembly模块加载失败:', error);
            throw error;
        }
    }

    // 创建新地图
    createMap(width, height) {
        if (!this.module) {
            throw new Error('请先初始化WebAssembly模块');
        }

        if (this.astar) {
            this.cleanup();
        }

        this.width = width;
        this.height = height;
        
        try {
            this.astar = this.module.ccall(
                'create_astar',
                'number',
                ['number', 'number'],
                [width, height]
            );
            if (!this.astar) {
                throw new Error('创建地图失败');
            }
        } catch (error) {
            console.error('创建地图时发生错误:', error);
            throw error;
        }
    }

    // 更新地图数据
    updateMap(grid) {
        if (!this.astar) {
            throw new Error('请先创建地图');
        }

        try {
            // 检查grid的维度是否正确
            if (!Array.isArray(grid) || !Array.isArray(grid[0]) || 
                grid.length !== this.width || grid[0].length !== this.height) {
                throw new Error(`网格数据维度不正确: 期望 ${this.width}x${this.height}, 实际 ${grid.length}x${grid[0]?.length}`);
            }

            // 分配内存并复制地图数据
            const gridPtr = this.malloc(this.width * this.height * 4);  // 4 bytes per int
            if (!gridPtr) {
                throw new Error('内存分配失败');
            }

            const gridHeap = new Int32Array(this.module.HEAP32.buffer, gridPtr, this.width * this.height);
            
            try {
                // 转换地图数据格式 - 使用行优先顺序，与C代码保持一致
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        const index = y * this.width + x;  // 行优先顺序：y * width + x
                        // grid是[x][y]格式，需要转换
                        gridHeap[index] = (!(grid[x][y]) ? 0 : 1);  // 0表示可通行，1表示障碍
                    }
                }
                
                // 更新地图数据
                this.module.ccall(
                    'update_grid',
                    null,
                    ['number', 'number'],
                    [gridPtr, this.astar]
                );
            } finally {
                // 确保内存被释放
                this.free(gridPtr);
            }
            
        } catch (error) {
            console.error('更新地图时发生错误:', error);
            throw error;
        }
    }

    // 查找路径
    findPath(startX, startY, endX, endY) {
        if (!this.astar) {
            throw new Error('请先创建地图');
        }

        // 检查坐标是否在有效范围内
        if (startX < 0 || startX >= this.width || startY < 0 || startY >= this.height ||
            endX < 0 || endX >= this.width || endY < 0 || endY >= this.height) {
            console.log('起点或终点坐标超出地图范围');
            return null;
        }

        try {
            // 获取正确的地图数据
            const astarPtr = this.astar;
            const astarStruct = new Int32Array(this.module.HEAP32.buffer, astarPtr, 7);
            const gridPtr = astarStruct[0];
            const gridHeap = new Int32Array(this.module.HEAP32.buffer, gridPtr, this.width * this.height);
            const endIndex = endY * this.width + endX;  // 行优先顺序：y * width + x
            
            const startTime = new Date().getTime();
            const pathPtr = this.module.ccall(
                'find_path',
                'number',
                ['number', 'number', 'number', 'number', 'number'],
                [this.astar, startX, startY, endX, endY]
            );

            if (!pathPtr) {
                console.log('未找到路径');
                return null;
            }

            try {
                const length = this.module.ccall(
                    'get_path_length',
                    'number',
                    ['number'],
                    [pathPtr]
                );

                if (length <= 0) {
                    console.log('路径长度无效');
                    return null;
                }

                console.log('路径长度: ' + length);

                // 构建路径数组
                const path = [];
                for (let i = 0; i < length; i++) {
                    const x = this.module.ccall(
                        'get_path_point',
                        'number',
                        ['number', 'number', 'number'],
                        [pathPtr, i, 1]
                    );
                    const y = this.module.ccall(
                        'get_path_point',
                        'number',
                        ['number', 'number', 'number'],
                        [pathPtr, i, 0]
                    );
                    
                    // 验证坐标有效性
                    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                        path.push([x, y]);
                    }
                }

                console.log("寻路耗时：" + (new Date().getTime() - startTime) + "ms");
                return path;
            } finally {
                // 确保路径内存被释放
                this.module.ccall(
                    'cleanup_path',
                    null,
                    ['number'],
                    [pathPtr]
                );
            }
        } catch (error) {
            console.error('寻路时发生错误:', error);
            return null;
        }
    }

    // 清理资源
    cleanup() {
        if (this.astar) {
            try {
                this.module.ccall(
                    'cleanup_astar',
                    null,
                    ['number'],
                    [this.astar]
                );
            } catch (error) {
                console.error('清理资源时发生错误:', error);
            } finally {
                this.astar = null;
            }
        }
    }
}

// 绘制路径函数
function drawPath(map, path) {
    const canvas = document.getElementById('pathCanvas');
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');
    const cellSize = 10;
    
    // 修正：canvas的宽度和高度应该与地图的x和y对应
    canvas.width = map.length * cellSize;        // width = 1204
    canvas.height = map[0].length * cellSize;    // height = 1248
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格和障碍物
    for(let x = 0; x < map.length; x++) {
        for(let y = 0; y < map[0].length; y++) {
            ctx.fillStyle = map[x][y] === 0 ? 'white' : 'black';
            // 注意：canvas坐标系中，x和y的方向与地图一致
            ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
        }
    }

    // 绘制起点和终点
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(startx * cellSize + cellSize/2, starty * cellSize + cellSize/2, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(endx * cellSize + cellSize/2, endy * cellSize + cellSize/2, 5, 0, Math.PI * 2);
    ctx.fill();

    // 绘制路径
    if (path && path.length > 0) {
        ctx.beginPath();
        ctx.moveTo(path[0][0] * cellSize + cellSize/2, path[0][1] * cellSize + cellSize/2);
        
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i][0] * cellSize + cellSize/2, path[i][1] * cellSize + cellSize/2);
        }
        
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

var pathFinder = null;
var startx = 578;
var starty = 852;
var endx = 618;
var endy = 837;
// 测试函数
async function testPathFinding() {
    try {
        // 加载地图数据
        const response = await fetch('mapdata.json');
        if (!response.ok) {
            throw new Error('无法加载地图数据');
        }
        const map = await response.json();
        
        // 添加调试信息
        //console.log('地图数据格式:', {
        //    isArray: Array.isArray(map),
        //    length: map.length,
        //    firstDimension: map[0] ? map[0].length : 'undefined',
        //    sampleData: map[0] ? map[0].slice(0, 5) : 'undefined'
        //});
        
        // map数据是[1204][1248]格式，其中:
        // map.length = width = 1204
        // map[0].length = height = 1248
        const width = map.length;          // 1204
        const height = map[0].length;      // 1248
        
        //console.log('地图维度:', {width, height});
        
        if(!pathFinder){
            pathFinder = new SmoothAstar();
            await pathFinder.init();

            // 创建地图，使用正确的维度
            pathFinder.createMap(width, height);  // 1204, 1248

            // 更新地图数据
            pathFinder.updateMap(map);
            return;
        }
        
        // 打印地图数据
        //console.log('地图数据:');
        //for (let y = 0; y < height; y++) {
        //    let row = '';
        //    for (let x = 0; x < width; x++) {
        //        row += map[x][y] + ' ';
        //    }
        //    //console.log(row);
        //}

        // 寻找路径
        const path = pathFinder.findPath(startx, starty, endx, endy);
        
        if (path) {
            //console.log('找到路径: ' + JSON.stringify(path));
            drawPath(map, path);
        } else {
            //console.log('未找到路径！');
            drawPath(map, null);
        }

        // 清理资源
        pathFinder.cleanup();
    } catch (error) {
        console.error('测试过程中发生错误:', error);
    }
}

// 将PathFinder暴露到全局
self.PathFinder = SmoothAstar;
self.testPathFinder = testPathFinding;