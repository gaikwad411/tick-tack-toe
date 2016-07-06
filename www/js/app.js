// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});





    var userMarkIcon = 'fa-hand-peace-o';
    var computerMarkIcon = 'fa-paw';
    
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    var showNotification = function(type){
       $('body').addClass('notify-'+type);  
    };
    
    var updateCellsForWinStatus = function(cells, type){
        console.log('======= WINS '+type+' ======');
        $('.ttt-table').addClass('game-over');
        $(cells).addClass('won-'+type);
    };
    
    // Check if player wins
    var checkIfPlayerWins = function(icon){
        var winingCells = [];
        // Check horizontal rows
        for(var i=1;i<=3;i++)
        {
            winingCells = $('.ttt-table tr:nth-child('+i+') .'+icon);
            if(winingCells.length===3)
            {
                updateCellsForWinStatus(winingCells, 'rows');
                return true;
            }
        }
        
        // Check vertical columns
        for(var i=1;i<=3;i++)
        {
            winingCells = $('.ttt-table tr td:nth-child('+i+') .'+icon); 
            if(winingCells.length ===3)
            {
                updateCellsForWinStatus(winingCells, 'cols');
                return true;
            }
        }
        
        // Check main diagonal
        var winingCellsDia = [];
        for(var i=1;i<=3;i++)
        {
            
            winingCells = $('.ttt-table tr:nth-child('+i+') td:nth-child('+i+') .'+icon);
            
            if(winingCells.length >=1)
            {
                winingCellsDia.push(winingCells[0]);
                
            }
            
        }
        if(winingCellsDia.length===3)
        {
            updateCellsForWinStatus(winingCellsDia, 'main-dia');
            return true;
        }
        
        
        // Check second diagonal
        var winingCellsSecondDia = [];
        for(var i=3;i>=1;i--)
        {
            winingCells = $('.ttt-table tr:nth-child('
                    +(4-i)+') td:nth-child('+i+') .'+icon);
            if(winingCells.length >=1)
            {
                winingCellsSecondDia.push(winingCells[0]);
            }
            
        }
        
        if(winingCellsSecondDia.length===3)
        {
            updateCellsForWinStatus(winingCellsSecondDia, 'second-dia');
            return true;
        }
        
        
        return false;
    };
    
    // Check if nothing to play
    var ifNothingToPlay = function()
    {
        if($('.ttt-table').hasClass('game-over'))
        {
            return true;
        }
        
        if($('.ttt-played').length===9)
        {
            return true;
        }
        return false;
    }
    
    // Judge the game
    var judgeTheGame = function(icon){
        // check if user wins
        var userWins = checkIfPlayerWins(userMarkIcon);
        var compWins = checkIfPlayerWins(computerMarkIcon);
        if(userWins && compWins)
        {
            showNotification('both-wins');
            return true;
        }
        if(userWins)
        {
            showNotification('user-wins');
            return true;
        }
        if(compWins)
        {
            showNotification('computer-wins');
            return true;
        }
        
        // Nither wins 
        if(ifNothingToPlay())
        {
           // No one wins
           showNotification('no-one-wins');
           return true;
        }
        return false;
    };
    
    
    // Play computer turn
    var playComputerTurn = function(){
        
        // First judge the game
        judgeTheGame();
        
        // check if computer can be play
        if(ifNothingToPlay())
        {
            return true;
        }
        
        var notPlayedCells = [];
        $('.ttt-cell:not(.ttt-played)').each(function(index, cell){
            notPlayedCells.push(cell);
        });
        if(notPlayedCells.length===0)
        {
            judgeTheGame();
            return false;
        }
        
        var randomIndex = getRandomInt(0,notPlayedCells.length-1);
        
        $(notPlayedCells[randomIndex]).addClass('ttt-played');
        $(notPlayedCells[randomIndex]).addClass(computerMarkIcon);
        
        console.log('==== COMPUTER PLAYED ===');
        
        // Computer played now
        judgeTheGame();
        
        // check if turns left
        if( !ifNothingToPlay() )
        {
            // there are some turns left
            $('.ttt-cell')
                .removeClass('ttt-locked');
        }
        
    };
    
    $(document).ready(function(){
        
        
        $(".ttt-cell").on('click', function(){
            
            // First judge the game
            judgeTheGame();

            // check if computer can be play
            if(ifNothingToPlay())
            {
                return true;
            }
            
            // This cell
            var thisCell = $(this);
            
            // Check if already played
            var isAlreadyPlayed = thisCell.hasClass('ttt-played');
            var isLockedForUser = thisCell.hasClass('ttt-locked');
            if(isAlreadyPlayed || isLockedForUser)
            {
                console.log("This cell is already occupied");
                return false;
            }
            
            // Add lock so that user can not have
            // double chance
            $('.ttt-cell').addClass('ttt-locked');
            
            // Play user turn
            thisCell.addClass('ttt-played');
            thisCell.addClass(userMarkIcon+'');
            
            console.log('==== USER PLAYED ===');
            
            // User played judge the game
            judgeTheGame();

            // check if computer can be play
            if(ifNothingToPlay())
            {
                return true;
            }
            
            // Computer can have turn
            playComputerTurn();
            
            
        });
        
        // To restart the game
        $('.wins-notification-wrapper').on('click', function(){
            if(ifNothingToPlay())
            {
                window.location.href='';
            }
        });
        
    });
