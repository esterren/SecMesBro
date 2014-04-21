/**
 * Created by rest on 14.03.14.
 */



$().ready(function(){

    // TODO handle disconnect
    socket = io.connect('http://localhost');
    socket.on('init', function (data) {
        console.log(data);
        $('[id^=led-]').remove();
        generateLEDRows(data);
    });


    socket.on('update', function (data) {
        console.log(data);
        setLedSwitchState(data);
    });


});

function generateLEDRows(obj){

    var template = $('#template-led').clone();
    $.each(obj,function(index, value){

        //TODO Check typeof value.id and value.state ==='undefinded'
        var template = $('#template-led').clone();
        template.removeClass('hidden');
        template.attr('id','led-'+value.id);
        template.find('h4').first().text('LED '+ value.id);

        var swid = 'led-switch-'+value.id;

        template.find(':checkbox').attr('id', swid);


        if(value.state.toUpperCase() =='ON'){
            $('#'+swid).bootstrapSwitch('state',true);
        } else if(value.state.toUpperCase() == 'OFF'){
            $('#'+swid).bootstrapSwitch('state',false);
        }
        if(value.state.toUpperCase() == 'ON'){
            template.find('#led-temp-on').addClass('active');
        }else if (value.state.toUpperCase() =='OFF'){
            template.find('#led-temp-off').addClass('active');

        }
        template.find('#led-temp-on').attr('id','led-'+value.id+'-on' );
        template.find('#led-temp-off').attr('id','led-'+value.id+'-off' );

        $('#template-led').parent().append(template);

    });

    setLedSwitchState(obj);


    $(':checkbox').on('switchChange', function (e, data) {
        var $element = $(data.el),
            value = data.value,
            id = $element.attr('id').split('-')[2];

        if(value){
            value ="ON";
        }else if (!value){
            value = "OFF";
        }

        console.log(e, $element, value, id);
        socket.emit('command',{'id':id,'state':value});
    });
};

function setLedSwitchState(obj){
    $.each(obj,function(index, value){
        var swid = 'led-switch-'+value.id;
        if(value.state.toUpperCase() =='ON'){
            $('#'+swid).bootstrapSwitch('state',true);
        } else if(value.state.toUpperCase() == 'OFF'){
            $('#'+swid).bootstrapSwitch('state',false);
        }
    });
};