/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/
Swal.fire({
    icon: "success",
    title: "Welcome All the best from Developer",
    showConfirmButton: false,
    timer: 1500,
    showClass: {
      popup: `
 animate__animated
 animate__fadeInUp
 animate__faster
`,
    },
    hideClass: {
      popup: `
 animate__animated
 animate__fadeOutDown
 animate__faster
`,
    },
  });
$(function(){
    $('body').css('background-color','#000');
    var FPS = 60;
    var T = TT = 0;
    var canvas = $('<canvas>');
    var c = canvas[0].getContext('2d');
    var W = _W = 360;
    var H = _H = 512;
    var score = 0;
    var dim = {w:$(window).width(),h:$(window).height()};
    $(canvas).attr({'width':W,'height':H});
    _H = dim.h;
    _W = dim.h*W/H;
    if(W/H > dim.w/dim.h){
        _W = dim.w;
        _H = dim.w*H/W;
    };
    $(canvas).css({'position':'absolute','top':(dim.h-_H)/2,'left':(dim.w-_W)/2,'width':_W,'height':_H});
    $('body').append(canvas);
    var camY = 0;
    var died = false;
    var dCircle = function(coords,radius,color){
        c.beginPath();
        c.fillStyle = color;
        c.arc(coords.x,coords.y,radius,0,2*Math.PI);
        c.fill();
    };
    var coord = function(dx,dy){
        return {x:dx,y:H+camY-dy};
    };
    var col = ['#F39','#3FF','#FF3','#A0F'];
    var gCol = function(index){
        var n = index;
        return col[n%4];
    };
    var rRange = function(x1,x2){
        return x1+Math.random()*(x2-x1);
    };
    var choose = function(){
        return arguments[Math.floor(arguments.length*Math.random())];
    };
    var rCol = function(){
        return col[Math.floor(4*Math.random())];
    };
    var repeat = function(func,rep){
        for(var _rep = 0; _rep < rep; _rep++){
            func();
        };
    };
    var getDots = function(xy1,xy2){
        return {
            d:Math.sqrt(Math.pow(xy1.x-xy2.x,2)+Math.pow(xy1.y-xy2.y,2)),
            a:Math.atan2(xy1.y-xy2.y,xy2.x-xy1.x)
        };
    };
    var die = function(){
        died = true;
        repeat(function(){newParticle(p.x,p.y+5);},14);
        TT = 1;
    };
    var colIndex = Math.floor(4*Math.random());
    var p = {x:W/2,y:H/4,r:10,c:gCol(colIndex),spd:0,spdMax:6,acc:0};
    var objects = [];
    var newObject = function(x,y,r,c){
        var o = {x:x,y:y,r:r,c:c,t:0,destroyed:false};
        o.move = function(){};
        o.draw = function(){
            dCircle(coord(o.x,o.y),o.r,o.c);
        };
        o.destroy = function(){
            o.destroyed = true;
        };
        o.update = function(){
            o.move();
            o.draw();
            if(o.y+100 < camY){
                o.destroy();
            };
            o.t++;
        };
        objects.push(o);
        return o;
    };
    var modAng = function(x){
        var y = x;
        while(y < 0){
            y += Math.PI*2;
        };
        return y%(Math.PI*2);
    };
    var obstacles = {n:0,sep:350};
    var cspd = 1;
    var new8 = function(y,ang,dir,col){
        var o8 = newObject(W/2,100+obstacles.sep*y,10,gCol(col));
        o8.cx = o8.x;
        o8.cy = o8.y;
        o8.rad8 = 80;
        o8.d = dir;
        o8.a = ang;
        o8.move = function(){
            with(o8){
                x = cx+1.5*rad8*Math.cos(a);
                y = cy+0.7*rad8*Math.sin(2*a);
                a += d*0.02;
            };
            if(!died && p.c != o8.c && getDots(coord(p.x,p.y),coord(o8.x,o8.y)).d < p.r+o8.r){
                die();
            };
        };
    };
    var newW8 = function(y){
        var ddir = choose(-1,1);
        for(var i = 0; i < Math.PI*2; i += Math.PI*2/20){
            new8(y,i,ddir,Math.floor(8*(i/(Math.PI*2))));
        };
    };
    var newC1 = function(y,rad,ospd,dir){
        var c1 = newObject(W/2,100+obstacles.sep*y,rad,Math.floor(4*Math.random()));
        c1.angle = Math.PI*2*Math.floor(4*Math.random());
        c1.spd = dir*cspd*ospd;
        c1.w = c1.r*15/100;
        c1.draw = function(){
            var co = coord(c1.x,c1.y);
            c.lineWidth = c1.w;
            for(var j = 0; j < 4; j++){
                c.beginPath();
                c.strokeStyle = gCol(j+c1.c);
                var a = modAng(c1.angle+Math.PI/2*j);
                var a2 = modAng(a+Math.PI/2);
                if(gCol(j+c1.c) != p.c && !died){
                    var dots = getDots(co,coord(p.x,p.y));
                    if(dots.d+p.r > c1.r-c1.w/2 && dots.d-p.r < c1.r+c1.w/2){
                        var pa = modAng(-dots.a);
                        if(pa > a && pa < a2){
                            die();
                        };
                    };
                };
                c.arc(co.x,co.y,c1.r,a,a2);
                c.stroke();
            };
            c1.angle += c1.spd*Math.PI/180;
        };
    };
    var newParticle = function(x,y){
        var part = newObject(x,y,5,rCol());
        part.g = 0.6;
        part.hspd = rRange(-10,10);
        part.vspd = rRange(10,20);
        part.move = function(){
            with(part){
                vspd -= g;
                x += hspd;
                y += vspd;
                if(x < 0 || x > W){
                    hspd *= -1;
                };
                if(y < camY){
                    destroy();
                };
            };
        };
    };
    var newSwitch = function(n){
        var sw = newObject(W/2,100+obstacles.sep*n+obstacles.sep/2,15,'#FFF');
        sw.move = function(){
            if(getDots({x:sw.x,y:sw.y},{x:p.x,y:p.y}).d < p.r+sw.r){
                p.c = gCol(++colIndex);
                sw.destroy();
            };
        };
        sw.draw = function(){
            var co = coord(sw.x,sw.y);
            for(var i = 0; i < 4; i++){
                var a = i*Math.PI/2;
                c.fillStyle = col[i];
                c.beginPath();
                c.lineTo(co.x,co.y);
                c.arc(co.x,co.y,sw.r,a,a+Math.PI/2);
                c.lineTo(co.x,co.y);
                c.fill();
            };
        };
    };
    var newStar = function(n){
        var st = newObject(W/2,100+obstacles.sep*n,15,'#DDD');
        st.score = choose(1,1,1,1,1,1,10);
        st.a = 0;
        st.rs = st.r;
        st.move = function(){
            if(getDots({x:p.x,y:p.y},{x:st.x,y:st.y}).d < st.r){
                score += st.score;
                st.destroy();
            };
            st.r = st.rs+1.2*Math.sin((st.a++)/180*Math.PI*4);
        };
        st.draw = function(){
            dStar(st.x,st.y,st.r,0,st.c,1,st.score == 1);
        };
    };
    var dStar = function(x,y,r1,ang,col,alpha,outline){
        var co = coord(x,y);
        c.fillStyle = col;
        c.strokeStyle = col;
        c.lineWidth = 2;
        c.globalAlpha = alpha;
        c.beginPath();
        for(var j = 0; j <= 5; j++){
            var a1 = j*Math.PI*2/5-Math.PI/2-ang;
            var a2 = a1+Math.PI/5;
            var r2 = r1*0.5;
            c.lineTo(co.x+r1*Math.cos(a1),co.y+r1*Math.sin(a1));
            c.lineTo(co.x+r2*Math.cos(a2),co.y+r2*Math.sin(a2));
        };
        if(outline){
            c.fill();
        }else{
            c.stroke();
        };
        c.globalAlpha = 1;
    };
    p.yy = p.y;
    var clicked = false;
    $(canvas).click(function(){clicked = true;});
    setInterval(function(){
        c.fillStyle = '#222';
        c.fillRect(0,0,W,H);
        c.fillStyle = '#FFF';
        c.font = '30px Arial';
        c.textAlign = 'left';
        c.fillText(score,10,30);
        c.font = '50px Arial';
        c.textAlign = 'center';
        c.fillText('COLOR',W/2,coord(0,250).y);
        c.fillText('SWITCH',W/2,coord(0,200).y);
        while(obstacles.n < 2+Math.floor(camY/obstacles.sep)){
            obstacles.n += 1;
            switch(choose(0,0,0,0,1,2,2,2)){
            case 0:
                newC1(obstacles.n,choose(100,100,70),1,choose(-1,1));
                break;
            case 1:
                newC1(obstacles.n,100,2/3,1);
                newC1(obstacles.n,70,1,-1);
                break;
            case 2:
                newW8(obstacles.n);
                break;
            };
            newSwitch(obstacles.n);
            newStar(obstacles.n);
            cspd *= 1.04;
        };
        if(!died){
            if(clicked){
                p.spd = p.spdMax;
                if(p.acc == 0){
                    p.spd *= 1.2;
                    p.acc = -0.3;
                };
            };
            with(p){
                spd = Math.max(spd+acc,-spdMax);
                y = Math.max(y+spd,yy);
                if(y < camY){
                    die();
                };
                dCircle(coord(x,y),r,c);
            };
        };
        for(var i in objects){
            objects[i].update();
        };
        for(var i = objects.length-1; i >= 0; i--){
            if(objects[i].destroyed){
                objects.splice(i,1);
            };
        };
        camY = Math.max(camY,p.y-250);
        T += TT;
        if(T > 70){
            c.globalAlpha = 0.7;
            c.fillStyle = '#000';
            c.fillRect(0,0,W,H);
            c.globalAlpha = 1;
            c.fillStyle = '#000';
            c.strokeStyle = '#EEE';
            c.lineWidth = 2;
            c.fillText('TAP TO',W/2,H/2);
            c.strokeText('TAP TO',W/2,H/2);
            c.fillText('RESTART',W/2,H/2+50);
            c.strokeText('RESTART',W/2,H/2+50);
            if(clicked){
                score = 0;
                T = 0;
                TT = 0;
                camY = 0;
                cspd = 1;
                died = false;
                p.y = H*1/4;
                p.acc = 0;
                p.spd = 0;
                objects = [];
                obstacles.n = 0;
            };
        };
        clicked = false;
    },1000/FPS);
    });

    /* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/