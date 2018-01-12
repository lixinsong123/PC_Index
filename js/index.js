$(function(){
	//video('m-video','http://live.hkstv.hk.lxdns.com/live/hks/playlist.m3u8')


	 //内容展示盒子
    var leaveMaxSize = document.getElementsByClassName("m-chatting")[0];
    var leaveActualContentSize = leaveMaxSize.children[0];  // 内容盒子
    //滚动盒子]; // 最大的盒子
    //实际大小
    var leaveRollWrap = leaveMaxSize.children[1];  // 右边盒子
    //滚动条
    var leaveScrollBar = leaveRollWrap.children[0];

    var commentThreads = new scrollBarCompontent();

    commentThreads.init({'contentBox':leaveActualContentSize,
                          'scrollBarBox':leaveRollWrap,
                          'scrollBar':leaveScrollBar,
                          'ContentShowBox':leaveMaxSize});

    commentThreads.showNewest();

   //实例化编辑器
	    var um = UM.getEditor('myEditor');
	    document.querySelector('.edui-container').style.width='100%';

	   var move = new Carousel($('.historyM_bg'),$('.historyM_list'),$('.historyController'));
        move.start();
        move.ClickResult($('.historyModal'),$('.showPicPar'));    
})

function video(id,url){
	var videoObject = {
						container: id,//“#”代表容器的ID，“.”或“”代表容器的class
						variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
						autoplay:true,//自动播放
						live:true,
						video:url//视频地址
					};
	var player=new ckplayer(videoObject);
}




//滚轮组件
function scrollBarCompontent(){
  //内容盒子
  this.contentBox='';
  //滚动盒子
  this.scrollBarBox='';
  //滚动条
  this.scrollBar='';
  //内容展示盒子
  this.ContentShowBox='';
  //滑块高度
  this.scrollBarHeight='';
  //滑块的最大滚动距离
  this.scrollBarScrollMaxDistance='';
  
  this.config={};
  this.init=function(json){
      this.contentBox=json.contentBox;
      this.scrollBarBox=json.scrollBarBox;
      this.scrollBar=json.scrollBar;
      this.ContentShowBox=json.ContentShowBox;
      //配置相关参数
      this.setConfiguration();  
      this.setScrollBar();
      this.setScrollBarScrollMaxDistance(); 
      //开启功能
      this.specific();
  }
  this.setConfiguration=function(){
        //可显示区域高度
       this.config.displayHeight = this.ContentShowBox.offsetHeight;
        //实际内容高度
       this.config.FactHeight = this.contentBox.offsetHeight;
        //内容的最大滚动距离
       this.config.contentScrollMaxDistance=this.contentBox.offsetHeight-this.scrollBarBox.offsetHeight;
  }
  //设置滚动条大小
  this.setScrollBar=function(){
      //先判断是否需要滚动条
      if(this.isScrollBar()){
        var scale = this.config.displayHeight/(this.config.FactHeight-this.config.displayHeight);
         this.config.contentScrollMaxDistance=this.contentBox.offsetHeight-this.scrollBarBox.offsetHeight;
          if(scale>1){
              this.scrollBarHeight=this.config.displayHeight-(this.config.FactHeight-this.config.displayHeight);
          }else{
              this.scrollBarHeight=this.config.displayHeight*scale;
          }
          this.scrollBar.style.height=this.scrollBarHeight+'px'
        
      }else{
        this.scrollBarBox.style.display='none';
      }
      
  }
  //设置内容最大滚动距离
  this.setScrollBarScrollMaxDistance=function(){
      this.scrollBarScrollMaxDistance=this.config.displayHeight-this.scrollBarHeight;
  }
  //判断是否需要滚动条
  this.isScrollBar=function(){
      return this.config.FactHeight<=this.config.displayHeight?false:true;
  }
  //相关功能
  this.specific=function(){
      //拖拽滚动功能
      this.dragRoll();
      this.rollerRolling();
  }
};
//展示最新消息和滚动条
scrollBarCompontent.prototype.showNewest=function(){
        if(this.isScrollBar()){
           this.scrollBar.style.top=this.scrollBarScrollMaxDistance+'px';
           this.contentBox.style.marginTop=-this.config.contentScrollMaxDistance+'px';
        }else{
            this.contentBox.style.marginTop=0+'px';
        }
        
}

//拖拽滚动
scrollBarCompontent.prototype.dragRoll=function(){

    var This = this; 
    var iscale = 0;
    var iMax = This.scrollBarBox.offsetHeight-This.scrollBar.offsetHeight;
    This.scrollBar.onmousedown=function(ev){
        var ev =ev||event;
        var cY = ev.clientY-this.offsetTop;
        document.onmousemove=function(ev){
          var ev =ev||event;
          var T =ev.clientY-cY;
          if(T<0){
            T=0;
          }else if(T>iMax){
            T=iMax;
          }
          iscale=T/iMax;
          This.scrollBar.style.top=T+"px";
          This.contentBox.style.marginTop=(This.scrollBarBox.clientHeight-This.contentBox.offsetHeight)*iscale+"px";

        }
        document.onmouseup=function(){
          document.onmousemove=document.onmouseup=null;
        }
        return false;
      }
}

//滚轮滚动
scrollBarCompontent.prototype.rollerRolling=function(){
    var This = this;
    This.ContentShowBox.onmousewheel=function(event){

      var contentSpeed = (This.scrollBarHeight/This.scrollBarScrollMaxDistance)*This.config.contentScrollMaxDistance;
      var scrollSpeen=This.scrollBarHeight;
       //向上滚动
       if(event.wheelDelta>0){
          contentSpeed=contentSpeed;
          scrollSpeen=-scrollSpeen;
          
       }else{
          contentSpeed=-contentSpeed;
          scrollSpeen=scrollSpeen;
       }
       var contentTarget = This.contentBox.offsetTop+contentSpeed;
       var scrollTarget  =  This.scrollBar.offsetTop+scrollSpeen;

       if(scrollTarget <=0){
          contentTarget = 0;
          scrollTarget  = 0;
       }else if (scrollTarget>=This.scrollBarBox.clientHeight-This.scrollBar.clientHeight){
          contentTarget=-(This.contentBox.clientHeight-This.scrollBarBox.clientHeight) ;
          scrollTarget=This.scrollBarBox.clientHeight-This.scrollBar.clientHeight;
       }
        
       This.contentBox.style.marginTop = contentTarget+"px";
       This.scrollBar.style.top = scrollTarget+"px";
       event.preventDefault();//阻止窗口的滚动条滚动
    }
}

//定义轮播类
class Carousel{
  /*参数
    一:最大的父类
    二:移动的对象
    四:手动移动的对象
  */
  constructor(ancestor,moveObj,operationObj){
    this.ancestor = ancestor;
    this.moveObj = moveObj;
    this.operationObj = operationObj;
    //初始化
    this.init();
  }
  init(){
    //每次移动的距离;
    this.moveWidth = this.moveObj.children().width()+10 ;
    //定时器
    this.autoTime = null;
    //索引
    this.index = 0;
    //点击控制开关
    this.singleClick = false;
    //加倍子元素
    this.doubleElement();
    //间隔时间
    this.frequency=5;
  }
  //开始开关
  start(){
     this.mouseSuspended();
     this.mouseLeave();
     this.automaticMobile();
     this.handMobile();
  }
  //翻倍节点
  doubleElement(){
      this.moveObj[0].innerHTML = this.moveObj[0].innerHTML+this.moveObj[0].innerHTML;
  }
  //自动移动
  automaticMobile(){
    this.autoTime = setInterval(()=>{
          this.index++;
          this.moveObj.animate({marginLeft:-this.index*this.moveWidth},1000,()=>{
             if(this.index==4){
                this.moveObj[0].style.marginLeft = '0px'; 
                this.index = 0;          
              }
          }); 
      },this.frequency*1000)
  }
  //点击移动
  handMobile(){
      this.clickLeft();
      this.clickRight();

  }
  //点击左移动
  clickLeft(){
    //左
      $(this.operationObj.children()[0]).on('click',()=>{
           if(this.singleClick){

            }else{
              this.singleClick = true;
              this.index++;
              this.moveObj.animate({marginLeft:-this.index*this.moveWidth},1000,()=>{
                 if(this.index == 4){
                     this.moveObj[0].style.marginLeft = '0px'; 
                     this.index = 0;          
                  }
                  this.singleClick = false;
              }); 
            }
      })
  }
  //点击右移动
  clickRight(){
     //右
      $(this.operationObj.children()[1]).on('click',()=>{
           if(this.singleClick){  
            }else{
              this.singleClick = true;
              if(this.index == 0){
                  this.moveObj[0].style.marginLeft = -this.moveWidth*4+'px';
                  this.index = 4;        
              }
              this.index--;
              this.moveObj.animate({marginLeft:-this.index*this.moveWidth},1000,()=>{
                this.singleClick = false;
              });
            }
      })
  }
  //鼠标悬浮
  mouseSuspended(){
    this.ancestor.on('mouseenter',()=>{
        clearInterval(this.autoTime);
        this.operationObj.css('display','block');
      })
  }
  //鼠标移开
  mouseLeave(){
      this.ancestor.on('mouseleave',()=>{
        this.operationObj.css('display','none');
        this.automaticMobile();
      })
  }
  //点击出现全屏模态框功能
  /*参数
    一:模态框对象
    二:装载图片对象的父类
  */
  ClickResult(Modal,showPicPar){
       for(var i=0;i<this.moveObj.length;i++){
        $(this.moveObj[i]).bind('click',()=>{
              var imgSrc = this.moveObj.find('img').attr('iSrc');
            Modal.css('display','block');
            showPicPar.find('img').attr('src',imgSrc);

            showPicPar.animate({'width':'600px'},1000,()=>{
              var width = $(window).height()-showPicPar.find('img').height();
                 Modal.css('paddingTop',width/2+'px');
            });
        });
       }
        var single =false;
        //关闭模态框
        Modal.bind('click',()=>{
              if(single){
              return;
              }
            single =true;
            showPicPar.animate({'width':'0px'},1000,()=>{
                Modal.css('paddingTop','0px');
                  Modal.css('display','none');
                  single=false;
             });
        });
  }
}