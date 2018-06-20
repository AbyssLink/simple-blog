documentWidth = window.screen.availWidth;//获取当前设备可以使用的宽度
gridContainerWidth = 0.975 * documentWidth;//大棋盘的宽度
cellSlideLength = 0.18 * documentWidth;//小格子的变长
cellSpace = 0.0125 * documentWidth;//每一种小格子之间的间距


function getPosTop(i, j){
	return cellSpace + i*(cellSlideLength + cellSpace);
}
function getPosLeft(i, j){
	return cellSpace + j*(cellSlideLength + cellSpace);
}
function getNumberBackgroundColor(number){
	switch(number){
		case 2:return "#eee4da";break;
		case 4:return "#ede0c8";break;
		case 8:return "#f2b179";break;
		case 16:return "#f59563";break;
		case 32:return "#f67c5f";break;
		case 64:return "#f65e3b";break;
		case 128:return "#edcf72";break;
		case 256:return "#edcc61";break;
		case 512:return "#9c0";break;
		case 1024:return "#33b5e5";break;
		case 2048:return "#09c";break;
		case 4096:return "#a6c";break;
		case 8192:return "#93c";break;
	}
	return "black";
}
function getNumberColor(number){
	if(number<=4)
		return "#776a65";
	return "white";
}

function nospace(board){
	for (var i=0;i<5;i++)
		for(var j=0;j<5;j++){
			if(board[i][j]==0)//为0表示棋盘格里还有空间
				return false;
		}
		
	return true;
}
//判断是否可以左移
function canMoveLeft( board ){
	for (var i = 0;i < 5; i++) {
		for (var j = 1;j < 5;j++) {
			if(board[i][j] !=0 ){
				//左侧等于0或者左侧与之相等可以合并
				 if(board[i][j-1]==0||board[i][j-1]==board[i][j])return true;
			}
		}
	}
	return false;
}
//判断是否可以右移
function canMoveRight( board ){
	for (var i = 0;i < 5; i++) {
		for (var j = 3;j >=0;j--) {
			if(board[i][j] !=0 ){
				//右等于0或者右侧与之相等可以合并
				 if(board[i][j+1]==0||board[i][j+1]==board[i][j])return true;
			}
		}
	}
	return false;
}
//判断是否可以上移
function canMoveUp( board ){
	for (var i = 1;i < 5; i++) {
		for (var j = 0;j < 5;j++) {
			if(board[i][j] !=0 ){
				//上侧等于0或者上侧与之相等可以合并
				 if(board[i-1][j]==0||board[i-1][j]==board[i][j])return true;
			}
		}
	}
	return false;
}
//判断是否可以下移
function canMoveDown( board ){
	for (var i = 3;i >= 0; i--) {
		for (var j = 0;j < 5;j++) {
			if(board[i][j] != 0 ){
				//下侧等于0或者下侧与之相等可以合并
				 if(board[i+1][j]==0||board[i+1][j]==board[i][j])return true;
			}
		}
	}
	return false;
}
//判断是否有障碍物
function noBlockHorizontal ( row , col1 , col2 , board ){
	for ( var i = col1 + 1 ; i < col2 ; i++ )
		if( board[row][i]!=0)
			return false;
			
	return true;
}
function noBlockVertical ( col , row1 , row2 , board ){
	for (var i = row1 + 1 ; i < row2 ; i++) {
		if(board[i][col]!=0)
			return false;
	}
	return true;
}
function nomove( board ){
	if( canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) )
		return false;
	return true;
}
