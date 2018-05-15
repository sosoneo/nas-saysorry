"use strict";

var TimeCapsuleItem = function(text){
    if(text){
        var obj = JSON.parse(text);
        this.username = obj.username;
        this.content = obj.content;
    }
};

TimeCapsuleItem.prototype = {
    toString : function(){
        return JSON.stringify(this)
    }
};

var TheTimeCapsule = function(){
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function(text){
            return new TimeCapsuleItem(text);
        },
        stringify: function(o){
            return o.toString();
        }
    });
};

TheTimeCapsule.prototype = {
    init:function(){

    },

    save:function(author,content){
        if(!author || !content){
            throw new Error("empty author or content or appointedtime")
        }

        if(author.length > 20){
            throw new Error("author limit 20 length")
        }

        if(content.length > 5000){
            throw new Error("content limit 5000 length")
        }

        var from = Blockchain.transaction.from;
        var timeCapsuleItem = this.data.get(username);
        if(timeCapsuleItem){
            throw new Error("timeCapsule has been occupied")
        }

        timeCapsuleItem = new TimeCapsuleItem();
        timeCapsuleItem.author = from;
        timeCapsuleItem.username = username;
        timeCapsuleItem.content = content;

        this.data.put(username, timeCapsuleItem);
    },

    get:function(username){
        if(!username){
            throw new Error("empty username")
        }
        return this.data.get(username);
    }

}

module.exports = TheTimeCapsule;