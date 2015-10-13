/*
 * @description: Script Sudoku
 * @author: Thanh Dao
 * @version: 0.1
 * @date: 2015-10-09;
 */
if ("undefined" == typeof jQuery)
	throw new Error("SudokuJS requires jQuery");
!function ($) {

	var Sudoku = function (element, options) {
		this.hasOption = typeof options == 'object';
		this.element = element;
		this.selected = {
		  	row: -1, 
		  	col: -1
		};
		this.isActiveMark = false;
		this.sudokuTemplate = [
			[1, 2, 3, 4, 5, 6, 7, 8, 9],
			[4, 5, 6, 7, 8, 9, 1, 2, 3],
			[7, 8, 9, 1, 2, 3, 4, 5, 6],
			[2, 3, 4, 5, 6, 7, 8, 9, 1],
			[5, 6, 7, 8, 9, 1, 2, 3, 4],
			[8, 9, 1, 2, 3, 4, 5, 6, 7],
			[3, 4, 5, 6, 7, 8, 9, 1, 2],
			[6, 7, 8, 9, 1, 2, 3, 4, 5],
			[9, 1, 2, 3, 4, 5, 6, 7, 8]
		];
		this.puzzle = this.generate(55);
		this.element.addClass('sudoku').html('<div class="puzzle"></div>'+
			'<div class="wrap_select_number"></div>');

		/********************************
		*        VIEW GENERATORS        *
		*********************************/
		this.generateField(this.puzzle);
		this.generateNumberSelector();
		this.generateCellDivider();

		/********************************
		*        EVENT LISTENERS        *
		*********************************/
		this.element.find('.puzzle').on('click', 'span:not(.fixed)', $.proxy(this.cellSelected, this));
		this.element.find('.wrap_select_number').on('click', '.number_item', $.proxy(this.numberSelected, this));
		this.element.find('.wrap_select_number').on('click', '.mark_button', $.proxy(this.activeMarkNumber, this));
	};
	Sudoku.prototype = {

		constructor: Sudoku,
		swapRows: function (puzzle, a, b) {
			var temp  = puzzle[a];
			puzzle[a] = puzzle[b];
			puzzle[b] = temp;
			return puzzle;
		},
		swapColumns: function (puzzle, a, b) {
			for(var i = 0; i < 9; i++){
				var temp     = puzzle[i][a];
				puzzle[i][a] = puzzle[i][b];
				puzzle[i][b] = temp;
			}
			return puzzle;
		},
		swapValues: function (puzzle, a, b) {
			for(var i = 0; i < 9; i++) {
				for(var j = 0; j < 9; j++) {
					var value = puzzle[i][j];
					if(value == a) {
						puzzle[i][j] = b;
					}
					if(value == b) {
						puzzle[i][j] = a;
					}
				}
			}
			return puzzle;
		},
		generate: function (numHide) {
			var puzzle = $.extend(true, {}, this.sudokuTemplate);
			for(var i = 0; i < 50; i++) {
				var type = Math.floor((Math.random() * 3));
				var a    = Math.floor((Math.random() * 9));
				var c    = Math.floor((Math.random() * 9));
				var v    = Math.floor((Math.random() * 3));
				var b    = Math.floor(a/3) * 3 + v;

				switch(type){
					case 0: puzzle = this.swapRows(puzzle, a, b); break;
					case 1: puzzle = this.swapColumns(puzzle, a, b); break;
					case 2: puzzle = this.swapValues(puzzle, a + 1, c + 1); break;
				}
			}
			this.puzzle = puzzle;
			return this.hideValuesInPuzzle(puzzle, numHide);
		},
		hideValuesInPuzzle: function (puzzle, numHide) {
			var hiden = 0;
			while (hiden <= numHide) {
				var x = Math.floor((Math.random() * 9));
				var y = Math.floor((Math.random() * 9));
				if (puzzle[x][y] != ' ') {
					puzzle[x][y] = ' ';
					hiden++;
				}
			}
			return puzzle;
		},

		//------------HTML GENERATORS-------------
		generateField: function (puzzle) {
			for (var i=0; i<9; i++) {
				for (var j=0; j<9; j++) {
					if (puzzle[i][j] != ' ')
						this.element.find('.puzzle').append('<div class="devide_width_9"><div class="wrap_mark"></div><span class="fixed">'+puzzle[i][j]+'</span></div>');
					else
						this.element.find('.puzzle').append('<div class="devide_width_9"><div class="wrap_mark"></div><span row="'+i+'" col="'+j+'">'+puzzle[i][j]+'</span></div>');
				}
			}
		},
		generateNumberSelector: function () {
			for (i=1; i<=9; i++) {
				this.element.find('.wrap_select_number').append('<span class="number_item" value="'+i+'">'+i+'</div>');
			}
			this.element.find('.wrap_select_number').append('<span class="number_item" value="">Clear</span>');
			this.element.find('.wrap_select_number').append('<span class="mark_button" value="">Mark</span>');
		},
		generateCellDivider: function () {
			this.element.find('.puzzle').append('<div style="position:absolute;padding:2px 0;top:33.0%;left:0px;width:452px;background-color:#368836;"></div>');
			this.element.find('.puzzle').append('<div style="position:absolute;padding:2px 0;top:66.4%;left:0px;width:452px;background-color:#368836;"></div>');
			this.element.find('.puzzle').append('<div style="position:absolute;padding:0 2px;top:0px;left:149px;height:100%;background-color:#368836;"></div>');
			this.element.find('.puzzle').append('<div style="position:absolute;padding:0 2px;top:0px;left:299px;height:100%;background-color:#368836;"></div>');
		},

		//------------EVENT LISTENERS-------------
		cellSelected: function (e) {
			var _target = $(e.target);
			var t = parseInt(_target.attr('row'));
			var l = parseInt(_target.attr('col'));
			this.selected.row = t; this.selected.col = l;
			$('span:not(.fixed)').removeClass('selected filled');
			$('span[row="'+t+'"]').addClass('filled');
			$('span[col="'+l+'"]').addClass('filled');
			_target.addClass('selected');
		},
		numberSelected: function (e) {
			var num = $(e.target).attr('value');
			if (!this.isActiveMark)
				$('span:not(.fixed)[row="'+this.selected.row+'"][col="'+this.selected.col+'"]').html(num);
			else
				$('span:not(.fixed)[row="'+this.selected.row+'"][col="'+this.selected.col+'"]').parent().find('.wrap_mark').append('<div class="mark">'+num+'</div>');
		},
		activeMarkNumber: function (e) {
			this.isActiveMark = !this.isActiveMark;
			$(e.target).removeClass('marked');
			if (this.isActiveMark)
				$(e.target).addClass('marked');
		}
	};

	$.fn.sudoku = function (options) {
		this.each(function () {
			var el = $(this);
			el.data('sudoku', new Sudoku(el, options));
		});
		return this;
	}
}(jQuery);