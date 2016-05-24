BOARD = {};

BOARD.initBoard = function (){
  var boardSize = 8;

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
	case 3:
	 boardElement.classList.add('three-ship');
	 break;
	case 4:
	 boardElement.classList.add('four-ship');
	 break;
      default:

    }
    boardContainer.appendChild(boardElement);
  }
BOARD.delayIncrement = 5;
BOARD.delay = 500;
BOARD.turn = 0;
BOARD.tsum = 3;
BOARD.osum = 4;
BOARD.thsum = 2;
BOARD.fsum = 1;
BOARD.ocounter = 0;
BOARD.tcounter = 0;
BOARD.thcounter = 0;
BOARD.fcounter = 0;
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
	  console.log("in possibleShots");
	  console.log(startIndex);
  }else{
	   if (BOARD.ocounter == BOARD.osum && BOARD.tcounter == (BOARD.tsum * 2) && BOARD.thcounter == (BOARD.thsum *3) && BOARD.fcounter == (BOARD.fsum * 4)) {
	   }else{
	  console.log("GENERATING RANDOM");
	  startIndex = BOARD.generateStartIndex(boardSize, shotMap);
	  console.log("in random");
	  console.log(startIndex);
  	}
  }
  var arrayIndex = BOARD.checkIfArrayIsFull(shotMap);

 if (BOARD.ocounter == BOARD.osum && BOARD.tcounter == (BOARD.tsum * 2) && BOARD.thcounter == (BOARD.thsum *3) && BOARD.fcounter == (BOARD.fsum * 4) ) {
	  console.log(BOARD.turn + " " + BOARD.ocounter + " " + BOARD.tcounter);
	 var log = document.getElementById('log-info');
	 log.innerHTML = "Ėjimų skaičius : " + BOARD.turn;
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

      if ((startIndex-1 >= 0 ) && (startIndex % boardSize != 0) && (shotMap[startIndex-2] == 0 || shotMap[startIndex-2] == -1 || shotMap[startIndex-2] == null || (startIndex-1) % boardSize == 0)) {
		if(shotMap[startIndex-1] == 0 || shotMap[startIndex-1] == -1 || shotMap[startIndex-1] == null)
		{
			possibleShots.push(startIndex-1);
		}
      }

      if (startIndex+1 < Math.pow(boardSize, 2) && (shotMap[startIndex+2] == 0 || shotMap[startIndex+2] == null || shotMap[startIndex-2] == null || shotMap[startIndex-2] == 0 ||  (startIndex+1) % boardSize  == 7 || startIndex % boardSize == 0)) {
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

	if(shotMap[startIndex +1] == 2 || shotMap[startIndex -1] == 2 || shotMap[startIndex - boardSize] == 2 || shotMap[+startIndex + +boardSize] == 2)
	{
		possibleShots = [];
	}

      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
}else if (shotResult == 3) {
	BOARD.thcounter += 1;
      shotMap[startIndex] = shotResult;
	document.getElementById(startIndex).classList.add('three-ship');
	//setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
      if ((startIndex-1 >= 0 ) && (startIndex % boardSize != 0)&& (shotMap[startIndex-2] == 0 || shotMap[startIndex-2] == -1 || shotMap[startIndex-2] == null || shotMap[startIndex-2] == 3 || (startIndex-1) % boardSize == 0)) {
		if(shotMap[startIndex-1] == 0 || shotMap[startIndex-1] == -1 || shotMap[startIndex-1] == null)
		{
			possibleShots.push(startIndex-1);
			console.log("-1");
		}
      }

      if (startIndex+1 < (Math.pow(boardSize, 2)) && (shotMap[startIndex+2] == 0 || shotMap[startIndex+2] == -1|| (startIndex -2 ) % boardSize == 7 || shotMap[startIndex-2] == null || shotMap[startIndex-2] == 3 || (startIndex+1) % boardSize  == 7)) {
		if (shotMap[startIndex+1] == 0 || shotMap[startIndex+1] == -1 ||  shotMap[startIndex+1] == null) {
			possibleShots.push(startIndex+1);
			console.log("+1");
		}
      }

      if (startIndex - boardSize >= 0 && (shotMap[startIndex - (boardSize * 2)] == 0 || shotMap[startIndex - (boardSize * 2)] == -1 || shotMap[startIndex-(boardSize * 2)] == null || shotMap[startIndex-(boardSize * 2)] == 3)) {
		if ((startIndex - boardSize) >= 0 &&  shotMap[startIndex-boardSize] == 0 || shotMap[startIndex-boardSize] == -1 || shotMap[startIndex-boardSize] == null) {
			possibleShots.push(startIndex - boardSize);
			console.log("-8");
		}
      }

      if (+startIndex + +boardSize <=  Math.pow(boardSize, 2) && (shotMap[+startIndex +(boardSize * 2)] == 0 || shotMap[+startIndex +(boardSize * 2)] == -1 || shotMap[+startIndex+(boardSize * 2)] == null || shotMap[+startIndex+(boardSize * 2)] == 3)) {
		if (((+startIndex + +boardSize) < Math.pow(boardSize, 2) - 1) && (shotMap[+startIndex + +boardSize] == 0 || shotMap[+startIndex + +boardSize] == -1 || shotMap[+startIndex + +boardSize] == null)) {
			if (startIndex == 0) {
				possibleShots.push(8);
			}else{
				possibleShots.push(+startIndex +  +boardSize);
			}
			console.log("+8");
		}
      }
	if(shotMap[startIndex +1] == 3){
		possibleShots = [];
		if ((startIndex % boardSize)> 0) {
			possibleShots.push(startIndex -1);
		}

		if(startIndex +1 < (Math.pow(boardSize, 2))) {
			possibleShots.push(startIndex +2);
		}
	}

	if(shotMap[startIndex -1] == 3){
		possibleShots = [];
		if (startIndex <  (Math.pow(boardSize, 2) )) {
			possibleShots.push(startIndex +1);
		}

		if (((startIndex -1) % boardSize) > 0) {
			possibleShots.push(startIndex -2);
		}
	}

	if(shotMap[+startIndex + +boardSize] == 3){
		possibleShots = [];
		if (startIndex - boardSize  > 0) {
			possibleShots.push(startIndex - boardSize);
		}

		if(+startIndex +  +(boardSize *2) < (Math.pow(boardSize, 2) -1)) {
			possibleShots.push(+startIndex + +(boardSize*2));
		}
	}

	if(shotMap[startIndex - boardSize] == 3){
		possibleShots = [];
		if ((+startIndex + +boardSize) <  (Math.pow(boardSize, 2) -1)) {
			possibleShots.push(+startIndex + +boardSize);
		}

		if (startIndex - (boardSize * 2) > 0) {
			possibleShots.push(startIndex - (boardSize * 2));
		}
	}

	if((shotMap[startIndex +1] == 3 &&  shotMap[startIndex -1] == 3 ) || (shotMap[startIndex -1] == 3 &&  shotMap[startIndex -2] == 3 ) || (shotMap[startIndex +1] == 3 &&  shotMap[startIndex +2] == 3 ))
	{
		possibleShots = [];
	}
	if((shotMap[+startIndex + +boardSize] == 3 &&  shotMap[startIndex -boardSize] == 3 ) || (shotMap[startIndex - boardSize] == 3 &&  shotMap[startIndex - (boardSize*2)] == 3 ) || (shotMap[+startIndex + +boardSize] == 3 &&  shotMap[+startIndex + +(boardSize*2)] == 3 ))
	{
		possibleShots = [];
	}
	console.log("SHOT THREE");
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
}else if (shotResult == 4) {
	BOARD.fcounter += 1;
      shotMap[startIndex] = shotResult;
	console.log("SHOT FOUR START");
	if(shotMap[startIndex +2] == 4)
	{
		if((startIndex-1) % boardSize != 0){
			possibleShots.push(startIndex-1);
		}
		if ((startIndex+2 ) % boardSize != 7) {
			possibleShots.push(startIndex+3);
		}
	}

	if(shotMap[startIndex - 2] == 4)
	{
		if((startIndex) % boardSize != 7){
			possibleShots.push(startIndex+1);
		}
		if ((startIndex-2 ) % boardSize != 0) {
			possibleShots.push(startIndex-3);
		}
	}

	if(shotMap[+startIndex + +(boardSize * 2)] == 4)
	{
		if((startIndex - boardSize) >= 0){
			possibleShots.push(startIndex-boardSize);
		}
		if ((+startIndex+ +(boardSize * 3) ) < Math.pow(boardSize, 2)) {
			possibleShots.push(+startIndex+ +(boardSize * 3));
		}
	}

	if(shotMap[startIndex - (boardSize * 2)] == 4)
	{
		if((+startIndex + +boardSize) < Math.pow(boardSize, 2)){
			possibleShots.push(+startIndex+ +boardSize);
		}
		if ((startIndex - (boardSize * 3) ) >= 0) {
			possibleShots.push(startIndex -  (boardSize * 3));
		}
	}

		if(shotMap[startIndex +1] == 4){
			if ((startIndex % boardSize)> 0) {
				possibleShots.push(startIndex -1);
			}

			if(startIndex +1 < (Math.pow(boardSize, 2))) {
				possibleShots.push(startIndex +2);
			}
		}

		if(shotMap[startIndex -1] == 4){
			if (startIndex <  (Math.pow(boardSize, 2) )) {
				possibleShots.push(startIndex +1);
			}

			if (((startIndex -1) % boardSize) > 0) {
				possibleShots.push(startIndex -2);
			}
		}

		if(shotMap[+startIndex + +boardSize] == 4){
			if (startIndex - boardSize  > 0) {
				possibleShots.push(startIndex - boardSize);
			}

			if(+startIndex +  +(boardSize *2) < (Math.pow(boardSize, 2) -1)) {
				possibleShots.push(+startIndex + +(boardSize*2));
			}
		}

		if(shotMap[startIndex - boardSize] == 4){
			if ((+startIndex + +boardSize) <  (Math.pow(boardSize, 2) -1)) {
				possibleShots.push(+startIndex + +boardSize);
			}

			if (startIndex - (boardSize * 2) > 0) {
				possibleShots.push(startIndex - (boardSize * 2));
			}
		}

	document.getElementById(startIndex).classList.add('four-ship');
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
		if((shotMap[startIndex +1] == 4 &&  shotMap[startIndex + 2] == 4 && shotMap[startIndex +3] == 4) || (shotMap[startIndex -1] == 4 &&  shotMap[startIndex + 1] == 4 && shotMap[startIndex + 2] == 4) || (shotMap[startIndex -2] == 4 &&  shotMap[startIndex -1] == 4 && shotMap[startIndex +1] == 4) || (shotMap[startIndex - 1] == 4 &&  shotMap[startIndex - 2] == 4 && shotMap[startIndex -3] == 4)   )
		{
			possibleShots = [];
		}

		if((shotMap[+startIndex + +boardSize] == 4 &&  shotMap[+startIndex + +(boardSize*2)] == 4 && shotMap[+startIndex + +(boardSize * 3)] == 4) || (shotMap[startIndex - boardSize] == 4 &&  shotMap[startIndex + boardSize] == 4 && shotMap[+startIndex + +(boardSize * 2)] == 4) || (shotMap[startIndex - (boardSize*2)] == 4 &&  shotMap[startIndex - boardSize] == 4 && shotMap[+startIndex + +boardSize] == 4) || (shotMap[startIndex - boardSize] == 4 &&  shotMap[startIndex - (boardSize * 2)] == 4 && shotMap[startIndex - (boardSize * 3)] == 4)   )
		{
			possibleShots = [];
		}
	console.log("SHOT FOUR");
      setTimeout(function(){BOARD.startAI(shotMap, boardSize, possibleShots);}, BOARD.delay);
}
  }

}

BOARD.takeTheShot = function(shotIndex) {
  return BOARD.shipMap[shotIndex];
}

BOARD.generateStartIndex = function(boardSize, shotMap) {
  var random =  Math.floor(Math.random() * Math.pow(boardSize,2));
  var i =  0
  //|| shotMap[+random + +boardSize +1]  > 0 || shotMap[+random + +boardSize -1]  > 0 || shotMap[+random - +boardSize +1]  > 0 || shotMap[+random - +boardSize -1]  > 0 || shotMap[+random + +boardSize] > 0 || shotMap[random - boardSize] > 0
  while(shotMap[random] != null || ((random +1 ) % boardSize != 7 && shotMap[random + 1]  > 0) || ((random) % boardSize != 0  && shotMap[random - 1]  > 0) || shotMap[random - boardSize] > 0 || shotMap[+random + +boardSize] > 0  || i < 10)
  {
			console.log('CREATING NEW RANDOM NUMBER ');
			i++;
			random =  Math.floor(Math.random() * Math.pow(boardSize,2));
}
	  return random;
}

BOARD.generateShips = function(boardSize) {
  var shipMap = []
  if(boardSize == 8)
  {
    var random = Math.floor(Math.random() * 5) + 1;
    switch (random) {
    	case 1:
		shipMap = [
		2,2,0,1,0,0,0,0,
		0,0,0,0,0,0,2,0,
		4,4,4,4,0,0,2,0,
		0,0,0,0,0,0,0,0,
		1,0,2,0,1,0,0,0,
		0,0,2,0,0,0,3,0,
		0,0,0,0,1,0,3,0,
		3,3,3,0,0,0,3,0,
		];
    		break;
	case 2:
		shipMap = [
		1,0,2,2,0,0,0,1,
		0,0,0,0,0,0,0,0,
		4,0,0,2,2,0,0,3,
		4,0,0,0,0,0,0,3,
		4,0,0,2,0,0,0,3,
		4,0,0,2,0,0,0,0,
		0,0,0,0,0,0,0,0,
		1,0,0,3,3,3,0,1,
		];
    		break;
	case 3:
		shipMap = [
		4,4,4,4,0,3,3,3,
		0,0,0,0,0,0,0,0,
		1,0,1,0,0,0,0,1,
		0,0,0,0,0,3,0,0,
		2,2,0,1,0,3,0,0,
		0,0,0,0,0,3,0,0,
		0,2,0,0,0,0,0,0,
		0,2,0,2,2,0,0,0,
		];
    		break;
	case 4:
		shipMap = [
		4,0,0,0,0,0,0,0,
		4,0,0,0,0,1,0,0,
		4,0,1,0,0,0,0,0,
		4,0,0,0,2,2,0,0,
		0,0,0,0,0,0,0,2,
		0,3,3,3,0,1,0,2,
		0,0,0,0,0,0,0,0,
		3,3,3,0,2,2,0,1,
		];
		break;
	case 5:
		shipMap = [
		0,0,0,0,0,0,1,0,
		0,4,4,4,4,0,0,0,
		0,0,0,0,0,0,0,1,
		2,2,0,0,3,0,0,0,
		0,0,0,0,3,0,1,0,
		3,3,3,0,3,0,0,0,
		0,0,0,0,0,0,2,0,
		0,2,2,0,1,0,2,0,
		];
		break;
    	default:
		shipMap = [
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		];

    }
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
