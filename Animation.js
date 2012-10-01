/**
 * Created with JetBrains WebStorm.
 * User: MikeZhang
 * Date: 12-10-1
 * Time: 下午1:52
 * To change this template use File | Settings | File Templates.
 */
undefined = null;
var Animation = {};
Animation.Page = function (currentID,nextID,direction,poptions) {
    this.animationID = null;
    this.duration = 2000; //millisecond
    this.fps = 60;
    this.mspf = 1000/this.fps;
    this.direction = direction;
    //DOM
    this.cE = document.getElementById(currentID);
    if(this.cE === null) {
        throw new Error('Animation.Page:current element cannot found! ID:'+currentID);
    }
    this.nE = document.getElementById(nextID);
    if(this.nE === null) {
        throw new Error('Animation.Page:next element cannot found! ID:'+nextID);
    }
    //offset compute
    this.w = this.cE.clientWidth;
    this.h = this.cE.clientHeight;
    this.a = Math.PI/2/this.duration*this.mspf;
    switch (direction) {
        case 'left' :
            this.da = -1;
            this.nsp = this.w;
            break;
        case 'right' :
            this.da = 1;
            this.nsp = -this.w;
            break;
        case 'up' :
            this.da = -1;
            this.nsp = this.h;
            break;
        case 'down' :
            this.da = 1;
            this.nsp = -this.h;
            break;
        default :
            throw new Error('Function page:undefined direction type!');
    }
    //options
    this.options = {
        opacity : false
    };
    if(poptions != null) {
        for(var attr in poptions){
            this.options[attr]=poptions[attr];
        }
    }
    //opacity compute
    if(this.options.opacity!=false) {
        this.no = this.options.opacity;
        this.ocs = (1-this.options.opacity)/this.duration*this.mspf;
    }
    //play
    this.step = 0;
    this.cancelling = false;
};
Animation.Page.prototype = {
    paging : function () {
        var that = this;
        that.animationID = setTimeout(play,that.mspf);
        function play () {
            var ia = that.a*that.step++;
            if(that.options.opacity!=false) {
                that.cE.style.opacity = 1-that.ocs*that.step;
                that.nE.style.opacity = that.no+that.ocs*that.step;
            }
            if(that.direction == 'left' || that.direction == 'right') {
                var offset = that.w*(1-Math.sin(Math.PI/2 + ia))*that.da;
                that.cE.style.left = offset+'px';
                that.nE.style.left = that.nsp+offset+'px';
                if(Math.abs(ia) < Math.PI/2) {
                    that.animationID = setTimeout(play,that.mspf);
                } else {
                    that.animationID = null;
                    that.nE.style.left = 0+'px';
                    that.nE.style.opacity = 1;
                    that.cE.style.left = that.w*2+'px';
                    that.step = 0;
                }
            } else {
                offset = that.h*(1-Math.sin(Math.PI/2 + ia))*that.da;
                that.cE.style.top = offset+'px';
                that.nE.style.top = that.nsp+offset+'px';
                if(Math.abs(ia) < Math.PI/2) {
                    that.animationID = setTimeout(play,that.mspf);
                } else {
                    that.animationID = null;
                    that.nE.style.top = 0+'px';
                    that.nE.style.opacity = 1;
                    that.cE.style.top = that.h*2+'px';
                    that.step = 0;
                }
            }
        }
    },
    flush : function () {
        if(this.animationID != null) {
            clearTimeout(this.animationID);
            this.step = 0;
            if(this.options.opacity!=false) {
                if(this.cancelling) {
                    this.cE.style.opacity = 1;
                    this.nE.style.opacity = this.no;
                } else {
                    this.cE.style.opacity = this.no;
                    this.nE.style.opacity = 1;
                }

            }
            if(this.direction == 'left' || this.direction == 'right') {
                if(this.cancelling) {
                    this.cE.style.left = 0+'px';
                    this.nE.style.left = this.w*2+'px';
                } else {
                    this.cE.style.left = this.w*2+'px';
                    this.nE.style.left = 0+'px';
                }
            } else {
                if(this.cancelling) {
                    this.cE.style.top = 0+'px';
                    this.nE.style.top = this.h*2+'px';
                } else {
                    this.cE.style.top = this.h*2+'px';
                    this.nE.style.top = 0+'px';
                }

            }
        }
    },
    cancel : function () {
        if(this.step != 0 && this.animationID != null) {
            this.cancelling = true;
            clearTimeout(this.animationID);
            var that = this;
            that.animationID = setTimeout(play,that.mspf);
            function play () {
                var ia = that.a*--that.step;
                if(that.options.opacity!=false) {
                    that.cE.style.opacity = 1-that.ocs*that.step;
                    that.nE.style.opacity = that.no+that.ocs*that.step;
                }
                if(that.direction == 'left' || that.direction == 'right') {
                    var offset = that.w*(1-Math.sin(Math.PI/2 + ia))*that.da;
                    that.cE.style.left = offset+'px';
                    that.nE.style.left = that.nsp+offset+'px';
                    if(that.step>0) {
                        that.animationID = setTimeout(play,that.mspf);
                    } else {
                        that.animationID = null;
                        that.cE.style.left = 0+'px';
                        that.cE.style.opacity = 1;
                        that.step = 0;
                        that.cancelling = false;
                    }
                } else {
                    offset = that.h*(1-Math.sin(Math.PI/2 + ia))*that.da;
                    that.cE.style.top = offset+'px';
                    that.nE.style.top = that.nsp+offset+'px';
                    if(that.step>0) {
                        that.animationID = setTimeout(play,that.mspf);
                    } else {
                        that.animationID = null;
                        that.cE.style.top = 0+'px';
                        that.cE.style.opacity = 1;
                        that.step = 0;
                        that.cancelling = false;
                    }
                }
            }
        }
    }
};