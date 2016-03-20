(function(){
    var utils = {
        hasClass: function(ele,nClass){
            var reg = new RegExp('(?:^| +)('+nClass+')(?: +|$)','g');
            return reg.test(ele.className);
        },
        addClass: function(ele,nClass){
            if(this.hasClass(ele,nClass)) return;
            ele.className += (' '+nClass) ;
        },
        removeClass: function(ele,nClass){
            if(!this.hasClass(ele,nClass)) return;
            ele.className =  ele.className.replace(nClass,' ');
        }
    };
    window.utils = utils;
})();
//给box绑定滑动
(function(){
    function Slide(){
        var that = this;
        that.opt = {
            ele:  document.querySelector('#main'),
            boxList : document.querySelectorAll('#main .box'),
            desW: 640,
            desH: 960,
            winW: document.documentElement.clientWidth,
            winH: document.documentElement.clientHeight
        }
    };
    Slide.prototype = {
        init: function(){
            var that = this,opt = that.opt;

            /*设备的宽/设备的高<设计稿宽/设计稿高 按照高来缩放-->把设计稿的高缩小到设备的高*/
            if(opt.winW / opt.winH <= opt.desW / opt.desH){
                var style = 'cover;'
            }else{
                var style = 'contain;'
            };
            utils.addClass(opt.boxList[0],'box0');
			
            //给boxList绑定事件
            [].forEach.call(opt.boxList,function(){
                opt.obj = arguments[0];
                opt.obj.index = arguments[1];
                opt.obj.style.backgroundSize = style;
				
                opt.obj.addEventListener('touchstart',function(e){
                    that.start(e);
                },false);
                opt.obj.addEventListener('touchmove',function(e){
                    that.move(e);
                },false);
                opt.obj.addEventListener('touchend',function(e){
                    that.end(e);
                },false);
            });
        },
        start: function(e){
            var that = this,opt = that.opt;
            opt.flag = false;
            opt.startY = e.changedTouches[0].pageY;
        },
        move: function(e){
            var that = this,opt = that.opt;
            opt.flag = true;
            opt.nowY = e.changedTouches[0].pageY;
            opt.index = e.currentTarget.index;
            opt.pos = opt.nowY  - opt.startY;//移动距离
            var curTag = opt.boxList[opt.index];
            [].forEach.call(opt.boxList,function(){
                if(arguments[1] != opt.index) arguments[0].style.display = 'none';
                utils.removeClass(arguments[0],'box'+arguments[1]);
            });
            utils.removeClass(curTag,'zIndex');
            if(opt.pos < 0 ){//向上滑动,++
                opt.futureIndex = (opt.index == (opt.boxList.length - 1) ? 0 : (++opt.index));
                var duration = opt.winH + opt.pos;
            }else{
                opt.futureIndex = (opt.index == 0 ? (opt.boxList.length - 1) : (--opt.index));
                var duration = -opt.winH + opt.pos;
            };
            opt.futureTag = opt.boxList[opt.futureIndex];
            utils.addClass(opt.futureTag,'zIndex');
            opt.futureTag.style.display = 'block';
            opt.futureTag.style.webkitTransform = 'translateY('+duration+'px) ';
            curTag.style.webkitTransform = "scale("+(1-Math.abs(opt.pos)/opt.winH*0.5)+") translateY("+opt.pos+"px)";

        },
        end: function(e){
            var that = this,opt = that.opt;
            if(!opt.flag) return;
            var that = this,opt = that.opt;
            opt.futureTag.style.webkitTransform = 'translateY(0)';
            opt.futureTag.style.webkitTransition = '0.7s';
            //清空opt.futureTag上的动画，防止动画积累
            opt.futureTag.addEventListener('webkitTransitionEnd',function(){
                opt.futureTag.style.webkitTransition = null;
				
                utils.addClass(opt.futureTag,'box'+opt.futureIndex);
            },false);
        }
    };
    document.addEventListener('touchmove',function(){},false);
    window.slide = new Slide;
})();
slide.init();
