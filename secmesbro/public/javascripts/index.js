/**
 * Created by rest on 14.03.14.
 */

$().ready(function(){
    var socket = io.connect('http://localhost');
    socket.on('init', function (data) {
        console.log(data);
        generateLEDRows(data);
        //socket.emit('my other event', { my: 'data' });
    });


    socket.on('message', function (data) {
        console.log(data);
    });


});

function generateLEDRows(obj){

    var template = $('#template-led').clone();
    $.each(obj,function(index, value){

        //TODO Check typeof value.id and value.state ==='undefinded'
        var template = $('#template-led').clone();
        console.log(value.id);
        console.log(value.state);
        template.removeClass('hidden');
        template.attr('id','led-'+value.id);
        template.find('h4').first().text('LED '+ value.id);

        if(value.state.toUpperCase() == 'ON'){
            template.find('#led-temp-on').addClass('active');
        }else if (value.state.toUpperCase() =='OFF'){
            template.find('#led-temp-off').addClass('active');

        }
        $('#template-led').parent().append(template);


    });

};