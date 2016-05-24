BOARD = {};

BOARD.initBoard = function (){
  var boardSize = document.getElementById('board-size').value;

  BOARD.generateBoard(boardSize);
}

BOARD.generateBoard = function(boardSize) {
  var boardContainer = document.getElementById('board-container');
  let boardContainerSize = boardSize * 50;
  boardContainer.style.width = boardContainerSize + 'px';

  BOARD.removeAllChildren(boardContainer);

  var shipMap = BOARD.generateShips(boardSize);

  for ( let i = 0; i < Math.pow(boardSize,2); i++){
    let boardElement = document.createElement('div');
    boardElement.className = 'board-element';
    boardElement.innerHTML = shipMap[i];
    switch (shipMap[i]) {
      case 1:
        boardElement.classList.add('one-ship');
        break;
      case 2:
        boardElement.classList.add('two-ship');
        break;
      default:

    }
    boardContainer.appendChild(boardElement);
  }
BOARD.delayIncrement = 5;
BOARD.delay = 200;
BOARD.turn = 0;
BOARD.tsum = 6;
BOARD.osum = 3;
BOARD.thsum = 1;
BOARD.ocounter = 0;
BOARD.tcounter = 0;
BOARD.thcounter = 0;
BOARD.badShotsCounter = 0;
BOARD.shipMap = shipMap;
BOARD.initAI(boardSize);

}

BOARD.generateAIBoard = function(boardSize){
  var boardContainer = document.getElementById('ai-board-container');
  let boardContainerSize = boardSize * 50;
  boardContainer.style.width = boardContainerSize + 'px';

  BOARD.removeAllChildren(boardContainer);

  for ( let i = 0; i < Math.pow(boardSize,2); i++){
    let boardElement = document.createElement('div');
    boardElement.className = 'board-element';
    boardElement.id = i;
    boardElement.innerHTML = i;
    boardContainer.appendChild(boardElement);
  }
}
BOARD.checkIfArrayIsFull = function (arr) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == null) return false;
  }
  return true;
}

BOARD.initAI = function(boardSize) {
  var shotMap = new Array(Math.pow(boardSize, 2));
  var startIndex = BOARD.generateStartIndex(boardSize, shotMap);

  BOARD.generateAIBoard(boardSize);
  var possibleShots = [];
  BOARD.startAI(shotMap, boardSize, possibleShots);
}

BOARD.startAI = function(shotMap, boardSize, possibleShots){
  var shotIndex;
  console.log(possibleShots);
  if(possibleShots.length > 0)
  {
	  var random = Math.floor(Math.random() * possibleShots.length);
	  startIndex = possibleShots[random];
	  possibleShots.splice(random, 1);
  }else{
	  console.log("GENERATING RANDOM");
	  startIndex = BOARD.generateStartIndex(boardSize, shotMap);
  }
  var arrayIndex = BOARD.checkIfArrayIsFull(shotMap);

 if (BOARD.ocounter == BOARD.osum && BOARD.tcounter == (BOARD.tsum * 2) && BOARD.thcounter == (BOARD.thsum *3)) {
	  console.log(BOARD.turn + " " + BOARD.ocounter + " " + BOARD.tcounter);
	 BOARD.endGame();
 }else if ( shotMap[startIndex] != null) {
 	BOARD.startAI(shotMap, boardSize, possibleShots);
}else {
    BOARD.delay += BOARD.delayIncrement;
    BOARD.turn += 1;
    var shotResult = BOARD.takeTheShot(startIndex);
    if(shotResult < 1){
      shotMap[startIndex] = shotResult;
      //shotIndex = BOARD.generateStartIndex(boardSize);
      document.getElementById(startIndex).classList.add('missed');
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
	//BOARD.startAI(shotMap, boardSize, shotIndex);
    }else if (shotResult == 1) {
      shotMap[startIndex] = shotResult;
      //shotIndex = BOARD.generateStartIndex(boardSize);
      document.getElementById(startIndex).classList.add('one-ship');
	BOARD.ocounter += 1;
	BOARD.badShotsCounter  = 0;
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
	//BOARD.startAI(shotMap, boardSize, shotIndex);
    }else if (shotResult == 2) {
	BOARD.tcounter += 1;
      shotMap[startIndex] = shotResult;
      if ((startIndex-1 >= 0 ) && (startIndex % boardSize != 0)&& (shotMap[startIndex-2] == 0 || shotMap[startIndex-2] == -1 || shotMap[startIndex-2] == null)) {
		if(shotMap[startIndex-1] == 0 || shotMap[startIndex-1] == -1 || shotMap[startIndex-1] == null)
		{
			possibleShots.push(startIndex-1);
		}
      }

      if (startIndex+1 < Math.pow(boardSize, 2) && (shotMap[startIndex+2] == 0 || shotMap[startIndex+2] == -1 || shotMap[startIndex-2] == null)) {
		if (shotMap[startIndex+1] == 0 || shotMap[startIndex+1] == -1 ||  shotMap[startIndex+1] == null) {
			possibleShots.push(startIndex+1);
		}
      }

      if (startIndex - boardSize >= 0 && (shotMap[startIndex - (boardSize * 2)] == 0 || shotMap[startIndex - (boardSize * 2)] == -1 || shotMap[startIndex-(boardSize * 2)] == null)) {
		if (shotMap[startIndex-boardSize] == 0 || shotMap[startIndex-boardSize] == -1 || shotMap[startIndex-boardSize] == null) {
			possibleShots.push(startIndex - boardSize);
		}
      }

      if (+startIndex + +boardSize <=  Math.pow(boardSize, 2) && (shotMap[+startIndex +(boardSize * 2)] == 0 || shotMap[+startIndex +(boardSize * 2)] == -1 || shotMap[+startIndex+(boardSize * 2)] == null)) {
		if (shotMap[+startIndex + +boardSize] == 0 || shotMap[+startIndex + +boardSize] == -1 || shotMap[+startIndex + +boardSize] == null) {
			if (startIndex == 0) {
				possibleShots.push(8);
			}else{
				possibleShots.push(+startIndex +  +boardSize);
			}
		}
      }

      document.getElementById(startIndex).classList.add('two-ship');
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
}else if (shotResult == 3) {
	BOARD.thcounter += 1;
      shotMap[startIndex] = shotResult;
	if(shotMap[startIndex +1] == 3){
		if ((startIndex % boardSize)> 0) {
			possibleShots.push(startIndex -1);
			console.log("tiple shot left +1");
		}

		if(startIndex +1 < (Math.pow(boardSize, 2) -1)) {
			possibleShots.push(startIndex +2);
			console.log("tiple shot right +1");
		}
	}

	if(shotMap[startIndex -1] == 3){
		if (startIndex <  (Math.pow(boardSize, 2) -1)) {
			possibleShots.push(startIndex +1);
			console.log("tiple shot left -1");
		}

		if (((startIndex -1) % boardSize) > 0) {
			possibleShots.push(startIndex -2);
			console.log("tiple shot right -1");
		}
	}

	if(shotMap[+startIndex + +boardSize] == 3){
		if (startIndex - boardSize  > 0) {
			possibleShots.push(startIndex - boardSize);
			console.log("tiple shot down -8");
		}

		if(+startIndex + +boardSize  < (Math.pow(boardSize, 2) -1)) {
			possibleShots.push(+startIndex + +(boardSize*2));
			console.log("tiple shot up -8");
		}
	}

	if(shotMap[startIndex - boardSize] == 3){
		if (+startIndex + +boardSize <  (Math.pow(boardSize, 2) -1)) {
			possibleShots.push(+startIndex + +boardSize);
			console.log("tiple shot up +8");
		}

		if (startIndex - (boardSize * 2) > 0) {
			possibleShots.push(startIndex - (boardSize * 2));
			console.log("tiple shot down +8");
		}
	}

	document.getElementById(startIndex).classList.add('three-ship');
	//setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);

      if ((startIndex-1 >= 0 ) && (startIndex % boardSize != 0)&& (shotMap[startIndex-2] == 0 || shotMap[startIndex-2] == -1 || shotMap[startIndex-2] == null)) {
		if(shotMap[startIndex-1] == 0 || shotMap[startIndex-1] == -1 || shotMap[startIndex-1] == null)
		{
			possibleShots.push(startIndex-1);
			console.log("-1");
		}
      }

      if (startIndex+1 < (Math.pow(boardSize, 2)-1) && (shotMap[startIndex+2] == 0 || shotMap[startIndex+2] == -1 || shotMap[startIndex-2] == null)) {
		if (shotMap[startIndex+1] == 0 || shotMap[startIndex+1] == -1 ||  shotMap[startIndex+1] == null) {
			possibleShots.push(startIndex+1);
			console.log("+1");
		}
      }

      if (startIndex - boardSize >= 0 && (shotMap[startIndex - (boardSize * 2)] == 0 || shotMap[startIndex - (boardSize * 2)] == -1 || shotMap[startIndex-(boardSize * 2)] == null)) {
		if ((startIndex - boardSize) >= 0 &&  shotMap[startIndex-boardSize] == 0 || shotMap[startIndex-boardSize] == -1 || shotMap[startIndex-boardSize] == null) {
			possibleShots.push(startIndex - boardSize);
			console.log("-8");
		}
      }

      if (+startIndex + +boardSize <=  Math.pow(boardSize, 2) && (shotMap[+startIndex +(boardSize * 2)] == 0 || shotMap[+startIndex +(boardSize * 2)] == -1 || shotMap[+startIndex+(boardSize * 2)] == null)) {
		if (((+startIndex + +boardSize) < Math.pow(boardSize, 2) - 1) && (shotMap[+startIndex + +boardSize] == 0 || shotMap[+startIndex + +boardSize] == -1 || shotMap[+startIndex + +boardSize] == null)) {
			if (startIndex == 0) {
				possibleShots.push(8);
			}else{
				possibleShots.push(+startIndex +  +boardSize);
			}
			console.log("+8");
		}
      }
	console.log("SHOT THREE");
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
}
  }

}

BOARD.takeTheShot = function(shotIndex) {
  return BOARD.shipMap[shotIndex];
}

BOARD.generateStartIndex = function(boardSize, shotMap) {
  var random =  Math.floor(Math.random() * Math.pow(boardSize,2));
  while(shotMap[random] != null || shotMap[+random + 1] > 0 || shotMap[+random - 1]  > 0 || shotMap[+random + +boardSize] > 0 || shotMap[+random - +boardSize] > 0)
  {
	  console.log('CREATING NEW RANDOM NUMBER ');
	random =  Math.floor(Math.random() * Math.pow(boardSize,2));
  }
	  return random;
}

BOARD.generateShips = function(boardSize) {
  var shipMap = []
  if(boardSize == 4)
  {
    shipMap = [
      2,2,0,1,
      0,0,0,0,
      2,0,2,0,
      2,0,2,0
    ];
  }

  if(boardSize == 8)
  {
    shipMap = [
	2,2,0,1,0,0,0,0,
	0,0,0,0,0,0,2,0,
	1,0,2,2,0,0,2,0,
	0,0,0,0,0,0,0,0,
	2,0,2,0,1,0,0,0,
	2,0,2,0,0,0,0,0,
	0,0,0,0,0,0,2,0,
	3,3,3,0,0,0,2,0,
    ];
  }
  return shipMap;
}

BOARD.endGame = function () {
	console.log("gg");
}

BOARD.removeAllChildren = function(parentNode) {
  while (parentNode.firstChild) {
  parentNode.removeChild(parentNode.firstChild);
  }
}
document.getElementById('generate').addEventListener('click', BOARD.initBoard);
