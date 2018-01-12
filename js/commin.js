//设置过渡动画
function setLodding(value){
	var lodding =$(".loaded");
	var wrap =$(".wrap");
	var legend = lodding.find(".legend");
	legend.html(value);
	lodding.css("display","block");
	wrap.css('display','none')
}
/*
	11-30 新增了bar3D变换效果
*/
//3D变化对象
function newsBar(){
			this.front =null;
			this.reverse =null;
			this.taktTime=5000;
			this.init=function(front,reverse){
				this.front =front;
				this.reverse =reverse ;
				this.newsInit();
			}
			this.controller=false;
			this.interTiem=null;
			this.openAutomation=function(){
			clearInterval(this.interTiem);
			var This =this;
			this.interTiem=setInterval(function(){

				if(This.controller){
					This.frontChange(This.reverse,This.front);
					setTimeout(function(){
						This.quickChange(This.reverse,This.front);
					},1222);
					This.controller = false;
				}else{
					This.frontChange(This.front,This.reverse);
					setTimeout(function(){
						This.quickChange(This.front,This.reverse);
					},1222);
					This.controller = true;
				}

			},This.taktTime);
			}
			//初始化
			this.newsInit=function(){
				this.front.css({'transform':'perspective(600px) rotateX(0deg)','top':'0px'});
				this.reverse.css({'transform':'perspective(600px) rotateX(-90deg)','top' : '80px'});
				this.openAutomation();
			}
			//看到见的变化
			this.frontChange=function(front,reverse){
				front.css({'transition':'.5s all','transform':'perspective(600px) rotateX(90deg)',
					'top':'-80px'
				});
				reverse.css({'transition':'.5s all','transform':'perspective(600px) rotateX(0deg)',
					'top':'0px'
				});
			}
			//隐藏的快速变化
			this.quickChange=function(front,reverse){
				front.addClass('state2');
				reverse.addClass('state1');
				front.removeClass('state1');
				reverse.removeClass('state2');
				front.css({'transition':'0s','transform':'perspective(600px) rotateX(-90deg)','top':'80px'});
				reverse.css('transition','0s');
			}
}


