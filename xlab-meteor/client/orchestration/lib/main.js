var count = []; //a global array to save the count of each effect, for register id for each draggable object
var loadData = false; //load flag for metadata
var namestack = [];
var dictstack = [];
var abstracteventstack = []; //saved abstractevent, with attr of id, start_time, name,type

var timelinelength = window.innerWidth * 0.85; //px length of the slider
var video_url = '';
var video_name = '';
var video_id = '';
var EPSILON = 0.2;
var prev_id = '';
var timelinedrag_width = 0;
var loadVideo = false; //load flag for video 
var totalTimelineLayers = 0;
var cActiveLayer = 0;
var drageffect = "";
var isEffectDraging = false;
var colorArray = {"a":"123"};
var SelectedEffectOnDictionary = "";

var currentSelectedModule = 0;
//the priority queue to save all the draggable objects, use object id as data, use offset().left as priority, the draggable object with the smallest offset will be poped first
var heap = new BinaryHeap(
    function(element) {
        return element.offset;
    },
    function(element) {
        return element.id;
    },
    'offset'
);


Template.orchestration.events({
    'click #addTotimeline': function() {
        onclickaddtotimeline();
    },
    'click #addEffect': function() {
        effectFactory();
    },
    'click #removeFromtimeline': function() {
        onclickremovefromtimeline();
    },
    'click #switch': function() {
        switchElement();
    },
    'click #removeEffect': function() {
        onclickremoveeffect();
    },
    'click #edit': function() {
    
    },

    'click #loadData': function() {
        load_Data();
    },
    'click #saveData': function() {
        saveData();
    },
    'click #deployData': function() {
        deployData();
    },
    'click #effectFactory': function() {
        effectFactory();
    },
    'click #test_effect': function() {
        test_effect();
    },
    'click #save_dict': function() {
        save_dict();
        onclickaddeffect();
    },
    'click #play': function() {
        video_play();
    },
    'click #pause': function() {
        video_pause();
    },
    'click #volumn_up': function() {
        video_volumn_up();
    },
    'click #volumn_down': function() {
        video_volumn_down();
    },
    'click #stop': function() {
        video_stop();
    },
    'click #loadvideobutton': function() {
        load_video();
    },
    'click #changeVideo': function() {
        change_video();
    },
    'click #changeName': function() {
        change_effect_name();
    },
    'click #removeDict': function() {
        onclickremovefromdictionary();
    },

    'click #cancel': function() {
        cancel_dict();
    }
});

Template.orchestration.rendered = function() {
    $(function() {
        //this is where everything starts

        video_id = '2089841711'; //default video
        video_url = 'https://s3.amazonaws.com/xlab-media/matrixClip.mp4'; //default url
        var v = document.getElementById('videoId');
        pageInit(v);
   
              
        v.ontimeupdate = function() {
                update();
            } //ontimeupdate is called whenever the video is playing

    });
}



function update() {
    var v = document.getElementById('videoId');
    $("#slider").slider("value", v.currentTime);  
     var val = $('#slider').slider("option", "value");
    moveneedle(val, v.duration);
 

    //Check the draggable starting time.
    update_start_time();
    var test_string = '{"test":{';

    for(var i in abstracteventstack)
    {
        if(abstracteventstack[i].start_time>v.currentTime - EPSILON && abstracteventstack[i].start_time < v.currentTime+EPSILON && prev_id != abstracteventstack[i].id)
        {
            
            for(var j in dictstack)
            {
                if(dictstack[j].name == abstracteventstack[i].name)
                {
                    test_string = test_string + '"addr":{"duration":"' + (dictstack[j].addr_duration * 1000).toString() + '","pattern":"' + dictstack[j].addr_pattern + '","color":"' + dictstack[j].addr_color + '","direction":"' + dictstack[j].direction + '","shape":"' + dictstack[j].shape + '"},"nonAddr":{"duration":"' + (dictstack[j].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[j].nonAddr_pattern + '","color":"' + dictstack[j].nonAddr_color + '"}}}';
                    //console.log(dictstack[j].name);
                    var test_json = $.parseJSON(test_string);
                    console.log(test_json.test);
                    Meteor.call('updateTimeAndEvent', 'xlab_module_3', 0, test_json.test); 
                    prev_id = abstracteventstack[i].id;
                    break;
                }
            }
        }
    }
}

function initslider(duration) {

var totalLen = $('#effecttimelines').width();
    $("#slider").slider({
        min: 0,
        max: duration,
        animate: true,
        step: 0.1,
        slide : function(e, ui) { 
           //user is dragging
                moveneedle(ui.value,duration);
           },
        change: function(event, ui) {
            $("#amount").val(ui.value);
  
            if (event.originalEvent) {
                videoSkip(ui.value);
            }

        }
    }).width(totalLen + 'px'); //setting the width of the slider
}

function moveneedle(val,duration){
        var needle = $('#needle');
    var totalLen = $('#effecttimelines').width();
    var ratio = totalLen / duration / 1.0;
 needle.css(({left:val * ratio +78}));    
}

function initializeTimeCode(videolen){
    var time = $('#time');
    var timeCodeStepSize = 8;
    var totalTimelineLength = $('#timecode_bar').width();
    var s = parseInt(videolen / timeCodeStepSize);
    var mspacing = totalTimelineLength / (timeCodeStepSize+1);
    var str = "";
    console.log(s);
    time.css("word-spacing", mspacing+"px");
    for(var i = 0 ; i < timeCodeStepSize ; i++){
        str += " " + "00:00:"+(i * s);
    }
    time.html(str);
}
function getValue(key, obj){
    for(var p in obj){
        if(key == p)
            return obj[key];
    }
    return "";
}

function in_array(key, obj){
    for(var p in obj){
        if(p == key)
            return true;
    }
    return false;
}
function load_video() {

    video_url = document.getElementById("loadvideourl").value;
    video_name = document.getElementById("loadvideoname").value;
    video_id = hashCode(video_url);

    if (video_url != null && video_name != null && !loadVideo) {
        loadVideo = true;
        $('#videoPanel').children().eq(0).text('Video Content');
        $('#loadvideo').hide();
        //change video source url
        //console.log(video_url);
        $('#videoId source').attr('src', video_url);
        $("#videoId").load();

       // $('#videoContent').show();
        $('#changeVideo').show();

        var video_string = '{"id":"' + video_id + '","videoSource":"' + video_url + '","metaSource":"","name":"' + video_name + '","rating":"","thumbnail": "/images/orchestration/default.jpg"}';
        var video_json = $.parseJSON(video_string);
        //console.log(video_json);        

        //meteor update
        var vid = OrchVideos.findOne({});

        // var id = "3";
        // var jsonToInsert = {
        //     "id": id,
        //     "videoSource": "/videos/macys.mp4",
        //     "metaSource": "/metadata/macys.json",
        //     "name": "Macy Orch",
        //     "rating": "5",
        //     "thumbnail": "/images/macys.jpg"
        // };
        vid.videos[video_id] = video_json;
        OrchVideos.update({
            _id: vid._id
        }, {
            $set: {
                videos: vid.videos
            }
        });
        //meteor update
    }
}


//TODO: double check this function
function change_video() {
    //if we want to change video source
    video_url = '';
    video_name = '';
    document.getElementById("loadvideourl").value = '';
    document.getElementById("loadvideoname").value = '';

    $('#videoPanel').children().eq(0).text('Video Loader');
    //$('#videoContent').hide();
    $('#loadvideo').show();
    $('#changeVideo').hide();
    loadVideo = false;
    loadData = false;


    //clear other elements: draggable object and selectables
    //clear select effects

    while ($('#selecteffect li').length) {
        for (var i in namestack) {
            if ($('#selecteffect').children().eq(i).length) {
                $('#selecteffect').children().eq(i).remove();
                //$('#selecteffect').selectable("refresh");
            }

        }
    }

    //clear draggables
    while ($('#effecttimelines').children().length) {
        for (var i in namestack) {
            if ($('#effecttimelines').children().eq(i).length) {
                $('#effecttimelines').children().eq(i).remove();
            }
        }
    }

    //clear existing data structures
    count = [];
    namestack = [];
    dictstack = [];
    abstracteventstack = [];

    //clear the heap
    while (heap.size() != 0) {
        heap.pop();
    }

    //clear input text
    $('#neweffect').empty();
    $('#input_addr_duration').empty();
    $('#input_nonAddr_duration').empty();
}

function delay() {
        return;
    }
    //TODO: finish the update on the html/jquery elements
function change_effect_name() {
    var new_name = document.getElementById("neweffect").value; //this is the new name
    var old_name = $("#select-result").text();
    var name_cnt = 0; //count of draggables

    for (var j in count) {
        if (count[j].name == old_name) {
            name_cnt = count[j].cnt;
        }

    }

    if (new_name != old_name && new_name != '') //if new name is different from old name and new name is not empty
    {
        //update every draggable object
        if ($('#' + old_name + 'timeline').length) {
            for (var i = 0; i < name_cnt; ++i) {
                var id = $('#' + old_name + 'timeline').children().eq(i).attr('id').match(/\d+/)[0];
                $('#' + old_name + 'timeline').children().eq(i).attr('id', new_name + id.toString());

                $('#' + old_name + 'timeline').children().eq(i).children().eq(0).html(new_name + id.toString());
            }
            $('#' + old_name + 'timeline').attr('id', new_name + 'timeline');
        }

        //update selectable list
        if ($('#e' + old_name).length) {
            $('#e' + old_name).html(new_name);
            $('#e' + old_name).attr('id', 'e' + new_name);
        }

        //update heap
        while (heap.size() != 0) {
            heap.pop();
        }


        //update count array
        for (var i in count) {
            if (count[i].name == old_name) {
                count[i].name = new_name;
                break;
            }
        }

        //update namestack
        arrayRemove(namestack, old_name);
        namestack.push(new_name);

        //update abstracteventstack
        for (var i in abstracteventstack) {
            if (abstracteventstack[i].name == old_name) {
                abstracteventstack[i].name = new_name;
                var cnt = abstracteventstack[i].id.match(/\d+/)[0];
                abstracteventstack[i].id = new_name + cnt.toString();
            }
        }

        //update dictionary stack
        for (var i in dictstack) {
            if (dictstack[i].name == old_name) {
                dictstack[i].name = new_name;
                break;
            }

        }

        console.log(namestack);
        console.log(count);
        console.log(abstracteventstack);
        console.log(dictstack);
    }

}

function videoSkip(time) {
    document.getElementById('videoId').currentTime = time;
    //$("#slider").slider('refresh');
}

function video_play() {
     var v = document.getElementById('videoId');
    v.play();
  
}

function video_pause() {
    document.getElementById('videoId').pause();
}

function video_volumn_up() {
    var v = document.getElementById('videoId');
    if (v.volume < 0.9) {
        v.volume += 0.1;
    }
}

function video_volumn_down() {
    var v = document.getElementById('videoId');
    if (v.volume > 0.1) {
        v.volume -= 0.1;
    }
}

function video_stop() {
    var v = document.getElementById('videoId');
    v.pause();
    v.currentTime = 0;

}


function arrayRemove(array, value) {
    var index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function pageInit(video) {

    //initialize slider
    video.addEventListener('loadedmetadata', function() {
        if (loadVideo) $("#slider").slider("option", "max", video.duration);
        else {
            initslider(video.duration);
            $("#amount").val($("#slider").slider("value"));
            setTimeout(load_Data,300);
            //setTimeout(resetMainPanel, 310);
            setTimeout(refreshList,320);
     
        }
    });
}


function refreshList(){
    // $("#effect_list").selectbox("detach");
    $("#effect_list").empty();
    for (var name in namestack) {
       $("#effect_list").append($("<option></option>").attr("value",name).text(namestack[name]));
       $("#effect_list").append($("<option></option>").attr("value",name).text(namestack[name])); //fastfind fastdelete
    }
    $("#effect_list").selectbox();
    // $("#effect_list").selectbox("attach");
}

function resetMainPanel(){

         $('#Panel').height(($(window).height() - $('#MainTimeLineFooter').height() - 10));
}

function onclickaddtotimeline() {
    var selectedId = /*$("#select-result").text();*/ $("#effect_list option:selected").text();
    if (selectedId != 'none' && selectedId != null){   //add a new draggable
        console.log(selectedId.toString());
        for (var k in dictstack) {
            console.log(k +":" +dictstack[k].name);
            if (selectedId == dictstack[k].name) {   //locate the selected effect 
                console.log("locate the selected effect");
                var duration = Math.max(dictstack[k].addr_duration, dictstack[k].nonAddr_duration);
                //get current active layer
                console.log(" current active layer is " + cActiveLayer)
                add_draggable(selectedId, 0, duration, cActiveLayer);
                applyColors(selectedId);
                for (var j in count) {
                    if (count[j].name == selectedId)
                        abstracteventstack.push(new abstractevent(selectedId, selectedId + count[j].cnt, 0, 'abstract_event',cActiveLayer));
                }
            }
        }
    }
}

function onclickremoveeffect() {
    var selectedEffect = $("#select-result").text();

    if (arrayContains(selectedEffect, namestack)) {
        removeFromTimeLine(selectedEffect); //remove all the draggable object under this effect name
        //remove the effect time line div 
        if ($('#' + selectedEffect + 'timeline').length) {
            $('#' + selectedEffect + 'timeline').remove();
        }
        //remove the li on the selectable list

        if ($('#e' + selectedEffect).length) {
            $('#e' + selectedEffect).remove();
        }

        //remove the name from namestack
        arrayRemove(namestack, selectedEffect);

        //remove the count from count array
        var i = 0;
        for (i = 0; i < count.length; ++i) {

            if (count[i].name == selectedEffect) {
                break;
            }
        }
        if (i > -1) {
            count.splice(i, 1);
        }


    } else {
        alert('effect not exist!');
    }

    //for testing the content of both arrays
    //console.log(namestack);
    //console.log(count);
    $("#select-result").empty();
    $('#selecteffect').selectable("refresh");
}

function onclickremovefromdictionary()
{
    var selectedEffect = $("#select-result").text();
    onclickremoveeffect();  //remove the effect first
    //pop the dictobj from the dict stack
    for (var i in dictstack) {
        if (dictstack[i].name == selectedEffect) {
            dictstack.pop(dictstack[i]);
            break;
        }
    }

    var dict_string = '{';
    for (var i = 0; i < dictstack.length; ++i) {
        if (i == dictstack.length - 1) {
            dict_string = dict_string + '"' + dictstack[i].name + '":{"light":{"addr":{"duration":"' + (dictstack[i].addr_duration * 1000).toString() + '","pattern":"' + dictstack[i].addr_pattern + '","color":"' + dictstack[i].addr_color + '","direction":"' + dictstack[i].direction + '","shape":"' + dictstack[i].shape + '"},"nonAddr":{"duration":"' + (dictstack[i].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[i].nonAddr_pattern + '","color":"' + dictstack[i].nonAddr_color + '"}},"vest":{},"couch":{}}}';
        } else {
            dict_string = dict_string + '"' + dictstack[i].name + '":{"light":{"addr":{"duration":"' + (dictstack[i].addr_duration * 1000).toString() + '","pattern":"' + dictstack[i].addr_pattern + '","color":"' + dictstack[i].addr_color + '","direction":"' + dictstack[i].direction + '","shape":"' + dictstack[i].shape + '"},"nonAddr":{"duration":"' + (dictstack[i].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[i].nonAddr_pattern + '","color":"' + dictstack[i].nonAddr_color + '"}},"vest":{},"couch":{}},';
        }

    }

    var json = $.parseJSON(dict_string);
    //console.log(json);
    var dictData = Dictionary.findOne({});

    Dictionary.update({
        _id: dictData._id
    }, {
        $set: {
            dict: json
        }
    });
}

function onclickremovefromtimeline() {
    var selectedEffect = $("#select-result").text();
    removeFromTimeLine(selectedEffect); //remove all the draggable from the timeline but still keep the timeline div
}

function onclickaddeffect() {

    var effectname = document.getElementById("neweffect").value;

    if (!arrayContains(effectname, namestack)) {
        //add selectable
        $('#selecteffect').append("<li id = \"e" + effectname + "\" class=\"ui-widget-content\">" + effectname + "</li>");
        $('#selecteffect').selectable("refresh");

        //add effect time line
        $('#effecttimelines').append("<div id=\"" + effectname + "timeline\"></div>");
        $('#' + effectname + "timeline").css({
            "width": "100%",
            "height": "auto"
        });

        //add effect count in the count array
        count.push(new counter(effectname));

        //add effect name in the name array
        namestack.push(effectname);

        if (!loadData) {
            initEffectList(); //initialize the selectable list if the data hasn't been loaded
        }

        //start the effect factory for this new effect
        //if the new effect we added already in dictionary, we clear the old parameters
        for (var i in dictstack) {
            if (dictstack[i].name == effectname) {
                dictstack.pop(dictstack[i]);
                break;
            }
        }
        dictstack.push(new dictobj(effectname, 0 ,'none',',,','none','none', 0, 'none',',,'));

        //add to display list
        $("#effect_list").selectbox("detach");
        $("#effect_list").append($("<option></option>").attr("value","name").text(effectname.toString()));               
        $("#effect_list").selectbox("attach");

        //document.getElementById('select-result').value = effectname;
        var res = $('#select-result').empty();
        res.append(effectname);
        effectFactory();

    } else {
        alert('effect already exist!');
    }
    //console.log(abstracteventstack);
}


//the function for testing the effect in real time
function test_effect() {
    //track everything on the second panel
    var v = document.getElementById('videoId');
    update_dictionary();
    var selectedEffect = $("#effect_list option:selected").text();
    var test_string = '{"test":{';
    for (var i in dictstack) {
        if (dictstack[i].name == selectedEffect) {
            test_string = test_string + '"addr":{"duration":"' + (dictstack[i].addr_duration * 1000).toString() + '","pattern":"' + dictstack[i].addr_pattern + '","color":"' + dictstack[i].addr_color + '","direction":"' + dictstack[i].direction + '","shape":"' + dictstack[i].shape + '"},"nonAddr":{"duration":"' + (dictstack[i].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[i].nonAddr_pattern + '","color":"' + dictstack[i].nonAddr_color + '"}}}';
        }
    }

    console.log("logging test string");
    console.log(test_string);
    return false;
    var test_json = $.parseJSON(test_string);
    console.log(test_json.test);
    Meteor.call('updateTimeAndEvent', 'xlab_module_3', 0, test_json.test);                

    /*
    var test_string = 'x_wave'+R+','+G+','+B+',0,15,'+duration+'/r/n';

    var request = new XMLHttpRequest();

    // GET /message/command, and make an asynchronous request:
    request.open( "GET", '/message/' + test_string, true );
    // close the request:
    request.send( null );
    */
}

//the function for save dictionary data
function save_dict() {
    var addr_duration = 0;
    var nonAddr_duration = 0;
    var v = document.getElementById('videoId');
    update_dictionary();
    //first collect the data from the second panel
    var selectedEffect = $("#effect_list option:selected").text();

    for (var i in dictstack) {
        if (dictstack[i].name == selectedEffect) {
            addr_duration = dictstack[i].addr_duration;
            nonAddr_duration = dictstack[i].nonAddr_duration;
        }
    }

    var duration = Math.max(addr_duration, nonAddr_duration);
    var display_width = ((duration / v.duration) * timelinelength).toString(); //handle the width of the draggable object according to the effect duration
    //change the duration of every draggable objetcts from the timeline

    for (var i in abstracteventstack) {
        if (abstracteventstack[i].name == selectedEffect) {
            $('#' + abstracteventstack[i].id).width(display_width + 'px');
        }
    }


    // $('#controlPanel').show(); //this hides the control panel
    // $('#effectFactoryPanel').hide(); //this show up the effectFactory panel for lights

    var dict_string = '{';
    for (var i = 0; i < dictstack.length; ++i) {
        if (i == dictstack.length - 1) {
            dict_string = dict_string + '"' + dictstack[i].name + '":{"light":{"addr":{"duration":"' + (dictstack[i].addr_duration * 1000).toString() + '","pattern":"' + dictstack[i].addr_pattern + '","color":"' + dictstack[i].addr_color + '","direction":"' + dictstack[i].direction + '","shape":"' + dictstack[i].shape + '"},"nonAddr":{"duration":"' + (dictstack[i].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[i].nonAddr_pattern + '","color":"' + dictstack[i].nonAddr_color + '"}},"vest":{},"couch":{}}}';
        } else {
            dict_string = dict_string + '"' + dictstack[i].name + '":{"light":{"addr":{"duration":"' + (dictstack[i].addr_duration * 1000).toString() + '","pattern":"' + dictstack[i].addr_pattern + '","color":"' + dictstack[i].addr_color + '","direction":"' + dictstack[i].direction + '","shape":"' + dictstack[i].shape + '"},"nonAddr":{"duration":"' + (dictstack[i].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[i].nonAddr_pattern + '","color":"' + dictstack[i].nonAddr_color + '"}},"vest":{},"couch":{}},';
        }

    }

    console.log(dict_string);
    return false;
    var json = $.parseJSON(dict_string);
    console.log(json);
    var dictData = Dictionary.findOne({});

    Dictionary.update({
        _id: dictData._id
    }, {
        $set: {
            dict: json
        }
    });


}

function cancel_dict(){
    $('#controlPanel').show(); //this hides the control panel
    //$('#effectFactoryPanel').hide(); //this show up the effectFactory panel for lights
      //animate
    $( "#effectFactoryPanel" ).animate({
    marginLeft: "0"
      }, 300 );
}

function update_dictionary() {
    var v = document.getElementById('videoId');


    //first collect the data from the second panel
    var addr_duration = parseFloat($("#input_addr_duration").val());
    var addr_pattern = $('#addr_pattern').find(":selected").text();
    var addr_color = $('#addr_color').find(":selected").text();
    var addr_R = $('#addr_red').val() * 256;
    var addr_G = $('#addr_green').val() * 256;
    var addr_B = $('#addr_blue').val() * 256;
    var direction = $('#direction').find(":selected").text();
    var shape = $('#shape').find(":selected").text();

    var nonAddr_duration = parseFloat($("#input_nonAddr_duration").val());
    var nonAddr_color = $('#nonAddr_color').find(":selected").text();
    var nonAddr_pattern = $('#nonAddr_pattern').find(":selected").text();

    //why is it times 256????
    // might be problematic
    var nonAddr_R = $('#nonAddr_red').val() * 256;
    var nonAddr_G = $('#nonAddr_green').val() * 256;
    var nonAddr_B = $('#nonAddr_blue').val() * 256;

    var selectedEffect = $("#effect_list option:selected").text();
    for (var i in dictstack) {
        if (dictstack[i].name == selectedEffect) {
            dictstack[i].addr_duration = addr_duration;
            dictstack[i].addr_pattern = addr_pattern;
            if (addr_color == 'none') {
                dictstack[i].addr_color = addr_R + "," + addr_G + "," + addr_B;
            } else {
                if (addr_color == 'red') {
                    dictstack[i].addr_color = '65535,0,0';
                } else if (addr_color == 'green') {
                    dictstack[i].addr_color = '0,65535,0';
                } else if (addr_color == 'blue') {
                    dictstack[i].addr_color = '0,0,65535';
                } else if (addr_color == 'white') {
                    dictstack[i].addr_color = '65535,65535,65535';
                } else if (addr_color == 'orange') {
                    dictstack[i].addr_color = '65535,32512,0';
                } else if (addr_color == 'yellow') {
                    dictstack[i].addr_color = '65535,65535,0';
                } else if (addr_color == 'indigo') {
                    dictstack[i].addr_color = '19200,0,33280';
                } else if (addr_color == 'violet') {
                    dictstack[i].addr_color = '36608,0,65535';
                }
            }

            dictstack[i].direction = direction;
            dictstack[i].shape = shape;

            dictstack[i].nonAddr_duration = nonAddr_duration;
            dictstack[i].nonAddr_pattern = nonAddr_pattern;
            if (nonAddr_color == 'none') {
                dictstack[i].nonAddr_color = nonAddr_R + "," + nonAddr_G + "," + nonAddr_B;
            } else {
                if (nonAddr_color == 'red') {
                    dictstack[i].nonAddr_color = '65535,0,0';
                } else if (nonAddr_color == 'green') {
                    dictstack[i].nonAddr_color = '0,65535,0';
                } else if (nonAddr_color == 'blue') {
                    dictstack[i].nonAddr_color = '0,0,65535';
                } else if (nonAddr_color == 'white') {
                    dictstack[i].nonAddr_color = '65535,65535,65535';
                } else if (nonAddr_color == 'orange') {
                    dictstack[i].nonAddr_color = '65535,32512,0';
                } else if (nonAddr_color == 'yellow') {
                    dictstack[i].nonAddr_color = '65535,65535,0';
                } else if (nonAddr_color == 'indigo') {
                    dictstack[i].nonAddr_color = '19200,0,33280';
                } else if (nonAddr_color == 'violet') {
                    dictstack[i].nonAddr_color = '36608,0,65535';
                }
            }

        }

    }

}

function removeFromTimeLine(selectedId) {

    if (selectedId != 'none' && selectedId != null) {

        for (var i in count) {
            if (count[i].name == selectedId && count[i].cnt > 0) {
                for (var j = 1; j <= count[i].cnt; ++j) {
                    var k = 0;
                    //delete the jquery draggable object
                    if ($('#' + selectedId + j).length) {
                        $('#' + selectedId + j).remove();
                    }

                    for (k = 0; k < abstracteventstack.length; ++k) {
                        if (abstracteventstack[k].id == (selectedId + j))
                            break;
                    }

                    if (k > -1) abstracteventstack.splice(k, 1);

                }
                count[i].cnt = 0;
            }
        }

        $("#select-result").empty();
        $('#selecteffect').selectable("refresh");
    }

}



function switchElement(id){
    id = id || 0;

    $("#effect_list").find("option[value='"+id+"']").attr("selected", "selected");
    $("#effect_list").selectbox("detach");
     $("#effect_list").selectbox("attach");
     //continue here monday for making the elements corresponding to the timeline
}

function effectFactory() {
    //addressable led
    var addr_duration = 10;
    var addr_pattern = '';
    var addr_color = '';
    var addr_R = 0;
    var addr_G = 0;
    var addr_B = 0;
    var direction = '';
    var shape = '';

    //non-addressable led
    var nonAddr_duration = 10;
    var nonAddr_pattern = '';
    var nonAddr_color = '';
    var nonAddr_R = 0;
    var nonAddr_G = 0;
    var nonAddr_B = 0;


    //the name of the selected effect
    var selectedEffect = $("#select-result").text();
    for (var i in dictstack) {
        if (dictstack[i].name == selectedEffect) {
            addr_duration = dictstack[i].addr_duration;
            addr_pattern = dictstack[i].addr_pattern;
            addr_color = dictstack[i].addr_color;
            direction = dictstack[i].direction;
            shape = dictstack[i].shape;
            $("#input_addr_duration").val(addr_duration); //init value from json

            nonAddr_duration = dictstack[i].nonAddr_duration;
            nonAddr_pattern = dictstack[i].nonAddr_pattern;
            nonAddr_color = dictstack[i].nonAddr_color;

            $("#input_nonAddr_duration").val(nonAddr_duration);

        }
    }

    //string manipulation
    var addr_rgb = addr_color.split(",");
    addr_R = Math.floor(parseInt(addr_rgb[0]) / 256);
    addr_G = Math.floor(parseInt(addr_rgb[1]) / 256);
    addr_B = Math.floor(parseInt(addr_rgb[2]) / 256);

    var nonAddr_rgb = nonAddr_color.split(",");
    nonAddr_R = Math.floor(parseInt(nonAddr_rgb[0]) / 256);
    nonAddr_G = Math.floor(parseInt(nonAddr_rgb[1]) / 256);
    nonAddr_B = Math.floor(parseInt(nonAddr_rgb[2]) / 256);

    $('#controlPanel').hide(); //this hides the control panel
    $('#effectFactoryPanel').show(); //this show up the effectFactory panel for lights
    //animate
    $( "#effectFactoryPanel" ).animate({
    marginLeft: "-260px"
      }, 300 );
    //the panel header will display the abstract effect name
    $('#effectFactoryPanel').children().eq(0).html(selectedEffect);

    //resizable object for duration
    //maximum of 200px, corresponding to 10 sec, thus 20px per sec
    $("#addr_duration").resizable({
        handles: 'e, w',
        value:3,
        stop: function(event, ui) {
            $("#input_addr_duration").val(ui.size.width / 20.0);
        }
    }).css({"width" : 20.0*addr_duration+"px","height" : 30+"px"});

    //resizable object for duration
    $("#nonAddr_duration").resizable({
        handles: 'e, w',
        stop: function(event, ui) {
            $("#input_nonAddr_duration").val(ui.size.width / 20.0);
        }
    }).css({"width" : 20.0*nonAddr_duration+"px","height" : 30+"px"});

    $('#input_addr_duration').keyup(function() {
        $("#addr_duration").css("width", 20.0*$(this).val()+"px");
    });

    $('#input_nonAddr_duration').keyup(function() {
        $("#nonAddr_duration").css("width", 20.0*$(this).val()+"px");
    });


    //sanitation
    if(isNaN(addr_R)) addr_R= 'Red';
    if(isNaN(addr_G)) addr_G= 'Green';
    if(isNaN(addr_B)) addr_B= 'Blue';
    $('#addr_red').val(addr_R);
    $('#addr_green').val(addr_G);
    $('#addr_blue').val(addr_B);

     //sanitation
    if(isNaN(nonAddr_R)) nonAddr_R= 'Red';
    if(isNaN(nonAddr_G)) nonAddr_G= 'Green';
    if(isNaN(nonAddr_B)) nonAddr_B= 'Blue';
    $('#nonAddr_red').val(nonAddr_R);
    $('#nonAddr_green').val(nonAddr_G);
    $('#nonAddr_blue').val(nonAddr_B);

    var addr_display = 'none';
    //place candidate color

    if (addr_R == 255 && addr_G == 0 && addr_B == 0) {
        addr_display = 'red';
    } else if (addr_R == 0 && addr_G == 255 && addr_B == 0) {
        addr_display = 'green';
    } else if (addr_R == 0 && addr_G == 0 && addr_B == 255) {
        addr_display = 'blue';
    } else if (addr_R == 255 && addr_G == 255 && addr_B == 255) {
        addr_display = 'white';
    } else if (addr_R == 255 && addr_G == 127 && addr_B == 0) {
        addr_display = 'orange';
    } else if (addr_R == 255 && addr_G == 255 && addr_B == 0) {
        addr_display = 'yellow';
    } else if (addr_R == 75 && addr_G == 0 && addr_B == 130) {
        addr_display = 'indigo';
    } else if (addr_R == 143 && addr_G == 0 && addr_B == 255) {
        addr_display = 'violet';
    }

    var nonAddr_display = 'none';
    //place candidate color

    if (nonAddr_R == 255 && nonAddr_G == 0 && nonAddr_B == 0) {
        nonAddr_display = 'red';
    } else if (nonAddr_R == 0 && nonAddr_G == 255 && nonAddr_B == 0) {
        nonAddr_display = 'green';
    } else if (nonAddr_R == 0 && nonAddr_G == 0 && nonAddr_B == 255) {
        nonAddr_display = 'blue';
    } else if (nonAddr_R == 255 && nonAddr_G == 255 && nonAddr_B == 255) {
        nonAddr_display = 'white';
    } else if (nonAddr_R == 255 && nonAddr_G == 127 && nonAddr_B == 0) {
        nonAddr_display = 'orange';
    } else if (nonAddr_R == 255 && nonAddr_G == 255 && nonAddr_B == 0) {
        nonAddr_display = 'yellow';
    } else if (nonAddr_R == 75 && nonAddr_G == 0 && nonAddr_B == 130) {
        nonAddr_display = 'indigo';
    } else if (nonAddr_R == 143 && nonAddr_G == 0 && nonAddr_B == 255) {
        nonAddr_display = 'violet';
    }

    //select menu for light pattern using jquery ui selectmenu widget
    /*
    $( '#light_pattern' ).selectmenu();
    $( '#light_pattern' ).val(light_pattern).selectmenu("refresh");
    $( '#color' ).selectmenu().selectmenu( "menuWidget" ).addClass( "overflow" );
    $( '#color' ).val(color_display).selectmenu("refresh");
    $( '#direction' ).selectmenu();
    $( '#direction' ).val(direction).selectmenu("refresh");
    $( '#shape' ).selectmenu();
    $( '#shape' ).val(shape).selectmenu("refresh");
    */

    //select menu for light pattern using jquery core
    if(addr_pattern=='') addr_pattern = 'Pattern';
    if(addr_display=="none") addr_display = 'Color';
    if(direction == '') direction = 'Direction';
    if(shape == '')shape = 'Shape';
    if(nonAddr_pattern == '')nonAddr_pattern = 'none';

    $('#addr_pattern').val(addr_pattern);
    $('#addr_color').val(addr_display);
    $('#direction').val(direction);
    $('#shape').val(shape);

    $('#nonAddr_pattern').val(nonAddr_pattern);
    $('#nonAddr_color').val(nonAddr_display);

}


function add_draggable(selectedId, start_time, duration, layerid) //start_time and duration are floats
    {
        console.log("adding draggable , current layer is " + layerid);
        var v = document.getElementById('videoId');
        var display_width = ((duration / v.duration) * timelinelength).toString(); //handle the width of the draggable object according to the effect duration
        
        var pixel_per_sec = parseFloat(timelinelength / v.duration);
        
        var cnt;
   
        

        for (var i in count) {

            if (count[i].name == selectedId) {
                cnt = ++count[i].cnt;
             }
        }


         $('#layer_'+layerid).append("<div id=\"" + selectedId +  cnt + "\"  class=\"draggable timelineContent "+selectedId+"\" layerid=\""+layerid+"\" start=\""+start_time+"\" duration=\""+duration+"\" sel=\""+selectedId + cnt+"\"><p>"+selectedId+"</p></div>");
         //bind events
        
        if(display_width  > (selectedId.length * 10)){
            $('#'+selectedId +  cnt +" p").css("visibility","visible");
        } 

        var display_offset = ((start_time / v.duration) * timelinelength + $('#' + selectedId + cnt).parent().offset().left).toString();
         $('#' + selectedId + cnt).resizable({
            resize: function(event, ui) {
                ui.size.height = ui.originalSize.height;
                ckdisplayText(this.id, selectedId.length * 6, ui.size.width);
            }
        });
        
         

        $('#' + selectedId + cnt).draggable({
            axis: "x",
            drag: function(){
           drageffect = this.id;
           console.log(drageffect);
            isEffectDraging = true;},
            grid: [pixel_per_sec, 0] //make sure the draggable object moves every time with one second
        }).width(display_width + 'px').offset({
            left: display_offset
        });

        
         $( "#"+selectedId+cnt ).bind( "click", function() {
            var sid = getSIDByName(selectedId);
            console.log(sid);
            switchElement(sid);
            var sbid = $('#effect_list').attr("sb");
            highLight('#sbSelector_'+sbid);
          });
         $( "#"+selectedId+cnt ).bind( "mouseup", function() {
            var sid = getSIDByName(selectedId);
            console.log(sid);
            switchElement(sid);
            var sbid = $('#effect_list').attr("sb");
            highLight('#sbSelector_'+sbid);
          });

        $("#select-result").empty();
    }



function ckdisplayText(eid, textlength, containerLength){
    if((textlength +30)> containerLength){
        $('#'+eid +" p").css("visibility","hidden");
    } else{
        $('#'+eid +" p").css("visibility","visible");
    }
}
function highLight(div){
   $(div).animate({
          backgroundColor: "rgba(251,238,22,0.2)",
          color: "#fff"
     }, 100,function(){
        $(div).animate({backgroundColor: "rgba(0,0,0,0)"},600)
     });
}
function getSIDByName(name){
    for(i in namestack){
        if(namestack[i] == name){
            return i;
        }
    }
    return 0;
}


function load_Data() {

    if (!loadData) {
        loadTimestamp(video_id);
        loadDictionary();
        setTimeout(loaddraggable, 500); //wait till the above json request finishes

       }
}

function loaddraggable() {
    //add draggable here (use the global data structures saved from json files)
    console.log(print_r(colorArray));
    for (var i in abstracteventstack) {
        var name = abstracteventstack[i].name;
        for (var k in dictstack) {
            if (name == dictstack[k].name) {
                var duration = Math.max(dictstack[k].addr_duration, dictstack[k].nonAddr_duration);
                add_draggable(name, abstracteventstack[i].start_time, duration, abstracteventstack[i].layerid);
                applyColors(name);
            }
        }
    }
}


function loadDictionary() {
    //Meteor.log.info(JSON.stringify(orch_dict_data)); //for testing
    var dictData = Dictionary.findOne({});
    //console.log(dictData.dict);
    initEffectFactory(dictData.dict);
}

function loadTimestamp(video_id) {
    //Meteor.log.info(JSON.stringify(orch_time_data)); //for testing

    //check if video_name is already in the cloud. if it's already in the cloud, we load it. if not, we load a blank timestamp json object
    //if orch_time_data has video_name object
    var metaData = Metadata.findOne({});
    //console.log(metaData.meta);
    if(metaData.meta.hasOwnProperty(video_id))
    {
        console.log('video exists');
        initTimeline(metaData.meta[video_id]);
        initializeTimeCode(document.getElementById('videoId').duration);
    }    
    else 
        {
            console.log('video not exist');
            initTimeline(metaData.meta['default']);
        }
}


function initEffectFactory(json) {
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            //only save the duration status this time
            //addr_duration in sec, nonAddr_duration in sec
            dictstack.push(new dictobj(key, parseFloat(json[key]['light']['addr'].duration) / 1000.0, json[key]['light']['addr'].pattern, json[key]['light']['addr'].color, json[key]['light']['addr'].direction, json[key]['light']['addr'].shape, parseFloat(json[key]['light']['nonAddr'].duration) / 1000.0, json[key]['light']['nonAddr'].pattern, json[key]['light']['nonAddr'].color));
        }
    }

    //console.log(dictstack);

}

// var_dump function in js
var print_r = function (obj, t) {
 
    // define tab spacing
    var tab = t || '';
 
    // check if it's array
    var isArr = Object.prototype.toString.call(obj) === '[object Array]';
    
    // use {} for object, [] for array
    var str = isArr ? ('Array\n' + tab + '[\n') : ('Object\n' + tab + '{\n');
 
    // walk through it's properties
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var val1 = obj[prop];
            var val2 = '';
            var type = Object.prototype.toString.call(val1);
            switch (type) {
                
                // recursive if object/array
                case '[object Array]':
                case '[object Object]':
                    val2 = print_r(val1, (tab + '\t'));
                    break;
                    
                case '[object String]':
                    val2 = '\'' + val1 + '\'';
                    break;
                    
                default:
                    val2 = val1;
            }
            str += tab + '\t' + prop + ' => ' + val2 + ',\n';
        }
    }
    
    // remove extra comma for last property
    str = str.substring(0, str.length - 2) + '\n' + tab;
    
    return isArr ? (str + ']') : (str + '}');
};

function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    return out;
}
//handles initialization of the selectable in the control panel first and then add it to timeline according to time stamp
function initTimeline(json) {
    //initialize namestack
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            for (var i = 0; i < json[key].length; i++) {
                if (!arrayContains(json[key][i].name, namestack)) {
                    namestack.push(json[key][i].name);
                }
            }


        }
    }
           

     //layer initialized
    //handles initialization of the selectable in the control panel
    //initialize countstack
    for (var eid in namestack) {
       // $('#selecteffect').append("<li id = \"e" + namestack[name] + "\" class=\"ui-widget-content\">" + namestack[name] + "</li>");
        //console.log(name);
        if(eid % 2 == 1){
            $('#effecttimelines').append("<div id=layer_" + eid + " style=\"background-color:#151515; width:100%; height:35px; position:relative;\"></div>");
        }
        else{
            $('#effecttimelines').append("<div id=layer_" + eid + " style=\"background-color:#1d1d1d; width:100%; height:35px; position:relative;\"></div>");
        }
        
        count.push(new counter(namestack[eid]));

        // $("#effect_list").append($("<option></option>").attr("value",name).text(namestack[name])); 
        // get total number of layers
        totalTimelineLayers = eid;
    }

   
    //fastfind
    //window.location.reload();
    initEffectList();

    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            for (var i = 0; i < json[key].length; i++) {
                       //add_draggable(json[key][i].name,parseFloat(key),parseFloat(json[key][i].duration));  
                        //
                initializeColor(json[key][i].name);
                abstracteventstack.push(new abstractevent(json[key][i].name, json[key][i].id, parseFloat(key), json[key][i].type, json[key][i].layer));
            }
        }
    }

    for(var i = 0 ; i < totalTimelineLayers+1; i++){
     $( "#layer_"+i ).bind( "click", function() {
           highlightTimeline(this.id);
          
        });


     $( "#layer_"+i ).bind( "mouseup", function() {
         console.log("mouse up on ::: " + this.id + " ;;; current eid is " + i);
         ckswitchLayer(this.id);
      });

    }
    highlightTimeline("layer_0");

}

function initializeColor(name){
    if(!in_array(name,colorArray)){
        //store
        setColorValue(name);
    }
}

function applyColors(name){
        if(getValue(name, colorArray)!= ""){
        $("."+name).css("background-color", getValue(name,colorArray));
        $("."+name).css("background-image", "url('images/effectblock_back.png?new=123')");
        $("."+name).css("background-repeat", "repeat-x");
        } else {
          setColorValue(name);
        }
}

function setColorValue(name){
     colorArray[name] = "rgb("+parseInt(Math.random() * 100)+","+parseInt(Math.random() * 100)+","+parseInt(Math.random() * 100)+")";
}

function highlightTimeline(div){
    cActiveLayer = parseInt(div.split("_")[1]);

    for(var i = 0 ; i < totalTimelineLayers+1; i ++){
        $("#layer_"+i).css("background-image", "none");    
    }
    var t = $("#"+div);
    t.css("background-image", "url('images/timeline_highlights.png?renew=29014')");
    t.css("background-repeat","repeat-x");
}


function ckswitchLayer(layername){
    if(isEffectDraging){
        //ck if on the same layer
        var drag = $('#'+drageffect);

        var targetLayer = parseInt(layername.split("_")[1]);
        var effectLayer = drag.attr("layerid");
        console.log(" effect current on layer " + effectLayer + ", targetLayer is " + targetLayer);
        if(targetLayer != effectLayer){
            // move to target layer
            // change layer id
            console.log(drageffect+" is removed from layer :::: " + effectLayer);
            drag.remove();
            drag.clone(true).appendTo("#" + layername);
            var ndrag =  $("#"+drageffect);
            ndrag.attr("layerid", targetLayer);
            ndrag.draggable({
                axis: "x",
                drag: function(){
               drageffect = this.id;
               console.log(drageffect);
                isEffectDraging = true;}
                
            });
            ndrag.resizable({
            resize: function(event, ui) {
                ui.size.height = ui.originalSize.height;
                ckdisplayText(this.id, drageffect.length * 6, ui.size.width);
                }
            });
            ndrag.bind( "click", function() {
            var sid = getSIDByName(drageffect);
            console.log(sid);
            switchElement(sid);
            var sbid = $('#effect_list').attr("sb");
            highLight('#sbSelector_'+sbid);
          });
            ndrag.bind( "mouseup", function() {
                var sid = getSIDByName(drageffect);
                console.log(sid);
                switchElement(sid);
                var sbid = $('#effect_list').attr("sb");
                highLight('#sbSelector_'+sbid);
            });


            console.log(" adding back to layer --- " + targetLayer);
           
           
         //   drag.attr("layerid", targetLayer);
          //  var marginShift = 35 * (targetLayer - effectLayer);
         //   var currentMargin = parseInt(drag.css("marginTop"),10);
        //    var finalMarginShift = marginShift + currentMargin;
            // console.log(" margin shift is " + marginShift);
            // console.log(" current margin " + currentMargin);
            // console.log("final margin is " + finalMarginShift);
            // delete from current layer;
       //     drag.css("marginTop", marginShift + currentMargin + "px");
            // console.log(" margin after move " + drag.css("marginTop"));
        }
        isEffectDraging = false;
    }
}

//save the current changes from the application to the local data structures and update json file
function saveData() {


    //first clear the heap
    while (heap.size() != 0) {
        heap.pop();
    }

    update_start_time();
    //then put every draggable objects into the heap (record current position)
    for (var i in abstracteventstack) {
        heap.push({
            offset: abstracteventstack[i].start_time,
            id: abstracteventstack[i].id
        });
    }

    //console.log(heap.size());
    //while(heap.size()!=0)
    //{
    //   console.log(heap.pop());
    //}    


    /*

    //Parse time stamp json from string
    var event_string = '{';
    while (heap.size() > 1) {
        var event_id = heap.pop().id;
        for (i in abstracteventstack) {
            if (event_id == abstracteventstack[i].id) {
                event_string = event_string + '"' + Math.floor(abstracteventstack[i].start_time) + '":[{"id":"' + abstracteventstack[i].id + '","name":"' + abstracteventstack[i].name + '","type":"' + abstracteventstack[i].type + '"}],';
            }
        }
    }

    if (heap.size() == 1) {
        var event_id = heap.pop().id;
        for (i in abstracteventstack) {
            if (event_id == abstracteventstack[i].id) {
                event_string = event_string + '"' + Math.floor(abstracteventstack[i].start_time) + '":[{"id":"' + abstracteventstack[i].id + '","name":"' + abstracteventstack[i].name + '","type":"' + abstracteventstack[i].type + '"}]}';
            }
        }
    }

    var dict_string = '{';
    for (var i = 0; i < dictstack.length; ++i) {
        if (i == dictstack.length - 1) {
            dict_string = dict_string + '"' + dictstack[i].name + '":{"light":{"addr":{"duration":"' + (dictstack[i].addr_duration * 1000).toString() + '","pattern":"' + dictstack[i].addr_pattern + '","color":"' + dictstack[i].addr_color + '","direction":"' + dictstack[i].direction + '","shape":"' + dictstack[i].shape + '"},"nonAddr":{"duration":"' + (dictstack[i].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[i].nonAddr_pattern + '","color":"' + dictstack[i].nonAddr_color + '"}},"vest":{},"couch":{}}}';
        } else {
            dict_string = dict_string + '"' + dictstack[i].name + '":{"light":{"addr":{"duration":"' + (dictstack[i].addr_duration * 1000).toString() + '","pattern":"' + dictstack[i].addr_pattern + '","color":"' + dictstack[i].addr_color + '","direction":"' + dictstack[i].direction + '","shape":"' + dictstack[i].shape + '"},"nonAddr":{"duration":"' + (dictstack[i].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[i].nonAddr_pattern + '","color":"' + dictstack[i].nonAddr_color + '"}},"vest":{},"couch":{}},';
        }

    }

    //console.log(dict_string);


    //var json1 = $.parseJSON(event_string);
    //test of the json object
    //var json_string = '{"timestamp":' + event_string + ',"dictionary":' + dict_string + '}';
    var json = $.parseJSON(event_string);
    //console.log(json);

    var metaData = Metadata.findOne({});

    // var id = "TestMetaData";
    // var jsonToInsert = {
    //     "0": [{
    //         "id": "none",
    //         "name": "none",
    //         "type": "abstract_event"
    //     }]
    // };

    metaData.meta[video_id] = json;
    console.log(metaData);
    Metadata.update({
        _id: metaData._id
    }, {
        $set: {
            meta: metaData.meta
        }
    });

    //Meteor.call('orchPush', 'matrix', 'stable', json);
    */
}


function update_start_time() {
    var duration = document.getElementById('videoId').duration;
    for (var i in abstracteventstack) {
        var new_time = (parseFloat($('#' + abstracteventstack[i].id).offset().left- 
        $('#' + abstracteventstack[i].id).parent().offset().left) / timelinelength) * duration;
        abstracteventstack[i].start_time = new_time;
    }

}

//for sending back data to the cloud
function deployData() {
    //this is just a test
    //add draggable here (use the global data structures saved from json files)
        //Parse time stamp json from string
    alert("here");
    var event_string = '{';
    while (heap.size() > 1) {
        var event_id = heap.pop().id;
        for (i in abstracteventstack) {
            if (event_id == abstracteventstack[i].id) {
                event_string = event_string + '"' + Math.floor(abstracteventstack[i].start_time) + '":[{"id":"' + abstracteventstack[i].id + '","name":"' + abstracteventstack[i].name + '","type":"' + abstracteventstack[i].type + '"}],';
            }
        }
    }

    if (heap.size() == 1) {
        var event_id = heap.pop().id;
        for (i in abstracteventstack) {
            if (event_id == abstracteventstack[i].id) {
                event_string = event_string + '"' + Math.floor(abstracteventstack[i].start_time) + '":[{"id":"' + abstracteventstack[i].id + '","name":"' + abstracteventstack[i].name + '","type":"' + abstracteventstack[i].type + '"}]}';
            }
        }
    }

    if($("#select-result").text().length) update_dictionary();
    
    var dict_string = '{';
    for (var i = 0; i < dictstack.length; ++i) {
        if (i == dictstack.length - 1) {
            dict_string = dict_string + '"' + dictstack[i].name + '":{"light":{"addr":{"duration":"' + (dictstack[i].addr_duration * 1000).toString() + '","pattern":"' + dictstack[i].addr_pattern + '","color":"' + dictstack[i].addr_color + '","direction":"' + dictstack[i].direction + '","shape":"' + dictstack[i].shape + '"},"nonAddr":{"duration":"' + (dictstack[i].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[i].nonAddr_pattern + '","color":"' + dictstack[i].nonAddr_color + '"}},"vest":{},"couch":{}}}';
        } else {
            dict_string = dict_string + '"' + dictstack[i].name + '":{"light":{"addr":{"duration":"' + (dictstack[i].addr_duration * 1000).toString() + '","pattern":"' + dictstack[i].addr_pattern + '","color":"' + dictstack[i].addr_color + '","direction":"' + dictstack[i].direction + '","shape":"' + dictstack[i].shape + '"},"nonAddr":{"duration":"' + (dictstack[i].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[i].nonAddr_pattern + '","color":"' + dictstack[i].nonAddr_color + '"}},"vest":{},"couch":{}},';
        }

    }
    console.log("begining of dict_string");
    console.log(dict_string);
    console.log("begining of event");
    console.log(event_string);
    //var json1 = $.parseJSON(event_string);
    //test of the json object
    return false;
    //var json_string = '{"timestamp":' + event_string + ',"dictionary":' + dict_string + '}';
    var json = $.parseJSON(event_string);
    //console.log(json);

    var metaData = Metadata.findOne({});

    // var id = "TestMetaData";
    // var jsonToInsert = {
    //     "0": [{
    //         "id": "none",
    //         "name": "none",
    //         "type": "abstract_event"
    //     }]
    // };

    metaData.meta[video_id] = json;
    console.log(metaData);
    Metadata.update({
        _id: metaData._id
    }, {
        $set: {
            meta: metaData.meta
        }
    });

    //deploy the dictionary anyways here
    var dict_json = $.parseJSON(dict_string);
    //console.log(json);
    var dictData = Dictionary.findOne({});

    Dictionary.update({
        _id: dictData._id
    }, {
        $set: {
            dict: dict_json
        }
    });
}

//helper function for element finding in an array
function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
}

//initialize effect list the selectables
//changeinieffectlist
function initEffectList() {
    $("#selecteffect").selectable({
        stop: function() {
            var result = $("#select-result").empty();
            $(".ui-selected", this).each(function() {
                var name = $(this).text();
                result.append(name);
            });
        }
    });
    $('#selecteffect').selectable("refresh");
}

function counter(countname) {
    this.name = countname;
    this.cnt = 0;
}


//duration in milisec, color in 0 - 65535
function dictobj(name, addr_duration, addr_pattern, addr_color, direction, shape, nonAddr_duration, nonAddr_pattern, nonAddr_color) {
    this.name = name;
    this.addr_duration = addr_duration;
    this.addr_pattern = addr_pattern;
    this.addr_color = addr_color;
    this.direction = direction;
    this.shape = shape;
    this.nonAddr_duration = nonAddr_duration;
    this.nonAddr_pattern = nonAddr_pattern;
    this.nonAddr_color = nonAddr_color;
}



//this is the element obj in abstracteventstack
function abstractevent(name, id, start_time, type, layerid) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.layerid = layerid;
    this.start_time = start_time;
}

/*
=================================
js-binaryheap-decreasekey - v0.1
https://github.com/rombdn/js-binaryheap-decreasekey
Based on a Binary Heap implementation found in the book
Eloquent Javascript by Marijn Haverbeke
http://eloquentjavascript.net/appendix2.html
(c) 2013 Romain BEAUDON
This code may be freely distributed under the MIT License
=================================
*/


function BinaryHeap(scoreFunction, idFunction, valueProp) {
    this.content = [];
    this.scoreFunction = scoreFunction;
    this.idFunction = idFunction;
    this.valueProp = valueProp;
    this.map = {};
}


BinaryHeap.prototype.size = function() {
    return this.content.length;
};

BinaryHeap.prototype.push = function(elt) {
    if (this.map[this.idFunction(elt)] !== undefined) {
        throw 'Error: id "' + this.idFunction(elt) + '" already present in heap';
        return;
    }

    this.content.push(elt);
    var index = this.bubbleUp(this.content.length - 1);
    //this.map[this.idFunction(elt)] = index;
    //console.log(this.map);
};

BinaryHeap.prototype.pop = function() {
    var result = this.content[0];
    var end = this.content.pop();

    delete this.map[this.idFunction(result)];

    if (this.content.length > 0) {
        this.content[0] = end;
        this.map[this.idFunction(end)] = 0;
        var index = this.sinkDown(0);
        //this.map[this.idFunction(end)] = index;
        //console.log(this.map);
    }

    return result;
};

BinaryHeap.prototype.bubbleUp = function(n) {
    var element = this.content[n];
    var score = this.scoreFunction(element);

    while (n > 0) {
        var parentN = Math.floor((n - 1) / 2);
        var parent = this.content[parentN];
        //console.log('Element index: ' + n);
        //console.log('Parent index: ' + parentN + ', Parent element: ' + parent);

        if (this.scoreFunction(parent) < score)
            break;

        //console.log('Element score ', score, ' < Parent score ', this.scoreFunction(parent), ' => swap');
        this.map[this.idFunction(element)] = parentN;
        this.map[this.idFunction(parent)] = n;

        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
    }

    this.map[this.idFunction(element)] = n;

    return n;
};

BinaryHeap.prototype.sinkDown = function(n) {
    var element = this.content[n];
    var score = this.scoreFunction(element);

    while (true) {
        var child2N = (n + 1) * 2;
        var child1N = child2N - 1;
        var swap = null;
        /*
                    console.log('element: ' + element, ', score: ' + score, ', position: ', n);
                    console.log('child1: ' + child1N, ',', this.content[child1N]);
                    console.log('child2: ' + child2N, ',', this.content[child2N]);
        */
        if (child1N < this.content.length) {
            var child1 = this.content[child1N];
            child1score = this.scoreFunction(child1);
            if (score > child1score) {
                //console.log('child1 score < elemscore');
                swap = child1N;
            }
        }

        if (child2N < this.content.length) {
            var child2 = this.content[child2N];
            var child2score = this.scoreFunction(child2);
            //console.log((swap == null ? score : child1score), ' >= ', child2score, ' => ', (swap == null ? score : child1score) >= child2score);
            if ((swap == null ? score : child1score) > child2score) {
                //console.log('child2 score < elemscore');
                swap = child2N;
            }
        }

        if (swap == null) break;


        //console.log('swap ', n, ' with ', swap);
        this.map[this.idFunction(this.content[swap])] = n;
        this.map[this.idFunction(element)] = swap;

        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
    }

    this.map[this.idFunction(element)] = n;

    return n;
};

BinaryHeap.prototype.decreaseKey = function(id, value) {
    var n = this.map[id];
    //console.log('Decreasing key for element ' + id + ' from value ' + this.content[n][this.valueProp] + ' to ' + value);
    this.content[n][this.valueProp] = value;
    this.bubbleUp(n);
};

//generate uuid from current time
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

//hash function 
hashCode = function(s) {
    return s.split("").reduce(function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a
    }, 0);
}

//2089841711

