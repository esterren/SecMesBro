/**
 * Created by rest on 18.05.14.
 */

var mows   = require('mows'),
    $ = require('jquery-browserify'),
    HashMap = require('hashmap').HashMap,
    mapTopic = new HashMap(),
    bs = require('./libs/bootstrap/bootstrap-switch.min'),
    client = mows.createClient(3000,'wss://localhost');

/*var basetopic = 'RPi1/berryclip/',
    ledtopic = 'leds/',
    buzzertopic = 'buzzers/',
    buttontopic = 'buttons/',
    ledstatuspattern = new RegExp(".*"+ledtopic.replace('/',"\\/")+'[0-9]+\/.*',"g"),
    buzzerstatuspattern = new RegExp(".*"+buzzertopic.replace('/',"\\/")+'[0-9]+\/.*',"g"),
    buttonstatuspattern = new RegExp(".*"+buttontopic.replace('/',"\\/")+'[0-9]+\/.*',"g");*/

// pass an optional 'ws://localhost:port' here.

client.subscribe('#');

client.on('message', function (topic, message) {
    console.log(topic, message);

    //TODO bei topic RPi1/status OFFLINE -> alert
    if(topic =='RPi1/status'){
        if(message.toUpperCase()=='OFFLINE'){
            showAlert('#alert-1','The embedded system is offline!',true);
        }else if (message.toUpperCase()=='ONLINE'){
            showAlert('#alert-2','The embedded system is online!',true);
        }
        return;
    }

    var id = topic.split("/") [topic.split("/").length - 2];
    var swid = '';
    if(topic.match(/\/leds\/\d\/status/g)){
        swid = 'led-switch-'+id;
    }else if(topic.match(/\/buzzers\/\d\/status/g)){
        swid = 'buzzer-switch-'+id;
    }else if(topic.match(/\/buttons\/\d\/status/g)){
        swid = 'button-switch-'+id;
    }

    if(swid){
        if(!mapTopic.get(swid)){mapTopic.set(swid,topic)};

        if(message.toUpperCase() =='ON'||message.toUpperCase() =='ACTIVE' ){
            $('#'+swid).bootstrapSwitch('state',true, true);
        } else if(message.toUpperCase() == 'OFF'||message.toUpperCase() =='INACTIVE'){
            $('#'+swid).bootstrapSwitch('state',false, true);
        }
    }
});

client.on('error', function(packet){
    console.log('error')

});

client.on('close', function(packet){
//    showAlert('#alert-1','Lost WebSocket connection to the server!',false);

    if($('#alert-3').hasClass('hidden')){
        $('#alert-3-text').text('Lost WebSocket connection to the server!');
        $('#alert-3').removeClass('alert-success hidden');
        $('#alert-3').addClass('alert-danger show');

//        $('#alert-3').toggleClass('alert-danger alert-success show hidden');
    }
    console.log('closed');

});
client.on('connect', function(packet){
    console.log('connected');
    if($('#alert-3').hasClass('show')){
        $('#alert-3-text').text('WebSocket reconnected to the server!');
        $('#alert-3').fadeOut(function(){
            $('#alert-3').removeClass('alert-danger');
            $('#alert-3').addClass('alert-success').fadeIn(function(){
                window.setTimeout(function () {
                    $('#alert-3').fadeOut().addClass('hidden');

                }, 3000);
            });

        });

//        $('#alert-3').toggleClass('alert-danger alert-success show hidden');
    }
//    showAlert('#alert-2','WebSocket reconnected to the server!',true);

});
var publish = function (topic, message){
    if(topic && message){
        client.publish(topic, message);
    }
};

//module.exports = publish;
$(document).ready(function(){

    $("input[type='checkbox']").bootstrapSwitch();

    $('input[type="checkbox"]').on('switchChange.bootstrapSwitch', function (event, state) {
//        console.log(this); // DOM element
//        console.log(event); // jQuery event
//        console.log(state); // true | false
        var $element = $(state.el),
            value = state.value,
//            id = $element.attr('id').split('-')[2];
            id = $element.attr('id');
        var states = (id.match(/button-switch-\d/g))? ['ACTIVE','INACTIVE']: ['ON','OFF'] ;

        if(value){
            value =states[0];
        }else if (!value){
            value =states[1];
        }

        console.log(id, value);
        //TODO Alert on missing Topic
        if(mapTopic.get(id)){
            publish(mapTopic.get(id),value);
        } else{
            showAlert('#alert-1','Topic for Control is unknown',true);
        }
    });
    $("[id^=led-all-]").click(function(){
        var that = this;
        mapTopic.forEach(function(value,key){
            if(key.match(/led-switch-\d/g)){
                if(that.id == "led-all-on"){
                    publish(value, 'ON');
                }else if (that.id == "led-all-off"){
                    publish(value,'OFF');
                }
            }
        })
    });
    $("#buzzer-btn-1").click(function(){
        var value = parseInt($('#buzzer-input-1').val(),10);
        if($.isNumeric(value)&& value >= 1 && value <= 30){
            publish(mapTopic.get('buzzer-switch-1'),value.toString());
        }
        $('#buzzer-input-1').val('');
    });

});

function showAlert(id,text,fade){
    $(id+'-text').text(text);
    $(id).removeClass('hidden');
    if(fade ===true){
        $(id).fadeIn(function(){
            window.setTimeout(function () {
                $(id).fadeOut()
            }, 3000);
        });
    }
}

/*
function showInfo(text){
    $('#alert-2-text').text(text);
    $('#alert-2').removeClass('hidden').fadeIn(function(){
        window.setTimeout(function () {
            $("#alert-2").fadeOut()
        }, 3000);
    });
}*/
