"use strict";

var SorryItem = function(text){
    if(text){
        var obj = JSON.parse(text);
        this.from = obj.from;
        this.sender = obj.sender;
        this.recipient = obj.recipient;
        this.content = obj.content;
    }
};

SorryItem.prototype = {
    toString : function(){
        return JSON.stringify(this)
    }
};

var TheSorry = function(){
    LocalContractStorage.defineMapProperty(this, "arrayMap");
    LocalContractStorage.defineMapProperty(this, "dataMap");
    LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineMapProperty(this, "sorry", {
        parse: function(text){
            return new SorryItem(text);
        },
        stringify: function(o){
            return o.toString();
        }
    });
};

TheSorry.prototype = {
    init:function(){
        this.size = 0;
    },

    save:function(content,sender,recipient){
        if(!content || !sender || !recipient){
            throw new Error("empty content / sender / recipient")
        }

        if(sender.length > 100){
            throw new Error("sender limit 100 length")
        }

        if(recipient.length > 100){
            throw new Error("recipient limit 100 length")
        }

        if(content.length > 5000){
            throw new Error("content limit 5000 length")
        }

        var from = Blockchain.transaction.from;
        var sorryItem = this.sorry.get(from+recipient);
        if(sorryItem){
            throw new Error("sorrt has been occupied")
        }

        sorryItem = new SorryItem();
        sorryItem.from = from;
        sorryItem.author = from;
        sorryItem.sender = sender;
        sorryItem.recipient = recipient;
        sorryItem.content = content;

        var index = this.size;
        this.arrayMap.put(index, from+recipient);
        this.dataMap.put(from+recipient, sorryItem);
        this.size += 1;

        this.sorry.put(from+recipient, sorryItem);
    },

    get:function(from,recipient){
        if(!from){
            throw new Error("empty from")
        }
        if(!recipient){
            throw new Error("empty recipient")
        }
        return this.sorry.get(from+recipient);
    },

    len:function(){
        return this.size;
    },

    foreach:function(limit,offset){
        limit = parseInt(limit);
        offset = parseInt(offset);
        if(offset>this.size){
           throw new Error("offset is not valid");
        }
        var number = offset + limit;
        if(number > this.size){
            number = this.size;
        }
        var result  = [];
        for(var i=offset;i<number;i++){
            var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
            result.push(object);
            // result += "index:" + i + " key:" + key + " value:" + object + "_";
        }
        return result;
    }
}

module.exports = TheSorry;