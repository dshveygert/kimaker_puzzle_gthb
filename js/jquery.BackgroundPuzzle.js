/**
 * Created by Denis Shveygert on 22.12.2015.
 */
(function( $ ) {
	//Методы
	var $methods = {
		init : function( $options ) { //Инициализация
			//Настройки по-умолчанию
			var $settings = $.extend( {
				'blockClass'		: '.bg-puzzle',
				'position'		: ['50%','50%'],
				'test'			:	0,
				'cloning'		:	0,
				'filling'		:	false
			}, $options);

			//Определяем размер изображений
			//позиционируем пазл
			var $blocks = this.find($settings.blockClass),
				$thisWidth = this.width(),
				$thisHeight = this.height(),
				$blocksWidth = [],
				$blocksHeight = [],
				$blocksLeft = [],
				$blocksTop = [],
				$maxWidth = 0,
				$maxHeight = 0;

			//замеры
			$blocks.each(function(){
				$currentBlock = $(this);
				$blocksWidth.push($currentBlock.width());
				$blocksHeight.push($currentBlock.height());
				$blocksTop.push($currentBlock.offset().top);
				$blocksLeft.push($currentBlock.offset().left);
				if($maxWidth < $currentBlock.width()) $maxWidth = $currentBlock.width();
				if($maxHeight < $currentBlock.height()) $maxHeight = $currentBlock.height();
			});

			//пишем замеры в память
			this.data("leftPosition",$blocksLeft);											//массив left для всех картинок
			this.data("topPosition",$blocksTop);											//массив top для всех картинок
			this.data("maxHeight",$maxHeight);												//максимальная высота картинки
			this.data("maxWidth",$maxWidth);												//максимальная ширина картинки
			this.data("blocksHeight",$blocksHeight);										//массив высот картинок
			this.data("blocksWidth",$blocksWidth);											//массив ширин картинок

			//позиционируем враппер по центру страницы
			this.css({
				top:		$settings.position[0],
				left:		$settings.position[1],
				marginTop:	(-1)*$thisHeight/2+"px",
				marginLeft:	(-1)*$thisWidth/2-20+"px"
			});

			//замеряем враппера и отправляем в память
			var $top = this.offset().top,
				$left = this.offset().left;
			puzzlePosition = [$top,$left];
			this.data("puzzlePosition",puzzlePosition);										//массив top-left позиции враппера картинок
			this.data("puzzleSize",[this.width(),this.height()]);							//масиив ширина-высота враппера картинок

			//записываем в память количество заполнений клонами
			this.data("fillingByClones", $settings.cloning);									//сначала количество заполнений равно количеству клонов

			//если не тестовый режим, то в конце инициализации разбираем пазл
			if($settings.test != 1) this.bgPuzzle("uncollect",$options);

			return this;
		},

		collect : function( $options ) { //Собрать паззл

			//Настройки по-умолчанию
			var $settings = $.extend( {
				'blockClass'		: '.bg-puzzle',
				'position'		: ['50%','50%'],
				'test'			:	0,
				'cloning'			:	3,
				'filling'		:	false
			}, $options);
			$this = this;
			$this.removeClass("uncollect").addClass("collect").removeAttr("style");



			//собираем пазл
			var $blocks = this.find($settings.blockClass);
			i = 0;
			$.each($blocks, function(){
				$block = $(this);
				$block.removeAttr("left").removeAttr("top");
				$(this).animate({
					top: $this.data("puzzlePosition")[0]*1 + $this.data("topPosition")[i]*1 + "px",
					left: $this.data("puzzlePosition")[1]*1 + $this.data("leftPosition")[i]*1 + "px"
				},300);
				i++;
			});
		},
		uncollect : function( $options ) { //Разобрать паззл
			//Настройки по-умолчанию
			var $settings = $.extend( {
				'blockClass'		: '.bg-puzzle',
				'position'		: ['50%','50%'],
				'test'			:	0,
				'cloning'			:	3,
				'filling'		:	false
			}, $options);
			//удаляем клонов
			$("body").find($settings.blockClass + ".clone").remove();

			this.removeClass("collect").addClass("uncollect").removeAttr("style");

			var $imgBlock = $($settings.blockClass),
				$wW = $(document).width()-this.data("maxWidth")-80,//ширина окна
				$wH = $(document).height()-this.data("maxHeight")-60; //высота окна

			//если есть клоны или заполнение заполняем и клонируем
			for(j=0 ;j < this.data("fillingByClones") ; j++) {
				$imgBlock.clone().addClass("clone").appendTo(this);
			}
			//записываем в память количество клонов
			if($settings.filling) {
				k = this.data("fillingByClones");
				k++;
				this.data("fillingByClones",k);
			}

			//клонируем пазл и разбираем пазл
			$imgBlock.add($settings.blockClass+".clone").each(function() {
				$currentBlock = $(this),
				$rh =  Math.round(Math.random() * $wH), //Случайное число по высоте
				$rw =  Math.round(Math.random() * $wW); //Случайное число по ширине

				$currentBlock.css({
					position:	"absolute",
					top:		$rh+"px",
					left:		$rw+"px"
				}).attr("left",$rw+"px").attr("top",$rh+"px");
			});
			return this;
		}
	};

	$.fn.bgPuzzle = function( $method, $options ) {
		// логика вызова метода
		if ( $methods[$method] ) {
			return $methods[$method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! $method ) {
			return $methods.init.apply( this, arguments );
		} else {
			$.error( 'Метод с именем ' +  $method + ' не существует для jQuery.tooltip' );
		}
	};
})(jQuery);